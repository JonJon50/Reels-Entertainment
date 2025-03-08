"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ShootingStars from "./components/ShootingStars";

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🛑 Stops video & resets when closing modal
  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedMedia(null);
    if (swiperInstance) swiperInstance.autoplay.start(); // Resume autoplay when modal is closed
  };

  return (
    <main className="flex flex-col items-center w-full text-white">
      <ShootingStars />

      {/* Video Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center">
        <video loop muted className="absolute top-0 left-0 w-full h-full object-cover">
          <source src="/reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold">Welcome to Reels Entertainment 🎧</h1>
          <p className="mt-4 text-lg">Book me for your next event!</p>

          {/* Book Now Button */}
          <motion.button
            className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg text-lg hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Book Now
          </motion.button>
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

      {/* Event Photo & Video Carousel */}
      <section className="w-full py-10 bg-black">
        <h2 className="text-2xl font-bold text-center mb-6">Past Event Highlights</h2>
        <div className="w-11/12 max-w-5xl mx-auto relative">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            onSwiper={setSwiperInstance} // ✅ Save Swiper instance
            className="relative rounded-lg overflow-hidden"
          >
            {/* Image Slides */}
            {["white.JPG", "red.JPG", "blue.jpg", "stand.JPG", "mic.JPG", "luv.png"].map((img, index) => (
              <SwiperSlide key={index} onClick={() => setSelectedMedia(`/${img}`)}>
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
              <SwiperSlide key={index} onClick={() => setSelectedMedia(`/videos/${vid}`)}>
                <motion.video
                  controls
                  autoPlay={false} // ✅ Prevents autoplay
                  preload="metadata" // ✅ Loads metadata but does not play
                  className="w-full h-60 object-cover rounded-md cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                >
                  <source src={`/videos/${vid}`} type="video/mp4" />
                </motion.video>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Fullscreen Zoomed Media Modal */}
      {selectedMedia && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={closeModal} // ✅ Close modal on click
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selectedMedia.endsWith(".mp4") ? (
            <motion.video
              ref={videoRef} // ✅ Reference for stopping video
              controls
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              <source src={selectedMedia} type="video/mp4" />
            </motion.video>
          ) : (
            <motion.img
              src={selectedMedia}
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
