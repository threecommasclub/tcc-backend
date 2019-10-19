import nodemailer from 'nodemailer';

export class MailService {
  private _transporter: nodemailer.Transporter;

  constructor() {
    // TODO: use master email
    this._transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'alexandria.hessel88@ethereal.email',
        pass: 'rpgkSkgQnxxBhV5qNV',
      },
    });
  }

  sendMail(to: string, subject: string, content: string): Promise<string | Error> {
    const options = {
      from: 'threecommasclub.master@gmail.com',
      to: to,
      subject: subject,
      text: content,
    };

    return new Promise<string | Error>((resolve: (msg: string) => void, reject: (err: Error) => void) => {
      this._transporter.sendMail(options, (error, info) => {
        if (error) {
          console.log(`error: ${error}`);
          reject(error);
        }
        console.log('MailService sent email success', info.response);
        resolve(`Message sent email success ${info.response}`);
      });
    });
  }
}
