import {
    createTestAccount,
    createTransport,
    getTestMessageUrl,
} from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
export const sendEmail = async (emailOptions: Mail.Options) => {
    const testAccount = await createTestAccount();
    const transporter =
        process.env.NODE_ENV === 'production'
            ? createTransport({
                  service: 'gmail',
                  auth: {
                      user: process.env.GMAIL_USER,
                      pass: process.env.GMAIL_PASSWORD,
                  },
              })
            : createTransport({
                  host: 'smtp.ethereal.email',
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                      user: testAccount.user, // generated ethereal user
                      pass: testAccount.pass, // generated ethereal password
                  },
              });

    const info = await transporter.sendMail(emailOptions);

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', getTestMessageUrl(info));
};

export const sendConfirmationEmail = async (email: string, code: string) => {
    await sendEmail({
        from: '"Efurrax Bot 🤖" <contact.efurrax@gmail.com>',
        to: email,
        subject: 'Your confirmation code to Efurrax',
        text: `Your code is ${code}`,
        html: `Your code is <strong>${code}</strong>`,
    });
};

export const sendResetPasswordEmail = async (email: string, url: string) => {
    await sendEmail({
        from: '"Efurrax Bot 🤖" <contact.efurrax@gmail.com>',
        to: email,
        subject: 'Your reset password url',
        text: `Change your password at ${url}`,
        html: `Change your password at <a href="${url}">${url}</a>`,
    });
};

export const sendAppointmentEmail = async (
    userEmail: string,
    furraxEmail: string,
    userUsername: string,
    furraxUsername: string,
    date: string
) => {
    const first = sendEmail({
        from: '"Efurrax Bot 🤖" <contact.efurrax@gmail.com>',
        to: userEmail,
        subject: 'You have a new apppointment',
        html: `You made an appointment with ${furraxUsername} on ${date}, you will receive a notification when your appointment is confirmed`,
    });
    const second = sendEmail({
        from: '"Efurrax Bot 🤖" <contact.efurrax@gmail.com>',
        to: furraxEmail,
        subject: 'You have a new demand of appointment',
        html: `${userUsername} wants to play with you on ${date}`,
    });
    return Promise.all([first, second]);
};
