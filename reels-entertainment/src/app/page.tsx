"use client";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full text-white">
      {/* Video Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Welcome to Reels Entertainment 🎧</h1>
          <p className="mt-4 text-lg">Book me for your next event!</p>
          <a
            href="#contact"
            className="mt-6 inline-block px-6 py-3 bg-blue-500 rounded-lg text-lg"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Twitch Follow Section with Animations */}
      <motion.section
        className="relative w-full py-6 text-center overflow-hidden"
        style={{ backgroundColor: "#9146FF", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Subtle Wave Effect */}
        <div className="absolute top-0 left-0 w-full h-16 bg-white opacity-10 wave-effect"></div>

        <h2 className="text-2xl font-bold">Live streaming on Twitch! Follow for notifications.</h2>

        <motion.a
          href="https://www.twitch.tv/djreels/about"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
          whileHover={{ scale: 1.05 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
         🚀 Follow on Twitch
        </motion.a>
      </motion.section>

      {/* Twitch Video & Chat Section */}
      <section className="w-full flex flex-col items-center py-10 bg-black">
        <h2 className="text-2xl font-bold mb-4">Watch Me Live on Twitch</h2>

        <div
          className="flex flex-col md:flex-row justify-center items-center gap-6 w-11/12 max-w-5xl p-6 border-4 border-[#9146FF] rounded-lg bg-gray-900"
        >
          {/* Twitch Video Embed */}
          <div className="w-full md:w-3/5">
            <iframe
              src="https://player.twitch.tv/?channel=djreels&parent=localhost"
              height="400"
              width="100%"
              allowFullScreen
              className="rounded-md"
            ></iframe>
          </div>

          {/* Twitch Chat Embed */}
          <div className="w-full md:w-2/5">
            <iframe
              src="https://www.twitch.tv/embed/djreels/chat?darkpopout&parent=localhost"
              height="400"
              width="100%"
              className="rounded-md"
            ></iframe>
          </div>
        </div>
      </section>


    </main>
  );
}

