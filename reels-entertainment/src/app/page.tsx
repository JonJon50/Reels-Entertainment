"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules"; // ✅ Added Autoplay
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  return (
    <main className="flex flex-col items-center w-full text-white">
      {/* Video Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center">
        <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
          <source src="/reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Welcome to Reels Entertainment 🎧</h1>
          <p className="mt-4 text-lg">Book me for your next event!</p>
          <a href="#contact" className="mt-6 inline-block px-6 py-3 bg-blue-500 rounded-lg text-lg">
            Book Now
          </a>
        </div>
      </section>

      {/* Twitch Follow Section */}
      <motion.section
        className="relative w-full py-6 text-center overflow-hidden"
        style={{ backgroundColor: "#9146FF", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold">Live streaming on Twitch! Follow for notifications.</h2>
        <motion.a
          href="https://www.twitch.tv/djreels/about"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          🚀 Follow on Twitch
        </motion.a>
      </motion.section>

      {/* Twitch Video & Chat Section */}
      <section className="w-full flex flex-col items-center py-10 bg-black">
        <h2 className="text-2xl font-bold mb-4">Watch Me Live on Twitch</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-11/12 max-w-5xl p-6 border-4 border-[#9146FF] rounded-lg bg-gray-900">
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

      {/* Event Photo & Video Carousel */}
      <section className="w-full py-10 bg-black">
        <h2 className="text-2xl font-bold text-center mb-6">Past Event Highlights</h2>
        <div className="w-11/12 max-w-5xl mx-auto relative">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]} // ✅ Added Autoplay
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }} // ✅ Auto-rotation enabled
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="relative rounded-lg overflow-hidden"
          >
            {/* Image Slides */}
            {["white.JPG", "red.JPG", "blue.jpg", "stand.JPG", "mic.JPG", "luv.png"].map((img, index) => (
              <SwiperSlide key={index} onClick={() => setSelectedMedia(`/${img}`)}
                className="flex justify-center items-center">
                <motion.img
                  src={`/${img}`}
                  alt={`Event ${index + 1}`}
                  className="w-full h-60 object-cover rounded-md cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                />
              </SwiperSlide>
            ))}

            {/* Video Slides */}
            {["54.mp4", "yolo.mp4", "sweet.mp4", "wedding.mp4"].map((vid, index) => (
              <SwiperSlide key={index} onClick={() => setSelectedMedia(`/videos/${vid}`)}
                className="flex justify-center items-center">
                <motion.video
                  controls
                  autoPlay={false} // ✅ Prevents auto-play
                  preload="metadata" // ✅ Loads metadata but does not play
                  className="w-full h-60 object-cover rounded-md cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                >
                  <source src={`/videos/${vid}`} type="video/mp4" />
                </motion.video>
              </SwiperSlide>
            ))}

          </Swiper>

          {/* Move Navigation Buttons Outside */}
          <style jsx>{`
            .swiper-button-next,
            .swiper-button-prev {
              color: white; /* ✅ Change arrow color */
              top: 50%;
              transform: translateY(-50%);
              width: 40px;
              height: 40px;
            }

            .swiper-button-prev {
              left: -50px; /* ✅ Move Left Arrow Outside */
            }

            .swiper-button-next {
              right: -50px; /* ✅ Move Right Arrow Outside */
            }
          `}</style>
        </div>
      </section>

      {/* Fullscreen Zoomed Media Modal */}
      {selectedMedia && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setSelectedMedia(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* ✅ Safe type check before calling `endsWith` */}
          {typeof selectedMedia === "string" && selectedMedia.endsWith(".mp4") ? (
            <motion.video
              controls
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              <source src={selectedMedia} type="video/mp4" />
            </motion.video>
          ) : (
            <motion.img
              src={selectedMedia as string}
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.div>
      )}
      
    </main>
  );
}
