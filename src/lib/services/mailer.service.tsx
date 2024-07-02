import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {ObjectId} from "mongodb";

dotenv.config();

interface Gallery {
  _id: ObjectId;
  name: string;
  description: string;
  email: string;
}

class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(gallery: Gallery) {
    const mailOptions = {
      from: `"Luxoria App" <${process.env.SMTP_USER}>`,
      to: gallery.email,
      subject: `Luxoria - Invited to ${gallery.name}`,
      text: `Dear ${gallery.name},\n\n${gallery.description}`,
      html: `
        <h1>Luxoria App.</h1>
        <h2>Hello,</h2>
        <p>This is Luxoria app.</p>
        <br/>
        <p>Gallery name: ${gallery.name}</p>
        <p>${gallery.description}</p>
        
        <p>You have been invited to visit our Gallery ${gallery.name}</p>
        <p>Click <a href="${process.env.APP_URL}/galleries/${gallery._id}">here</a> to visit the gallery.</p>
        
        <br/>
        <p>Gallery ID : ${gallery._id}</p>
        
        <p>Thank you for using our app.</p>
        <p>Best regards</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email: %s', error);
    }
  }
}

export default MailerService;