const nodemailer = require("nodemailer")

const sendEmail = async (correo, fondo, monto, categoria, nombreUsuario) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "felipeacxdev@gmail.com",
      pass: "chmaksmqiizzrexz",
    },
  })

  const mailOptions = {
    from: "felipeacxdev@gmail.com",
    to: correo,
    subject: "Suscripción éxitosa al fondo " + fondo,
    text: "Suscripción éxitosa",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Felicidades por tu Suscripción</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #333333;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #777777;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>¡Felicidades por tu Suscripción al fondo ${fondo}!</h1>
              <p>Estimado/a ${nombreUsuario},</p>
              <p>Nos complace informarte que has sido suscrito exitosamente al fondo <strong>${fondo}</strong>. Te agradecemos por confiar en nosotros y realizar esta inversión.</p>
               <p>¡Gracias por ser parte de nuestra comunidad!</p>
              <p>Has invertido ${monto
                .toLocaleString("es-ES")
                .replace(/,/g, ".")} en el fondo ${fondo} de tipo ${categoria}</p>
              <div class="footer">
                  <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Correo enviado:", info.response)
  } catch (error) {
    console.error("Error al enviar el correo:", error)
  }
}

module.exports = { sendEmail }
