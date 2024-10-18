const Quote = require('../models/quote.model');
const RepairShopQuote = require('../models/repairShopQuote.model');
const Car = require('../models/car.model');
const RepairShop = require('../models/repairShop.model');
const Mechanic = require('../models/mechanic.model');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const createError = require('http-errors');


async function create( carId, mechanicId, items ) {
    
    if (!carId || !mechanicId || !items || items.length === 0) {
        throw createError(400, "Missing required data to create the quote.");
    }

    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
        throw createError(404, "Mechanic not found.");
    }

    const car = await Car.findById(carId);
    if (!car) {
        throw createError(404, "Car not found.");
    }

    const repairShops = await RepairShop.find({ "address.zipCode": mechanic.address.zipCode });
    if (!repairShops.length) {
        throw createError(404, "No repair shops found for the mechanic's postal code.");
    }

    const newQuote = new Quote({
        items: items.map(item => ({
            concept: item.concept,
            quantity: item.quantity,
        })),
        total: 0,
        status: "initial",
    });

    const savedQuote = await newQuote.save();

    car.quotes.push(savedQuote._id);
    await car.save();

    await Promise.all(repairShops.map(async (shop) => {
        const newRepairShopQuote = new RepairShopQuote({
            car: carId,
            mechanic: mechanicId,
            repairShop: shop._id,
            items: items.map(item => ({
                concept: item.concept,
                quantity: item.quantity,
            })),
            totalPrice: 0,
            status: "initial",
        });

        const savedRepairShopQuote = await newRepairShopQuote.save();

        shop.quotes.push(savedRepairShopQuote._id);
        await shop.save();

        newQuote.repairShopQuotes.push(savedRepairShopQuote._id);
    }));

    await newQuote.save();

    return newQuote; 
}


async function getById(id) {
    if (!id) {
        throw createError(400, "Quote ID is required.");
    }

    const quote = await Quote.findById(id)
        .populate({
            path: 'repairShopQuotes',
            populate: [
                { path: 'repairShop', select: 'companyName phoneNumber address' }, 
                {
                    path: 'items', 
                    model: 'RepairShopQuote',
                    select: 'concept quantity unitPrice itemTotalPrice brand'
                }
            ]
        });

    
    if (!quote) {
        throw createError(404, "Quote not found.");
    }

    return quote;
}

async function calculateTotalById(id) {
    const quote = await Quote.findById(id).populate('repairShopQuotes')
    if (!quote) {
        throw createError(404, "Quote not found")
    }

    const total = quote.repairShopQuotes.reduce((sum, repairShopQuote) => {
        return sum + (repairShopQuote.totalPrice || 0);
    }, 0);

    quote.total = total

    await quote.save();

    return quote;

}

async function rejectRepairShopQuoteById(id, repairShopQuoteId) {
    const quote = await Quote.findById(id);

    if (!quote) {
        throw createError(404, "Quote not found");
    };

    const repairShopQuote = quote.repairShopQuotes.find(
        (quote) => quote._id.toString() === repairShopQuoteId.toString()
    )

    if (!repairShopQuote) {
        throw createError(404, "RepairShopQuote does not belong to this quote")
    }

    repairShopQuote.status = "rejected";

    quote.repairShopQuotes = quote.repairShopQuotes.filter(
        (quote) => quote._id.toString() !== repairShopQuoteId.toString()
    );

    await RepairShopQuote.findByIdAndUpdate(repairShopQuoteId, { status: "rejected"});
    await quote.save();

    const calculateQuote = await calculateTotalById(id)

    return calculateQuote.populate({
        path: 'repairShopQuotes',
        populate: [
            { path: 'repairShop', select: 'companyName phoneNumber address' }, 
            {
                path: 'items', 
                model: 'RepairShopQuote',
                select: 'concept quantity unitPrice itemTotalPrice brand'
            }
        ]
    });
}

async function createCheckoutSession(id) {
    
    const quote = await calculateTotalById(id);

    if (!quote.total || quote.total <= 0) {
        throw createError(400, "Quote total must be greater than zero");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'mxn',
                product_data: {
                    name: 'Cotización de refacciones',
                },
                unit_amount: Math.round(quote.total * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    quote.sessionId = session.id;
    await quote.save();

    return session;
};

async function handleStripeEvent(req) {
    const sig = req.headers['stripe-signature'];
    

    let event;

    try {

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);

    } catch (error) {
        throw createError(500, `Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Checkout session completed for session:", session);

        const quote = await Quote.findOne({ sessionId: session.id }).populate('repairShopQuotes');

        if (quote) {
            quote.status = 'paid';
            quote.paymentId = session.payment_intent;
            quote.ticketUrl = session.receipt_url; 

            const updateRepairShopQuotes = quote.repairShopQuotes.map(async (repairShopQuoteId) => {
                const repairShopQuote = await RepairShopQuote.findById(repairShopQuoteId);
                if (repairShopQuote) {
                    repairShopQuote.status = 'paid';
                    return await repairShopQuote.save(); 
                } else {
                    console.log('RepairShopQuote not found for session.id:', session.id);
                }
            });

            await Promise.all(updateRepairShopQuotes);
            await quote.save(); 

            console.log(`Quote ${quote._id} and associated RepairShopQuotes marked as paid.`);
        } else {
            console.log('Quote not found for session.id:', session.id);
        }
    }

    return { success: true, message: 'Event handled' };
}





module.exports = {
    create,
    getById,
    calculateTotalById,
    rejectRepairShopQuoteById,
    createCheckoutSession,
    handleStripeEvent,
};
