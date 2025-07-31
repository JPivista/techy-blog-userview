import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-4 mt-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                {/* Column 1 */}
                <div>
                    <h3 className="text-2xl font-bold mb-3 text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                        techyblog
                    </h3>
                    <p className="text-gray-400">
                        Dive into the world of knowledge—from science to cinema, politics to pixels.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Categories</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        {[
                            "Science", "Technology", "Business", "Cinema", "Sports", "Gaming",
                            "Healthcare", "Education", "Politics", "Lifestyle"
                        ].map((cat) => (
                            <Link
                                key={cat}
                                href={`/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                                className="hover:text-white"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
                    <p className="text-gray-300 text-sm mb-2">
                        <a href="mailto:support@techyblog.com" className="hover:underline">
                            Email: support@techyblog.com
                        </a>
                    </p>
                    {/* <p className="text-gray-300 text-sm mb-2 flex items-center gap-2">
                        <a href="tel:+916381160145" className="hover:underline">
                            Phone: +91-6381160145
                        </a>
                    </p> */}
                    {/* <p className="text-gray-300 text-sm">Address: Bengaluru, India</p> */}
                </div>
            </div>

            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} techyblog. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
