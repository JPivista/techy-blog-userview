import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#14202E] text-[#F0B609] text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
            <p className="mb-6 text-[#cccccc] max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved. But don&apos;t worry, we&apos;ll get you back on track.
            </p>
            <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#F0B609] text-[#14202E] rounded-xl font-semibold hover:bg-[#e6a800] transition"
            >
                Go Home
            </Link>
        </div>
    );
}
