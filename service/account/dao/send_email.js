const nodemailer = require('nodemailer');

const send = (to, title, body) => {

  return new Promise( (resolve, reject) => {

    const transporter = nodemailer.createTransport({
      host : 'smtp.mxhichina.com',
      port: 465, // SMTP 端口
      secureConnection: true, // 使用 SSL
      auth: {
        user: 'art@weavinghorse.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: process.env.EMAIL_PASSWD
      }
    })

    const mailOptions = {
      from: 'art@weavinghorse.com', // 发件地址
      to: to, // 收件列表
      subject: title, // 标题
      //text和html两者只支持一种
      text: title, // 标题
      html: body // html 内容
    };

    transporter.sendMail(mailOptions, function(error, response){
      if(error){
        console.log("main send fail")
        reject(error)
      }else{
        console.log("Message sent: " + response.message);
        resolve(true)
      }
      transporter.close(); // 如果没用，关闭连接池
    });
  })

}

const TPL_REG = (activation_code) => {
  return `
        <p>您好！</p>
        <p>&nbsp;&nbsp;您的算法课程帐号需要激活。</p>
        <p>&nbsp;&nbsp;请去<a href="http://www.weavinghorse.com/activation?code=${activation_code}">点击此处激活</a></p>
        <p>谢谢！</p>
`
}

module.exports = {
  send,
  TPL_REG
}
