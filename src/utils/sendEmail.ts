import {
    createTestAccount,
    createTransport,
    getTestMessageUrl,
} from 'nodemailer';
export async function sendEmail(email: string, code: string) {
    const testAccount = await createTestAccount();
    const transporter =
        process.env.NODE_ENV === 'production'
            ? createTransport({
                  service: 'gmail',
                  auth: {
                      user: process.env.GMAIL_USER,
                      pass: process.env.GMAIL_PASS,
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

    const emailOptions = {
        from: '"Efurrax Bot 🤖" <contact.efurrax@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Your confirmation code to Efurrax', // Subject line
        text: `Your code is ${code}`, // plain text body
        html: `Your code is <strong>${code}</strong>`, // html body
    };

    const info = await transporter.sendMail(emailOptions);

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', getTestMessageUrl(info));
}
