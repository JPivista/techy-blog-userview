import Link from "next/link";

const categories = [
    "Science", "Technology", "Business", "Cinema", "Sports", "Gaming",
    "Healthcare", "Education", "Politics", "Lifestyle", "Travel",
    "Environment", "Food", "Fashion", "Finance", "History", "Law & Government"
];

const Header = () => {
    return (
        <header className="w-full bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-4">
                <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
                    techyblog
                </Link>
                <nav className="hidden md:flex flex-wrap gap-4 text-sm font-medium">
                    {categories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat}
                            href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-gray-700 hover:text-purple-600 transition"
                        >
                            {cat}
                        </Link>
                    ))}
                    <Link href="/contact" className="text-purple-600 font-semibold hover:underline ml-2">
                        Contact Us
                    </Link>
                </nav>
            </div>
            <div className="md:hidden overflow-x-auto px-4 pb-2 flex gap-4 text-sm font-medium border-t border-gray-200">
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        className="whitespace-nowrap text-gray-600 hover:text-purple-600"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
        </header>
    );
};

export default Header;
