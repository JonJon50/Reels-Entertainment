"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_MESSAGE_CONTROL_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

interface FormData {
    name: string;
    email: string;
    message: string;
    website: string;
}

export default function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            email: "",
            message: "",
            website: "",
        },
    });
    const [status, setStatus] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name.trim(),
                    email: data.email.trim(),
                    message: data.message.trim(),
                    website: data.website.trim(),
                }),
            });
            const result = await response.json().catch(() => null);

            if (!response.ok || !result?.success) {
                setStatus("error");
                return;
            }

            setStatus("success");
            reset();
        } catch {
            setStatus("error");
        }
    };

    return (
        <form
            id="contact"
            onSubmit={handleSubmit(onSubmit, () => setStatus(null))}
            noValidate
            aria-busy={isSubmitting}
            className="flex flex-col gap-4 border-4 border-[#9146FF] p-6 rounded-md"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="contact-name" className="font-semibold">Name</label>
                <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    maxLength={NAME_MAX_LENGTH}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    {...register("name", {
                        required: "Enter your name.",
                        validate: (value) => {
                            const trimmedValue = value.trim();
                            if (trimmedValue.length < NAME_MIN_LENGTH) return "Name must be at least 2 characters.";
                            if (trimmedValue.length > NAME_MAX_LENGTH) return "Name must be 100 characters or fewer.";
                            if (/[\r\n\u0000-\u001F\u007F]/.test(trimmedValue)) return "Enter a valid name.";
                            return true;
                        },
                    })}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-md"
                />
                {errors.name && <p id="contact-name-error" className="text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="contact-email" className="font-semibold">Email</label>
                <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    maxLength={EMAIL_MAX_LENGTH}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    {...register("email", {
                        required: "Enter your email address.",
                        validate: (value) => {
                            const trimmedValue = value.trim();
                            if (trimmedValue.length > EMAIL_MAX_LENGTH) return "Email must be 254 characters or fewer.";
                            return EMAIL_PATTERN.test(trimmedValue) || "Enter a valid email address.";
                        },
                    })}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-md"
                />
                {errors.email && <p id="contact-email-error" className="text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="contact-message" className="font-semibold">Message</label>
                <textarea
                    id="contact-message"
                    rows={4}
                    maxLength={MESSAGE_MAX_LENGTH}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    {...register("message", {
                        required: "Enter a message.",
                        validate: (value) => {
                            const trimmedValue = value.trim();
                            if (trimmedValue.length < MESSAGE_MIN_LENGTH) return "Message must be at least 10 characters.";
                            if (trimmedValue.length > MESSAGE_MAX_LENGTH) return "Message must be 5,000 characters or fewer.";
                            if (UNSAFE_MESSAGE_CONTROL_PATTERN.test(trimmedValue)) return "Message contains unsupported characters.";
                            return true;
                        },
                    })}
                    className="p-3 bg-gray-800 border border-gray-700 rounded-md"
                />
                {errors.message && <p id="contact-message-error" className="text-sm text-red-400">{errors.message.message}</p>}
            </div>

            <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="p-3 bg-[#9146FF] hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-bold rounded-md"
            >
                {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            <div aria-live="polite">
                {status === "loading" && <p className="text-yellow-500">Sending...</p>}
                {status === "success" && <p className="text-green-500">Message sent successfully!</p>}
                {status === "error" && <p className="text-red-500">Unable to send message. Please try again later.</p>}
            </div>
        </form>
    );
}
