import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            );
        }

        // ✅ Make sure EMAIL_USER & EMAIL_PASS are being accessed properly
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  // Ensure this is loaded
                pass: process.env.EMAIL_PASS,  // Ensure this is loaded
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "your_email@gmail.com",
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
