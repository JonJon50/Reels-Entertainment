"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import About from "./components/About";
import ContactForm from "./components/ContactForm";
import ShootingStars from "./components/ShootingStars";

export default function Home() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [twitchParent, setTwitchParent] = useState<string | null>(null);
  const viewerVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setTwitchParent(window.location.hostname);
  }, []);

  const openSelectedMedia = useCallback((mediaPath: string) => {
    mediaTriggerRef.current = document.activeElement as HTMLElement | null;
    setSelectedMedia(mediaPath);
  }, []);

  const closeSelectedMedia = useCallback(() => {
    const video = viewerVideoRef.current;

    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // The video may close before its metadata has loaded.
      }
    }

    setSelectedMedia(null);
    window.requestAnimationFrame(() => mediaTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!selectedMedia) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSelectedMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSelectedMedia, selectedMedia]);

  return (
    <main className="flex flex-col items-center w-full text-white">
      <ShootingStars />

      {/* Video Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center">
        <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
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
      <section id="twitch-live" className="w-full flex flex-col items-center py-10 bg-black">
        <h2 className="text-2xl font-bold mb-4">Watch Me Live on Twitch</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-11/12 max-w-5xl p-6 border-4 border-[#9146FF] rounded-lg bg-gray-900">
          {/* Twitch Video Embed */}
          <div className="relative w-full md:w-3/5 aspect-video">
            {twitchParent && (
              <iframe
                src={`https://player.twitch.tv/?channel=djreels&parent=${encodeURIComponent(twitchParent)}`}
                title="DJ Reels live stream"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            )}
          </div>

          {/* Twitch Chat Embed */}
          <div className="w-full md:w-2/5">
            {twitchParent && (
              <iframe
                src={`https://www.twitch.tv/embed/djreels/chat?darkpopout&parent=${encodeURIComponent(twitchParent)}`}
                title="DJ Reels live chat"
                height="400"
                width="100%"
                className="rounded-md"
              ></iframe>
            )}
          </div>
        </div>
      </section>

      {/* Event Photo & Video Carousel */}
      <section className="w-full py-10 bg-black">
        <h2 className="text-2xl font-bold text-center mb-6">Past Event Highlights</h2>
        <div className="w-11/12 max-w-5xl mx-auto relative">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            preventClicks={false}
            preventClicksPropagation={false}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="relative rounded-lg overflow-hidden"
          >
            {/* Image Slides */}
            {["white.JPG", "red.JPG", "blue.jpg", "stand.JPG", "mic.JPG", "luv.png"].map((img, index) => (
              <SwiperSlide key={img}>
                <button
                  type="button"
                  aria-label={`View event photo ${index + 1}`}
                  className="swiper-no-swiping block w-full rounded-md"
                  onClick={(event) => {
                    event.stopPropagation();
                    openSelectedMedia(`/${img}`);
                  }}
                >
                  <motion.img
                    src={`/${img}`}
                    alt={`Event ${index + 1}`}
                    draggable={false}
                    className="pointer-events-none w-full h-60 object-cover rounded-md cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                  />
                </button>
              </SwiperSlide>
            ))}

            {/* Video Slides */}
            {["54.mp4", "yolo.mp4", "sweet.mp4", "wedding.mp4"].map((vid, index) => (
              <SwiperSlide key={vid}>
                <button
                  type="button"
                  aria-label={`Play event video ${index + 1}`}
                  className="swiper-no-swiping block w-full rounded-md"
                  onClick={(event) => {
                    event.stopPropagation();
                    openSelectedMedia(`/videos/${vid}`);
                  }}
                >
                  <motion.video
                    muted
                    playsInline
                    preload="metadata"
                    className="pointer-events-none w-full h-60 object-cover rounded-md cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                  >
                    <source src={`/videos/${vid}`} type="video/mp4" />
                  </motion.video>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Fullscreen Zoomed Media Modal */}
      {selectedMedia && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Event media viewer"
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSelectedMedia();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            type="button"
            aria-label="Close media viewer"
            autoFocus
            onClick={closeSelectedMedia}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black bg-opacity-70 text-2xl text-white hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span aria-hidden="true">&times;</span>
          </button>

          {selectedMedia.endsWith(".mp4") ? (
            <motion.video
              ref={viewerVideoRef}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-w-full max-h-full rounded-lg shadow-lg"
              onClick={(event) => event.stopPropagation()}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              <source src={selectedMedia} type="video/mp4" />
            </motion.video>
          ) : (
            <motion.img
              src={selectedMedia}
              alt="Selected event highlight"
              className="max-w-full max-h-full rounded-lg shadow-lg"
              onClick={(event) => event.stopPropagation()}
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
