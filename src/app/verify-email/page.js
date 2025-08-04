'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VerifyEmailPage = () => {
    const router = useRouter();

    useEffect(() => {
        // This page is deprecated - redirect to main form with verification modal
        console.log('🔄 Redirecting to main form - verification is now handled via modal');
        router.push('/write-your-blog');
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
            <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Redirecting...</h2>
                <p className="text-gray-300">
                    Email verification is now handled directly on the blog submission form.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    You will be redirected automatically...
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;