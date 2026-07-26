"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const EVENT_TYPE_MAX_LENGTH = 80;
const LOCATION_MAX_LENGTH = 160;
const BUDGET_MAX = 1_000_000;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_MESSAGE_CONTROL_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

interface FormData {
    eventType: string;
    eventDate: string;
    location: string;
    estimatedBudget: string;
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
            eventType: "",
            eventDate: "",
            location: "",
            estimatedBudget: "",
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
                    eventType: data.eventType.trim(),
                    eventDate: data.eventDate,
                    location: data.location.trim(),
                    estimatedBudget: data.estimatedBudget.trim(),
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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-purple-400/40 bg-gray-950/95 p-5 shadow-2xl shadow-purple-950/40 sm:p-7"
        >
            <div className="mb-6">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-300">Plan your event</p>
                <h2 className="mt-2 text-3xl font-bold">Tell me the essentials</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                    Share the basics and I&apos;ll follow up about availability and next steps.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="contact-event-type" className="font-semibold">Event type</label>
                    <select
                        id="contact-event-type"
                        aria-invalid={Boolean(errors.eventType)}
                        aria-describedby={errors.eventType ? "contact-event-type-error" : undefined}
                        {...register("eventType", {
                            required: "Choose an event type.",
                            maxLength: {
                                value: EVENT_TYPE_MAX_LENGTH,
                                message: "Event type is too long.",
                            },
                        })}
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    >
                        <option value="">Select an event</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Sweet 16 or birthday">Sweet 16 or birthday</option>
                        <option value="Corporate event">Corporate event</option>
                        <option value="Private party">Private party</option>
                        <option value="Nightclub">Nightclub</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.eventType && <p id="contact-event-type-error" className="text-sm text-red-400">{errors.eventType.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="contact-event-date" className="font-semibold">Event date</label>
                    <input
                        id="contact-event-date"
                        type="date"
                        aria-invalid={Boolean(errors.eventDate)}
                        aria-describedby={errors.eventDate ? "contact-event-date-error" : undefined}
                        {...register("eventDate", {
                            required: "Choose an event date.",
                        })}
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                    {errors.eventDate && <p id="contact-event-date-error" className="text-sm text-red-400">{errors.eventDate.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="contact-location" className="font-semibold">Location</label>
                    <input
                        id="contact-location"
                        type="text"
                        autoComplete="address-level2"
                        maxLength={LOCATION_MAX_LENGTH}
                        placeholder="City, state, or venue"
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={errors.location ? "contact-location-error" : undefined}
                        {...register("location", {
                            required: "Enter the event location.",
                            validate: (value) => value.trim().length >= 2 || "Enter a valid location.",
                        })}
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                    {errors.location && <p id="contact-location-error" className="text-sm text-red-400">{errors.location.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="contact-budget" className="font-semibold">Estimated budget (USD)</label>
                    <input
                        id="contact-budget"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={BUDGET_MAX}
                        step={100}
                        placeholder="e.g. 1500"
                        aria-invalid={Boolean(errors.estimatedBudget)}
                        aria-describedby={errors.estimatedBudget ? "contact-budget-error" : undefined}
                        {...register("estimatedBudget", {
                            required: "Enter an estimated budget.",
                            validate: (value) => {
                                const budget = Number(value);
                                return (
                                    Number.isInteger(budget) &&
                                    budget >= 0 &&
                                    budget <= BUDGET_MAX
                                ) || "Enter a whole-dollar budget.";
                            },
                        })}
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                    {errors.estimatedBudget && <p id="contact-budget-error" className="text-sm text-red-400">{errors.estimatedBudget.message}</p>}
                </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
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
                        className="min-h-12 rounded-lg border border-gray-700 bg-gray-900 px-3 text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
                    />
                    {errors.email && <p id="contact-email-error" className="text-sm text-red-400">{errors.email.message}</p>}
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-1">
                <label htmlFor="contact-message" className="font-semibold">Anything else I should know?</label>
                <textarea
                    id="contact-message"
                    rows={3}
                    placeholder="Guest count, music preferences, schedule, or special requests"
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
                    className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
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

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-12 rounded-lg bg-[#9146FF] px-6 font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Sending..." : "Request Availability"}
                </button>
                <p className="text-xs leading-5 text-gray-400">No commitment—this starts the conversation.</p>
            </div>

            <div aria-live="polite" className="mt-3">
                {status === "loading" && <p className="text-yellow-500">Sending...</p>}
                {status === "success" && <p className="text-green-400">Thanks! Your event details were sent successfully.</p>}
                {status === "error" && <p className="text-red-500">Unable to send message. Please try again later.</p>}
            </div>
        </form>
    );
}
