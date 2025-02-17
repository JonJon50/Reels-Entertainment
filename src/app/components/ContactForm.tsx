"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactForm() {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const [status, setStatus] = useState<string | null>(null);

    interface FormData {
        name: string;
        email: string;
        message: string;
    }

    const onSubmit = async (data: FormData) => {
        setStatus("loading");

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            setStatus("success");
            reset();
        } else {
            setStatus("error");
        }
    };

    return (
        <form id="contact" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 border-4 border-[#9146FF] p-6 rounded-md">
            <input type="text" {...register("name", { required: true })} placeholder="Your Name" className="p-3 bg-gray-800 border border-gray-700 rounded-md" />
            <input type="email" {...register("email", { required: true })} placeholder="Your Email" className="p-3 bg-gray-800 border border-gray-700 rounded-md" />
            <textarea {...register("message", { required: true })} placeholder="Your Message" rows={4} className="p-3 bg-gray-800 border border-gray-700 rounded-md"></textarea>

            <button type="submit" className="p-3 bg-[#9146FF] hover:bg-purple-700 text-white font-bold rounded-md">
                Send Message
            </button>

            {status === "loading" && <p className="text-yellow-500">Sending...</p>}
            {status === "success" && <p className="text-green-500">Message sent successfully!</p>}
            {status === "error" && <p className="text-red-500">Failed to send message. Try again.</p>}
        </form>
    );
}
