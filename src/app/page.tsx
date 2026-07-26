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

const streamSchedule = [
  { day: "Monday", time: "5 PM EST", detail: "Recurring public Twitch stream" },
  { day: "Thursday", time: "7 PM EST", detail: "Recurring public Twitch stream" },
  { day: "Saturday & Sunday", time: "Special streams", detail: "Follow on Twitch for timing updates" },
];

const eventFormats = [
  "Weddings",
  "Sweet 16s",
  "Corporate events",
  "Private parties",
  "Nightclubs",
];

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
    <main className="flex w-full flex-col items-center pb-24 text-white md:pb-0">
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

      {/* Twitch Video, Status & Schedule Section */}
      <section id="twitch-live" className="w-full bg-black px-5 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-purple-300">DJREELS on Twitch</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Drop into a live set</h2>
            <p className="mt-3 text-gray-300">
              Watch the stream, join the chat, and follow the channel for schedule notifications.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-950/70 to-gray-950 p-6">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-200">●</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300">Channel status</p>
                  <h3 className="mt-1 text-xl font-bold">Check the player for current status</h3>
                </div>
              </div>
              <p className="mt-4 leading-7 text-gray-300">
                The embedded Twitch player shows whether a stream is active. Follow the channel to get Twitch notifications when DJREELS goes live.
              </p>
              <a
                href="https://www.twitch.tv/djreels"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#9146FF] px-5 font-bold text-white transition hover:bg-purple-600"
              >
                Open Twitch Channel
              </a>
            </article>

            <article className="rounded-2xl border border-white/10 bg-gray-950 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Upcoming stream schedule</p>
              <div className="mt-4 divide-y divide-white/10">
                {streamSchedule.map((stream) => (
                  <div key={stream.day} className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h3 className="font-bold text-white">{stream.day}</h3>
                      <p className="text-sm text-gray-400">{stream.detail}</p>
                    </div>
                    <p className="font-semibold text-purple-300">{stream.time}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-6 flex flex-col items-stretch gap-6 rounded-2xl border border-purple-400/30 bg-gray-900 p-4 sm:p-6 md:flex-row">
            {/* Twitch Video Embed */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black md:w-3/5">
              {twitchParent && (
                <iframe
                  src={`https://player.twitch.tv/?channel=djreels&parent=${encodeURIComponent(twitchParent)}`}
                  title="DJ Reels live stream"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              )}
            </div>

            {/* Twitch Chat Embed */}
            <div className="w-full overflow-hidden rounded-xl bg-black md:w-2/5">
              {twitchParent && (
                <iframe
                  src={`https://www.twitch.tv/embed/djreels/chat?darkpopout&parent=${encodeURIComponent(twitchParent)}`}
                  title="DJ Reels live chat"
                  height="400"
                  width="100%"
                  className="block"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Public Streams & Booking Availability */}
      <section id="availability" className="w-full bg-gray-950 px-5 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-300">What&apos;s coming up</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Public streams & event availability</h2>
              <p className="mt-3 leading-7 text-gray-300">
                Catch a recurring Twitch set or send your event details to check a private date. Private-event availability is confirmed by inquiry.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 font-bold text-black transition hover:bg-gray-200"
            >
              Check Event Availability
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {streamSchedule.map((stream) => (
              <article key={`availability-${stream.day}`} className="rounded-2xl border border-white/10 bg-black/50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300">Public stream</p>
                <h3 className="mt-3 text-xl font-bold">{stream.day}</h3>
                <p className="mt-1 text-lg font-semibold text-white">{stream.time}</p>
                <p className="mt-3 text-sm leading-6 text-gray-400">{stream.detail}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-purple-400/40 bg-purple-950/30 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300">Private events</p>
              <h3 className="mt-3 text-xl font-bold">Dates by request</h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Share your date, location, event type, and budget to start an availability conversation.
              </p>
              <a href="#contact" className="mt-4 inline-flex font-bold text-purple-200 underline decoration-purple-400 underline-offset-4">
                Start a booking inquiry
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Experience & Event Range */}
      <section aria-labelledby="experience-heading" className="w-full bg-black px-5 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-gray-950 to-purple-950/30 p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-300">Proven experience</p>
              <h2 id="experience-heading" className="mt-3 text-3xl font-bold sm:text-4xl">10+ years behind the decks</h2>
              <p className="mt-4 leading-7 text-gray-300">
                Professional DJ experience across private celebrations, corporate settings, nightlife, and live online sets.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Event experience</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Event types">
                  {eventFormats.map((eventType) => (
                    <li key={eventType} className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-100">
                      {eventType}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Music range</p>
                <h3 className="mt-3 text-xl font-bold">Multi-genre programming</h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Top 40, Hip-Hop, R&amp;B, House, Latin, Dancehall, Afrobeats, EDM, and Old School classics.
                </p>
              </article>
            </div>
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
      <section className="w-full bg-black px-5 py-14 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-center gap-10 lg:flex-row">
          <About />
          <ContactForm />
        </div>
      </section>

      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 px-3 pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
          <a
            href="#twitch-live"
            className="flex min-h-12 items-center justify-center rounded-xl border border-purple-400/60 bg-purple-950/80 px-4 text-sm font-bold text-white transition active:scale-[0.98]"
          >
            <span aria-hidden="true" className="mr-2">●</span>
            Watch Live
          </a>
          <a
            href="#contact"
            className="flex min-h-12 items-center justify-center rounded-xl bg-[#9146FF] px-4 text-sm font-bold text-white shadow-lg shadow-purple-950/50 transition active:scale-[0.98]"
          >
            Book Me
          </a>
        </div>
      </nav>
    </main>
  );
}
