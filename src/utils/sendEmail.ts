import {
    createTestAccount,
    createTransport,
    getTestMessageUrl,
} from 'nodemailer';
export async function sendEmail(email: string, url: string) {
    const testAccount = await createTestAccount();

    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    const emailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `<a href="${url}">${url}</a>`, // html body
    };

    const info = await transporter.sendMail(emailOptions);

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', getTestMessageUrl(info));
}
