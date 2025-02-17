// import nodemailer from "nodemailer";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     const { name, email, message } = await req.json();

//     // Create transporter using Gmail SMTP
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER, // Use environment variables
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: process.env.EMAIL_USER, // Send to yourself
//         replyTo: email, // Allow replies from user
//         subject: `New Contact Form Submission from ${name}`,
//         text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         return NextResponse.json({ success: true, message: "Email sent successfully!" });
//     } catch (error) {
//         console.error("Email sending error:", error);
//         return NextResponse.json({ success: false, message: "Failed to send email." });
//     }
// }
