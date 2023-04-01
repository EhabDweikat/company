const nodemailer = require("nodemailer");

 async function sendEmail(dest,subject,message){
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: "abumhamaddweikat@gmail.com", // generated ethereal user
        pass: "arbyjfpyxebjivxq"
        , // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"confirm email" | ehab company <${process.env.nodeMailerE}>`, // sender address
      to: dest, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    return info;
}
module.exports={sendEmail};

