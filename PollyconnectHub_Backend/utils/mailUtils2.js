const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendmail = ( receivermail, subject, bodyContent ) => {
    console.log("Sending email to:", receivermail, subject, bodyContent);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PollyConnectHub Notification</title>
      <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { width: 100%; padding: 20px; display: flex; justify-content: center; }
          .email-content { background-color: #ffffff; border-radius: 8px; max-width: 600px; width: 100%; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
          .header { background-color: #4caf50; color: white; text-align: center; padding: 20px; font-size: 24px; font-weight: bold; }
          .body { padding: 20px; color: #333333; line-height: 1.5; font-size: 16px; }
          .footer { text-align: center; padding: 15px; font-size: 12px; color: #777777; background-color: #f0f0f0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="email-content">
              <div class="header">PollyConnectHub</div>
              <div class="body">
                  ${bodyContent}
              </div>
              <div class="footer">
                  For any queries, contact our support.<br>
                  &copy; 2025 PollyConnectHub. All rights reserved.
              </div>
          </div>
      </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.email,
    to: receivermail,
    subject,
    html: htmlTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendmail;
