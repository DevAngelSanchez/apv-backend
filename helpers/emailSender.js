import nodemailer from 'nodemailer';

export const RegisterEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, name, token } = data;
  const info = await transporter.sendMail({
    from: "Administrador de Pacientes Veterinaria",
    to: email,
    subject: "Verify your Account on APV",
    text: "Verify your account on APV",
    html: `
      <p>Hello ${name}, verify your account on APV</p>
      <p>Your account is ready, just verify on the link below:
        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Verify account</a>
      </p>

      <p>If don't create any account, please ignore this email.</p>
    `

  });

  console.log("Mensaje enviado - " + info.messageId);
};

export const ResetPassEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, name, token } = data;
  const info = await transporter.sendMail({
    from: "Administrador de Pacientes Veterinaria",
    to: email,
    subject: "Reset your password",
    text: "Reset your password",
    html: `
      <p>Hello ${name}, you have requested renew your password</p>
      <p>Reset yuor password on the link below:
        <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset password</a>
      </p>

      <p>If you don't request this, please ignore this email.</p>
    `

  });

  console.log("Mensaje enviado - " + info.messageId);
};