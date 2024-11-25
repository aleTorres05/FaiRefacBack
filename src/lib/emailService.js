const nodemailer = require("nodemailer");
const User = require("../models/user.model")

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "fairefac@gmail.com",
    to: email,
    subject: "Codigo de Verificación",
    text: `Tu codigo de verificación es el siguiente ${otp}, es valido por un periodo de 10 minutos.`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendNewQuoteNotification(repairShops) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const sendEmailPromises = repairShops.map(async (shop) => {
    const user = await User.findOne({ repairShop: shop._id });
    if (user && user.email) {
      const mailOptions = {
        from: "fairefac@gmail.com",
        to: user.email,
        subject: "Nueva Cotización Disponible",
        text: `Hola ${shop.companyName},\n\nTienes una nueva cotización disponible.\n\nPor favor, revisa tu panel de seguimiento para más información.\n\nGracias,\nEquipo Fairefac`,
      };

      await transporter.sendMail(mailOptions);
    }
  });

  await Promise.all(sendEmailPromises);
}

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendNewQuoteNotification,
};
