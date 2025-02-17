import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // ✅ Validate form inputs
        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        // ✅ Setup Nodemailer transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail", // ✅ Uses Gmail directly
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // ✅ Sender (your email)
            to: process.env.EMAIL_USER, // ✅ You receive emails at your own Gmail
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // ✅ Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
