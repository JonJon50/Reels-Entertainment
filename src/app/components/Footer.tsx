import { FaInstagram, FaTiktok, FaTwitch } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">

                {/* Left: Twitch Schedule */}
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">Twitch Streaming Schedule</h3>
                    <p className="text-sm text-gray-400">
                        Monday: 5PM EST - Thursday: 7PM EST <br />
                        Saturday & Sunday: Special Streams!
                    </p>
                </div>

                {/* Center: Copyright Text */}
                <div className="text-center text-sm">
                    Copyright &copy; <a href="https://djreels.com" className="hover:underline">DJreels</a> {new Date().getFullYear()}
                </div>

                {/* Right: Social Media Icons */}
                <div className="flex space-x-3">
                    <a href="https://www.instagram.com/djreels/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-md hover:bg-gray-300">
                        <FaInstagram size={20} />
                    </a>
                
                    <a href="https://www.tiktok.com/@djreels?_t=ZT-8tz7hJSAuX0&_r=1" target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-md hover:bg-gray-300">
                        <FaTiktok size={20} />
                    </a>
                    <a href="https://www.twitch.tv/djreels" target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-md hover:bg-gray-300">
                        <FaTwitch size={20} />
                    </a>
                </div>

            </div>
        </footer>
    );
}
