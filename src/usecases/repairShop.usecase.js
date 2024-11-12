const createError = require('http-errors');
const RepairShop = require('../models/repairShop.model');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


async function getById(id, repairShopId) {

    
    if (id.toString() !== repairShopId.toString()) {
       throw createError (403, "Unauthorized to get the info.")
    }

    const repairShop = await RepairShop.findById(id)
        .populate({
            path: 'quotes',
            model: 'RepairShopQuote',
            populate: [
                {
                    path: 'car',
                    select: 'brand model year version'
                },
                {
                    path: 'mechanic',
                    model: 'Mechanic'
                }
            ]
        });

    if (!repairShop) {
        throw createError(404, 'Repair shop not found.');
    }

    return repairShop;
}

async function createExpressAccount(id) {
    const repairShop = await RepairShop.findById(id);

    const account = await stripe.accounts.create({
        type: 'express',
        country: 'MX',
        capabilities: {
            transfers: { requested: true },
        },
        business_type: 'company',
        business_profile: {
            name: repairShop.companyName,
            mcc: '7538', // specific category code for automotive services
        },
        settings: {
            payouts: { schedule: { interval: 'manual' } }, 
        },
    });

    repairShop.stripeAccountId = account.id;
    await repairShop.save();
    return repairShop;
} 

async function createAccountLink(id, repairShopId) {

    if (id.toString() !== repairShopId.toString()) {
        throw createError (403, "Unauthorized to get the info.")
     }
    const repairShop = await RepairShop.findById(id);
    const accountLink = await stripe.accountLinks.create({
        account: repairShop.stripeAccountId,
        refresh_url: `${process.env.BASE_URL}/dashboard`,
        return_url: `${process.env.BASE_URL}/dashboard`,
        type: 'account_onboarding',
    });
    return accountLink.url;
}

async function updateStripeAccount(id, repairShopId) {
    if (id.toString() !== repairShopId.toString()) {
        throw createError (403, "Unauthorized to get the info.")
     }

     const repairShop = await RepairShop.findById(id);
     const accountId = repairShop.stripeAccountId;
      const account = await stripe.accounts.update(accountId, {
        metadata: { lastUpdateCheck: new Date().toISOString() }
      });
    return account;
  }




module.exports = {
    getById,
    createAccountLink,
    createExpressAccount,
    updateStripeAccount,
}

