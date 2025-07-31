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

        // Categories (Required)
        mainCategory: '',
        subcategories: [],
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

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
                    }
                });
                if (response.ok) {
                    const result = await response.json();

                    // Handle the new response structure
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Debug: Log the data being sent
        console.log('📤 Data being sent to APIs:', formData);

        try {
            // Send to local API (existing functionality)
            const localRes = await fetch('/api/blog-submissions/submitBlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const localResult = await localRes.json();

            // Send to backend API - FIXED ENDPOINT
            let backendSuccess = false;
            let backendResult = null;

            try {
                console.log('📤 Sending to backend API:', JSON.stringify(formData));

                // FIXED: Use the correct backend endpoint with environment variables
                const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-submissions/create-blog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add CORS headers if needed
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
                        // Alternative: Basic auth if needed
                        // 'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_API_USERNAME}:${process.env.NEXT_PUBLIC_API_PASSWORD}`)}`,
                    },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        mobileNumber: formData.mobileNumber,
                        title: formData.title,
                        description: formData.description,
                        content: formData.content,
                        mainCategory: formData.mainCategory,
                        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                        metaTitle: formData.metaTitle,
                        metaDescription: formData.metaDescription,
                        categoryIds: formData.mainCategory ? [formData.mainCategory] : [],
                        categories: formData.mainCategory ? [formData.mainCategory] : [],
                        subcategories: [],
                        isSubmission: true
                    }),
                });

                backendResult = await backendRes.json();
                backendSuccess = backendRes.ok;

                if (!backendRes.ok) {
                    console.error('Backend API Error:', backendRes.status, backendRes.statusText);
                    console.error('Backend Response:', backendResult);

                    // Handle authentication errors specifically
                    if (backendRes.status === 401) {
                        console.error('Authentication failed. Please check your API token.');
                        console.error('Make sure NEXT_PUBLIC_API_TOKEN is set in your .env file');
                    }
                } else {
                    console.log('✅ Backend received data successfully:', backendResult);
                }
            } catch (backendError) {
                console.error('Backend API Connection Error:', backendError);
                console.log(`Please check if your backend server is running on ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
            }

            setLoading(false);

            // Check if local API was successful (email sending)
            if (localResult.success) {
                setFormData({
                    // Personal Information (Required)
                    fullName: '',
                    email: '',
                    mobileNumber: '',

                    // Blog Content (Required)
                    title: '',
                    description: '',
                    content: '',

                    // Categories (Required)
                    mainCategory: '',
                    subcategories: [],
                    categories: [],
                    tags: '',

                    // SEO Fields (Optional)
                    metaTitle: '',
                    metaDescription: '',

                    formName: 'write your blog'
                });

                if (backendSuccess) {
                    console.log('✅ Data sent successfully to both APIs');
                    console.log('Backend response:', backendResult);
                } else {
                    console.log('⚠️ Email sent successfully, but backend storage failed');
                    console.log('Backend error:', backendResult);
                }

                // Redirect to success page
                router.push('/blog-submission-success');
            } else {
                alert('Something went wrong. Try again.');
                console.log('Local API error:', localResult.error);
            }
        } catch (err) {
            setLoading(false);
            alert('Server error!');
            console.error('Error details:', err);
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

                        {/* Categories Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                Categories & Tags
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Main Category *</label>
                                    <select
                                        name="mainCategory"
                                        required
                                        value={formData.mainCategory}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                        disabled={categoriesLoading}
                                    >
                                        <option value="">Select a main category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {categoriesLoading && (
                                        <p className="text-sm text-gray-300 mt-1">Loading categories...</p>
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
        </section>
    );
};

export default WriteYourBlog; 