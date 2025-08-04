'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const WriteYourBlog = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        // Personal Information (Required)
        fullName: '',
        email: '',
        mobileNumber: '',

        // Blog Content (Required)
        title: '',
        description: '',
        content: '',

        // Categories (Fixed - removed mainCategory, subcategories)
        categories: [],
        tags: '',

        // SEO Fields (Optional)
        metaTitle: '',
        metaDescription: '',

        formName: 'write your blog'
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Verification Modal States
    const [showVerification, setShowVerification] = useState(false);
    const [submissionId, setSubmissionId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fixed: Direct call to backend without auth
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                if (response.ok) {
                    const result = await response.json();

                    // Handle the response structure
                    if (result.success && result.data) {
                        setCategories(result.data);
                        console.log('📋 Categories loaded:', result.data);
                    } else {
                        console.error('Invalid categories response structure');
                    }
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle category selection (checkboxes)
    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            categories: checked
                ? [...prev.categories, value]
                : prev.categories.filter(cat => cat !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data for backend submission (direct integration)
            const submissionData = {
                fullName: formData.fullName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                title: formData.title,
                description: formData.description,
                content: formData.content,
                categories: formData.categories, // Array of category names
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert to array
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                formName: formData.formName
            };

            console.log('📤 Submitting blog data directly to backend:', submissionData);

            // Submit directly to backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-submissions/create-blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();
            setLoading(false);

            if (result.success) {
                console.log('✅ Blog submitted successfully:', result);

                // Show verification modal
                setSubmissionId(result.data.submissionId);
                setShowVerification(true);
                setVerificationMessage('Blog submitted! Check your email for the verification code.');
            } else {
                alert(`Submission failed: ${result.message || 'Unknown error'}`);
                console.error('Submission error:', result);
            }
        } catch (err) {
            setLoading(false);
            alert('Server error! Please try again.');
            console.error('Error details:', err);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setVerificationLoading(true);
        setVerificationMessage('');
        setVerificationError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-submissions/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    verificationCode
                })
            });

            const result = await response.json();

            if (result.success) {
                setIsVerified(true);
                setVerificationMessage('Email verified successfully! Your blog is now submitted for review.');

                // Auto close after 3 seconds
                setTimeout(() => {
                    setShowVerification(false);
                    // Reset form
                    setFormData({
                        fullName: '',
                        email: '',
                        mobileNumber: '',
                        title: '',
                        description: '',
                        content: '',
                        categories: [],
                        tags: '',
                        metaTitle: '',
                        metaDescription: '',
                        formName: 'write your blog'
                    });
                    setVerificationCode('');
                    setIsVerified(false);
                }, 3000);
            } else {
                setVerificationError(result.message || 'Verification failed');
            }
        } catch (err) {
            setVerificationError('Network error. Please try again.');
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleResendCode = async () => {
        setVerificationLoading(true);
        setVerificationMessage('');
        setVerificationError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-submissions/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ submissionId })
            });

            const result = await response.json();

            if (result.success) {
                setVerificationMessage('New verification code sent to your email!');
            } else {
                setVerificationError(result.message || 'Failed to resend code');
            }
        } catch (err) {
            setVerificationError('Network error. Please try again.');
        } finally {
            setVerificationLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-lg">
                        Write Your Blog
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Share your knowledge and insights with our community. Submit your blog content and we&apos;ll review and publish it for you.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Hidden field for formName */}
                        <input
                            type="hidden"
                            name="formName"
                            value={formData.formName}
                        />

                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        required
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Blog Content Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                Blog Content
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Blog Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter your blog title"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Short Description *</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Brief description of your blog (will appear in previews)"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Blog Content *</label>
                                    <textarea
                                        name="content"
                                        rows="8"
                                        required
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Write your full blog content here..."
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                    ></textarea>
                                    <p className="text-sm text-gray-300 mt-2">
                                        Note: Only text content is accepted. Images will not be processed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Categories Section - Fixed */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                Categories & Tags
                            </h3>
                            <div className="space-y-6">
                                {/* Categories as checkboxes */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Categories</label>
                                    {categoriesLoading ? (
                                        <p className="text-sm text-gray-300">Loading categories...</p>
                                    ) : (
                                        <div className="grid md:grid-cols-3 gap-3">
                                            {categories.map((category) => (
                                                <label key={category._id} className="flex items-center space-x-2 text-white">
                                                    <input
                                                        type="checkbox"
                                                        value={category.name}
                                                        checked={formData.categories.includes(category.name)}
                                                        onChange={handleCategoryChange}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <span className="text-sm">{category.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Tags</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="Enter tags separated by commas"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                    <p className="text-sm text-gray-300 mt-1">Example: technology, programming, web development</p>
                                </div>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                SEO (Optional)
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Meta Title</label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        placeholder="SEO title for search engines"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Meta Description</label>
                                    <textarea
                                        name="metaDescription"
                                        rows="3"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="SEO description for search engines"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Your Blog'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Email Verification Modal */}
            {showVerification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            {isVerified ? (
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {isVerified ? 'Email Verified!' : 'Verify Your Email'}
                            </h3>
                            <p className="text-gray-600">
                                {isVerified
                                    ? 'Your blog submission is now ready for review.'
                                    : `Enter the 6-digit code sent to ${formData.email}`
                                }
                            </p>
                        </div>

                        {verificationMessage && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                                {verificationMessage}
                            </div>
                        )}

                        {verificationError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {verificationError}
                            </div>
                        )}

                        {!isVerified && (
                            <form onSubmit={handleVerifyEmail} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={verificationLoading || verificationCode.length !== 6}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verificationLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={verificationLoading}
                                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Resend
                                    </button>
                                </div>
                            </form>
                        )}

                        {!isVerified && (
                            <button
                                onClick={() => setShowVerification(false)}
                                className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default WriteYourBlog; 