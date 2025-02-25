import { sendmail } from "../services/mailService.js"
export const sendMail = async (req,res) => {
    let data
    if(req.body.meetingId && req.body.password){
        data = [req.body.meetingId, req.body.password]
           
    }
    else if(req.body.message){
        data = req.body.message
    }
    else if(req.body.otp){
        data = req.body.otp
    }
    else{
        res.json({success: false})
    }    
    console.log('mail sent: ', data)

    try{
        sendmail(data);
        res.json({success: true})
    }catch(e){
        console.log(e)
        res.json(e)
    }
   

}