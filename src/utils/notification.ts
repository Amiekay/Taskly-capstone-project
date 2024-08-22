import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendNotification = (email: string, subject: string, text: string) => {
  const mailOptions = {
    from: "marachicks@gmail.com",
    to: email,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export { sendNotification };
