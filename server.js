const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const app = express();
const fs = require('fs');
// loads environment variable
require('dotenv').config();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const data = fs.readFileSync('./index.html', { encoding: 'utf8' });

// Display the file data
console.log(data);
app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res, next) => {
  let { email, subject, message } = req.body;
  // res.render('message', { email, subject, message });
  console.log(req.body);
  // use sendgrid or mailgun look into it
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // transporter.use('compile', hbs({ viewEngine: 'hbs', viewPath: './views/' }));

  transporter
    .sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `${subject}`,
      text: message,
      // attachments: [{ filename: 'space.jpg', path: './space.jpg' }],
      html: `${data}`,
      // template: 'index.html',
    })
    .then((info) => res.render('message', { email, subject, message, info }))
    .catch((error) => console.log(error));
});

// app.post('/send', (req, res) => {
//   const { name, email, phone, message } = req.body;
//   const output = `<p>You have a new email</p>
//   <h3>Contact Details</h3>
//   <ul>
//   <li>Name: ${name}<li>
//   <li>Phone: ${phone}<li>

//   <li>Email: ${email}<li>
//   </ul>
//   <h3>Message</h3>
//   <p> ${message}<p>

//   `;
//   async function main() {
//     let transporter = nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: testAccount.user, // generated ethereal user
//         pass: testAccount.pass, // generated ethereal password
//       },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Fred Foo 👻" <foo@example.com>', // sender address
//       to: 'bar@example.com, baz@example.com', // list of receivers
//       subject: 'Hello ✔', // Subject line
//       text: 'Hello world?', // plain text body
//       html: '<b>Hello world?</b>', // html body
//     });
//   }
//   console.log('Message sent: %s', info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// });

const port = 5000;

// start server

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
