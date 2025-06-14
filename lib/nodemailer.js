import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, name, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    authMethod: "LOGIN",
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `Medelle Assist <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject: "Verifica tu correo electrónico - Medelle",
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu correo - Medelle</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f7;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 40px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #000000;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }
        .logo {
            max-width: 100px;
        }
        .content {
            text-align: center;
            padding: 30px 20px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .button {
            background-color: #000000;
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
        .button span {
            color: #ffffff;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://assets.unlayer.com/projects/0/1742858060008-app-logo-modified.png" alt="Medelle Logo" class="logo">
            <h1>Bienvenido a Medelle</h1>
        </div>
        <div class="content">
            <p>Hola ${name},</p>
            <p>Gracias por unirte a Medelle. Por favor verifica tu correo electrónico haciendo clic en el botón abajo:</p>
            <a href="${verificationUrl}" class="button"><span>Verificar correo electrónico</span></a>
            <p>Este enlace tiene una validez de 30 minutos. Si no solicitaste esta verificación, puedes ignorar este correo.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Medelle. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    if (error.code === "EAUTH") {
      console.error("Falló la autenticación. Verifica tu correo y contraseña.");
    }
  }
}

export async function sendPasswordResetEmail(to, name, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    authMethod: "LOGIN",
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `Medelle Assist <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject: "Restablece tu contraseña - Medelle",
    html: `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu contraseña - Medelle</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f7;
              color: #333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              background-color: #ffffff;
              margin: 40px auto;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-top: 5px solid #000000;
          }
          .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eaeaea;
          }
          .logo {
              max-width: 100px;
          }
          .content {
              text-align: center;
              padding: 30px 20px;
          }
          h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
          }
          .button {
              background-color: #000000;
              color: #ffffff;
              padding: 12px 25px;
              text-decoration: none;
              font-size: 16px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
          }
          .button span {
              color: #ffffff;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              color: #999;
              padding-top: 20px;
              border-top: 1px solid #eaeaea;
          }
          .footer p {
              margin: 0;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="https://assets.unlayer.com/projects/0/1742858060008-app-logo-modified.png" alt="Medelle Logo" class="logo">
              <h1>Restablece tu contraseña</h1>
          </div>
          <div class="content">
              <p>Hola ${name},</p>
              <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para elegir una nueva contraseña:</p>
              <a href="${resetUrl}" class="button"><span>Restablecer contraseña</span></a>
              <p>Este enlace tiene una validez de 30 minutos. Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Medelle. Todos los derechos reservados.</p>
          </div>
      </div>
  </body>
  </html>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    if (error.code === "EAUTH") {
      console.error("Falló la autenticación. Verifica tu correo y contraseña.");
    }
  }
}
