const nodemailer = require('nodemailer')


function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}


async function sendOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from:'fairefac@gmail.com',
        to: email,
        subject: 'Codigo de Verificación',
        text: `Tu codigo de verificación es el siguiente ${otp}, es valido por un periodo de 10 minutos.`
    };

    await transporter.sendMail(mailOptions);
}


module.exports = {
    generateOTP,
    sendOTPEmail,
}