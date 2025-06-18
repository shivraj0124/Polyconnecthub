const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendmail = (receivermail, username, password, type) => {
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
          .credentials { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 5px; }
          .footer { text-align: center; padding: 15px; font-size: 12px; color: #777777; background-color: #f0f0f0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="email-content">
              <div class="header">PollyConnectHub</div>
              <div class="body">
                  <p>You have been appointed as <strong>${type}</strong> of the college.</p>
                  <div class="credentials">
                      <p><strong>Username:</strong> ${username}</p>
                      <p><strong>Password:</strong> ${password}</p>
                  </div>
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
    subject: "PollyconnectHub Appointment Notification",
    html: htmlTemplate, // <--- this is now html email
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
