import nodemailer from "nodemailer";

const sendEmail = async (email, uploadFile) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or 'outlook', 'yahoo', etc.
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password or app password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'One Order Has been Placed',
            html: `
  <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f5f5f5;">

  <!-- Main Container -->

  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

<div style="background-color: #a16207; padding: 20px; text-align: center;">
  <h2 style="color: #ffffff; margin: 0;">Spexnation</h2>
  <p style="color: #ddd; margin: 5px 0 0;">Trusted Glasses Provider</p>
</div>


<div style="padding: 30px;">
  
  <h2 style="color: #333; text-align: center;">Thank You for Your Order</h2>

  <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;" />

  <div style="text-align: center; margin: 30px 0;">
    <a href="${uploadFile}" 
       style="background-color: #a16207; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
       Download Details
    </a>
  </div>

</div>


            <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    © 2026 spexnation
                </p>
            </div>

  </div >
</div >

    `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export { generateOTP, sendEmail };

