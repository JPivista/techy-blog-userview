'use client';
import React from 'react';
import Link from 'next/link';

const BlogSubmissionSuccess = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-12">
                    {/* Success Icon */}
                    <div className="text-8xl mb-8 animate-bounce">🎉</div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                        Blog Submitted Successfully!
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Thank you for sharing your knowledge with our community!
                        We've received your blog submission and our team will review it shortly.
                    </p>

                    <div className="bg-white/10 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-white mb-3">What happens next?</h3>
                        <ul className="text-gray-300 space-y-2 text-left">
                            <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Our team will review your content
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                We'll contact you if any edits are needed
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                Your blog will be published on our platform
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                You'll receive a notification when it's live
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                        >
                            Back to Home
                        </Link>

                        <Link
                            href="/contact-us"
                            className="px-8 py-4 bg-white/20 border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <p className="text-sm text-gray-400 mt-8">
                        Have questions? Feel free to reach out to us at{' '}
                        <a href="mailto:support@techyblog.com" className="text-yellow-400 hover:underline">
                            support@techyblog.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogSubmissionSuccess; 