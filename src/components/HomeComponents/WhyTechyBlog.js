import { FaLightbulb, FaUsers, FaRocket } from "react-icons/fa";

const WhyTechyBlog = () => {
    return (
        <section className="w-full bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                    Why techyblog?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
                    We're not just another blog—we're a growing community of curious minds driven by discovery, storytelling, and meaningful insights.
                </p>

                <div className="grid md:grid-cols-3 gap-10 mt-8">
                    {/* Point 1 */}
                    <div className="p-8 bg-gray-50 rounded-3xl shadow hover:shadow-md transition">
                        <FaLightbulb className="text-4xl mb-4 text-purple-600 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Informed & Insightful</h3>
                        <p className="text-gray-500 text-sm">
                            Every post is researched and fact-checked to keep you ahead of trends and truths.
                        </p>
                    </div>

                    {/* Point 2 */}
                    <div className="p-8 bg-gray-50 rounded-3xl shadow hover:shadow-md transition">
                        <FaUsers className="text-4xl mb-4 text-pink-500 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Built for Readers</h3>
                        <p className="text-gray-500 text-sm">
                            Whether you're a student, pro, or enthusiast—our content is tailored for clarity, creativity, and value.
                        </p>
                    </div>

                    {/* Point 3 */}
                    <div className="p-8 bg-gray-50 rounded-3xl shadow hover:shadow-md transition">
                        <FaRocket className="text-4xl mb-4 text-yellow-400 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2">Always Evolving</h3>
                        <p className="text-gray-500 text-sm">
                            New categories, expert views, and features are always launching. Stay inspired and stay ahead.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyTechyBlog;
