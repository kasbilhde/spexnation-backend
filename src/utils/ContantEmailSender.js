import nodemailer from "nodemailer";

const ContantEmailSender = async (email, data) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_FOR_CONTACT_FORM, // Your email
                pass: process.env.PASSWORD_FOR_CONTACT_FORM, // Your email password or app password
            },
        });







        const finalHTML = `
            <div>
            
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; margin-top:20px; border-radius:6px; overflow:hidden;">
                    
                    <!-- Header -->
                    <tr>
                    <td style="background:#a87400; color:#ffffff; padding:20px; text-align:center;">
                        <h2 style="margin:0;">New Contact Message</h2>
                    </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                    <td style="padding:20px; color:#333333;">
                        <p>You have received a new message from your website contact form:</p>

                        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                            <td style="font-weight:bold;">Name:</td>
                            <td>${data?.name}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">Email:</td>
                            <td>${data?.email}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">Order Number:</td>
                            <td>${data?.oid}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">Message:</td>
                            <td>${data?.message}</td>
                        </tr>
                        </table>

                        <p style="margin-top:20px;">Please respond to this enquiry as soon as possible.</p>
                    </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                    <td style="background:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#777;">
                        © 2026 spexnation. All rights reserved.
                    </td>
                    </tr>

                </table>

            </div>
        
        `






        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FOR_CONTACT_FORM,
            to: email,
            subject: 'New Contact From spexnation.co.uk',
            html: finalHTML,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Contact Form email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export default ContantEmailSender;

