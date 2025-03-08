"use client";
import { useState, useRef, useEffect } from "react"; // ✅ Import useEffect
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import About from "./components/About";
import ContactForm from "./components/ContactForm";
import ShootingStars from "./components/ShootingStars";


export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
 // ✅ Zustand for global state
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // References for videos in the carousel
  const carouselVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Stops video before closing modal
  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.removeAttribute("src");
      modalVideoRef.current.load();
    }
    setSelectedMedia(null); // Local state reset

    if (swiperInstance) swiperInstance.autoplay.start(); // Resume autoplay
  };

  // ✅ Clear Zustand state when the page loads
  useEffect(() => {
    setSelectedMedia(null);
  }, []);


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

          {/* Book Now Button - Smooth Scroll to Contact Section */}
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

          {/* Watch Me Live Button - Smooth Scroll to Twitch Section */}
          <motion.button
            className="mt-4 ml-4 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg text-lg hover:bg-purple-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#twitch-live")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            🎥 Watch Me Live
          </motion.button>
        </div>
      </section>
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
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            className="relative rounded-lg overflow-hidden"
          >
            {/* Image Slides */}
            {["white.JPG", "red.JPG", "blue.jpg"].map((img, index) => (
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
            {["54.mp4", "yolo.mp4"].map((vid, index) => (
              <SwiperSlide key={index}>
                <motion.video
                  ref={(el) => {
                    if (el) {
                      carouselVideoRefs.current[`/videos/${vid}`] = el;
                    }
                  }}
                  controls
                  autoPlay={false}
                  preload="metadata"
                  className="w-full h-60 object-cover rounded-md cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    // Stop all other videos in the carousel
                    Object.values(carouselVideoRefs.current).forEach((video) => {
                      if (video) {
                        video.pause();
                        video.currentTime = 0;
                      }
                    });

                    // Open the modal and stop Swiper autoplay
                    setSelectedMedia(`/videos/${vid}`);
                    if (swiperInstance) swiperInstance.autoplay.stop();
                  }}
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
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {selectedMedia.endsWith(".mp4") ? (
            <motion.video
              ref={modalVideoRef}
              controls
              autoPlay={false}
              className="max-w-full max-h-full rounded-lg shadow-lg"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              onPlay={() => {
                Object.values(carouselVideoRefs.current).forEach((video) => {
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                });
              }}
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

      {/* About & Contact Section */}
      <section className="w-full py-10 bg-black flex flex-col md:flex-row justify-center items-start gap-10 px-6">
        <About />
        <ContactForm />
      </section>

    </main>
  );
}
