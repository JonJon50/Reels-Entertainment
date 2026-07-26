import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const EVENT_TYPE_MAX_LENGTH = 80;
const LOCATION_MAX_LENGTH = 160;
const BUDGET_MAX = 1_000_000;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5_000;
const MAX_REQUEST_LENGTH = 20_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_MESSAGE_CONTROL_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const INVALID_SUBMISSION_ERROR = "Invalid submission.";
const DELIVERY_ERROR = "Unable to send message. Please try again later.";

type ContactPayload = {
    eventType?: unknown;
    eventDate?: unknown;
    location?: unknown;
    estimatedBudget?: unknown;
    name?: unknown;
    email?: unknown;
    message?: unknown;
    website?: unknown;
};

function errorResponse(error: string, status: number) {
    return NextResponse.json({ success: false, error }, { status });
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        if (!rawBody || rawBody.length > MAX_REQUEST_LENGTH) {
            return errorResponse(INVALID_SUBMISSION_ERROR, 400);
        }

        let payload: ContactPayload;
        try {
            payload = JSON.parse(rawBody) as ContactPayload;
        } catch {
            return errorResponse(INVALID_SUBMISSION_ERROR, 400);
        }

        if (
            !payload ||
            typeof payload !== "object" ||
            typeof payload.eventType !== "string" ||
            typeof payload.eventDate !== "string" ||
            typeof payload.location !== "string" ||
            typeof payload.estimatedBudget !== "string" ||
            typeof payload.name !== "string" ||
            typeof payload.email !== "string" ||
            typeof payload.message !== "string" ||
            (payload.website !== undefined && typeof payload.website !== "string")
        ) {
            return errorResponse(INVALID_SUBMISSION_ERROR, 400);
        }

        const eventType = payload.eventType.trim();
        const eventDate = payload.eventDate.trim();
        const location = payload.location.trim();
        const estimatedBudget = payload.estimatedBudget.trim();
        const name = payload.name.trim();
        const email = payload.email.trim();
        const message = payload.message.trim();
        const website = payload.website?.trim() ?? "";

        // Silently accept honeypot submissions so automated senders receive no signal.
        if (website) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        const parsedBudget = Number(estimatedBudget);
        const parsedEventDate = new Date(`${eventDate}T00:00:00Z`);
        const isEventTypeValid =
            eventType.length > 0 &&
            eventType.length <= EVENT_TYPE_MAX_LENGTH &&
            !/[\r\n\u0000-\u001F\u007F]/.test(eventType);
        const isEventDateValid =
            /^\d{4}-\d{2}-\d{2}$/.test(eventDate) &&
            !Number.isNaN(parsedEventDate.getTime()) &&
            parsedEventDate.toISOString().startsWith(eventDate);
        const isLocationValid =
            location.length >= 2 &&
            location.length <= LOCATION_MAX_LENGTH &&
            !/[\r\n\u0000-\u001F\u007F]/.test(location);
        const isBudgetValid =
            /^\d{1,7}$/.test(estimatedBudget) &&
            Number.isFinite(parsedBudget) &&
            parsedBudget >= 0 &&
            parsedBudget <= BUDGET_MAX;
        const isNameValid =
            name.length >= NAME_MIN_LENGTH &&
            name.length <= NAME_MAX_LENGTH &&
            !/[\r\n\u0000-\u001F\u007F]/.test(name);
        const isEmailValid =
            email.length > 0 &&
            email.length <= EMAIL_MAX_LENGTH &&
            EMAIL_PATTERN.test(email);
        const isMessageValid =
            message.length >= MESSAGE_MIN_LENGTH &&
            message.length <= MESSAGE_MAX_LENGTH &&
            !UNSAFE_MESSAGE_CONTROL_PATTERN.test(message);

        if (
            !isEventTypeValid ||
            !isEventDateValid ||
            !isLocationValid ||
            !isBudgetValid ||
            !isNameValid ||
            !isEmailValid ||
            !isMessageValid
        ) {
            return errorResponse(INVALID_SUBMISSION_ERROR, 400);
        }

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        const contactEmail = process.env.CONTACT_EMAIL;

        if (!emailUser || !emailPass || !contactEmail) {
            console.error("Contact email configuration is incomplete.");
            return errorResponse(DELIVERY_ERROR, 500);
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const safeEventType = escapeHtml(eventType);
        const safeEventDate = escapeHtml(eventDate);
        const safeLocation = escapeHtml(location);
        const safeEstimatedBudget = escapeHtml(estimatedBudget);
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeMessage = escapeHtml(message);

        const mailOptions = {
            from: `"Reels Entertainment Contact" <${emailUser}>`,
            to: contactEmail,
            replyTo: email,
            subject: `New ${eventType} inquiry from ${name}`,
            text: `Event type: ${eventType}\nEvent date: ${eventDate}\nLocation: ${location}\nEstimated budget: $${estimatedBudget}\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">📩 New Contact Form Submission</h2>
                    <p><strong>Event type:</strong> ${safeEventType}</p>
                    <p><strong>Event date:</strong> ${safeEventDate}</p>
                    <p><strong>Location:</strong> ${safeLocation}</p>
                    <p><strong>Estimated budget:</strong> $${safeEstimatedBudget}</p>
                    <p><strong>Name:</strong> ${safeName}</p>
                    <p><strong>Email:</strong> ${safeEmail}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #eee; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</div>
                    <hr>
                    <p style="color: gray; font-size: 12px;">This message was sent from your website's contact form.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch {
        console.error("Contact email delivery failed.");
        return errorResponse(DELIVERY_ERROR, 500);
    }
}
