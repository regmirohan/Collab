import nodemailer from 'nodemailer'

export function sendmail(data){
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "collab0310@gmail.com",
        pass: "jqry sxss klut tphp"
    }
})
let mailOptions
if(Array.isArray(data)){
  const [meetingId, password] = data
  mailOptions = {
    from: "collab0310@gmail.com",
    to: "pratikgiri2320@gmail.com",
    subject: "Collab Invitation",
    text: `Meeting Id: ${meetingId}, Password: ${password}`
  };
}
else{
  mailOptions = {
    from: "collab0310@gmail.com",
    to: "pratikgiri2320@gmail.com",
    subject: "A Client Contacted",
    text: data,
  };
}

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
          } else {
            console.log("Email sent: ", info.response);
          }
      })
  }

  