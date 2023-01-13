var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'm.jawahiruzzaman@gmail.com',
    pass: 'arxgttnritxenxlg'
  }
});



const sendMail = (user) => {
  var mailOptions = {
    from: 'tokobang@tokobang.com',
    to: user.dataValues.email,
    subject: 'Hoorey barang anda ada yang membeli',
    html: `
      <h1 style="text-align:center; font-wight:bold;"> TOKOBANG </h1>
      Hallo, ${user.dataValues.name} 
      barang yang anda jual di tokobang ada yang beli nihhh,
      saldo anda menjadi ${user.dataValues.dataValues.amount}, yuuk segera cek ke website nyaa
    `
  };
  transporter.sendMail(mailOptions, function (error, info) {
    console.log(user)
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }
  );
}

module.exports = sendMail