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

        // ✅ Ensure environment variables are loaded correctly
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return NextResponse.json(
                { success: false, error: "Missing email credentials" },
                { status: 500 }
            );
        }

        // ✅ Set up Nodemailer transporter with Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ Improved HTML email format
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: "your_actual_email@gmail.com", // ✅ Replace this with your actual email
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">📩 New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #eee; padding: 10px; border-radius: 5px;">${message}</p>
                    <hr>
                    <p style="color: gray; font-size: 12px;">This message was sent from your website's contact form.</p>
                </div>
            `,
        };

        // ✅ Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);

        return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("❌ Error sending email:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
