import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (receivers: string, link: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'PRODUCTION',
    auth: {
      user: config.gmail,
      pass: config.gmail_pass,
    },
  });

  await transporter.sendMail({
    from: config.gmail, // sender address
    to: receivers, // list of receivers
    subject: 'Password Reset', // Subject line
    text: 'Password Reset', // plain text body
    html: `

    <body>

  <div>
    <h2>Password Reset</h2>
    <p>You have requested a password reset. Click the link below to reset your password:</p>
    <a href="${link}">Reset Password</a>
  </div>

  </body>

    `,
  });
};
