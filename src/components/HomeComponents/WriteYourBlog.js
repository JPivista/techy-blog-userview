'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

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

        // SEO Fields (Required)
        metaTitle: '',
        metaDescription: '',

        formName: 'write your blog'
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [imageLink, setImageLink] = useState('');
    const [imageSize, setImageSize] = useState(0); // Image size in bytes
    const [isMounted, setIsMounted] = useState(false);

    // Verification Modal States
    const [showVerification, setShowVerification] = useState(false);
    const [submissionId, setSubmissionId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // OTP Timer states (15 minutes = 900 seconds)
    const [otpTimer, setOtpTimer] = useState(0);
    const [isOtpValid, setIsOtpValid] = useState(false);
    const [canResendOtp, setCanResendOtp] = useState(true);

    // Tiptap editor configuration - only create when mounted
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your full blog content here... Use the toolbar to format with headings (H2, H3), paragraphs, lists, and more!',
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-400 underline',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
        ],
        content: formData.content,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-white',
            },
        },
        immediatelyRender: false,
        enabled: isMounted,
    });

    // Update editor content when formData.content changes externally
    useEffect(() => {
        if (editor && isMounted && formData.content !== editor.getHTML()) {
            editor.commands.setContent(formData.content);
        }
    }, [formData.content, editor, isMounted]);

    // Handle image link insertion - defined after editor (inserts URL as text, not image)
    const handleImageLink = useCallback(() => {
        if (!editor) {
            alert('Editor not ready. Please try again.');
            return;
        }

        const imageUrl = window.prompt('Enter image URL (Google Drive link, Google Photos link, or any image URL):\n\n💡 Tip: For Google Drive/Photos, make sure the file is set to "Anyone with the link can view"');

        if (!imageUrl) {
            return; // User cancelled
        }

        // Basic URL validation
        try {
            new URL(imageUrl);
        } catch (e) {
            alert('Please enter a valid URL');
            return;
        }

        // Insert URL as plain text (not as image element)
        editor.chain().focus().insertContent(imageUrl).run();
    }, [editor]);

    // Ensure component is mounted on client to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch categories from WordPress API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://docs.techy-blog.com/wp-json/wp/v2/categories?per_page=100');
                if (response.ok) {
                    const wpCategories = await response.json();

                    // Transform WordPress categories to match expected structure
                    const transformedCategories = wpCategories
                        .filter(cat => cat.slug !== 'uncategorized' && cat.name !== 'Uncategorized')
                        .map(cat => ({
                            _id: cat.id.toString(),
                            name: cat.name,
                            slug: cat.slug
                        }));

                    setCategories(transformedCategories);
                    // console.log('📋 Categories loaded from WordPress:', transformedCategories);
                } else {
                    console.error('Failed to fetch categories from WordPress');
                }
            } catch (error) {
                console.error('Error fetching categories from WordPress:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // OTP Timer useEffect - countdown from 15 minutes (900 seconds)
    useEffect(() => {
        let interval = null;

        if (isOtpValid && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(timer => {
                    if (timer <= 1) {
                        setIsOtpValid(false);
                        setCanResendOtp(true);
                        setVerificationMessage('');
                        setVerificationError('OTP has expired. Please request a new one.');
                        return 0;
                    }
                    return timer - 1;
                });
            }, 1000);
        } else if (!isOtpValid) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isOtpValid, otpTimer]);

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            setIsOtpValid(false);
            setOtpTimer(0);
        };
    }, []);

    // Format timer display (MM:SS)
    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Start OTP timer (15 minutes)
    const startOtpTimer = () => {
        setOtpTimer(900); // 15 minutes in seconds
        setIsOtpValid(true);
        setCanResendOtp(false);
        setVerificationError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Mobile number validation - maximum 10 digits
        if (name === 'mobileNumber') {
            const numericValue = value.replace(/\D/g, ''); // Remove non-digits
            if (numericValue.length <= 10) {
                setFormData((prev) => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

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

    // Fetch and calculate image size
    useEffect(() => {
        const fetchImageSize = async () => {
            if (!imageLink) {
                setImageSize(0);
                return;
            }

            try {
                // Try to fetch the image to get its actual size
                const response = await fetch(imageLink, { method: 'HEAD' });
                const contentLength = response.headers.get('content-length');

                if (contentLength) {
                    setImageSize(parseInt(contentLength, 10));
                } else {
                    // If HEAD doesn't work, try GET but only read headers
                    const imgResponse = await fetch(imageLink);
                    const blob = await imgResponse.blob();
                    setImageSize(blob.size);
                }
            } catch (error) {
                // If we can't fetch, estimate based on URL or set a default
                // For Google Drive links, we can't easily get size, so estimate 500KB
                console.warn('Could not fetch image size:', error);
                setImageSize(500 * 1024); // Default estimate: 500KB
            }
        };

        fetchImageSize();
    }, [imageLink]);

    // Calculate content size in bytes (including images)
    const calculateContentSize = () => {
        let totalSize = 0;

        // Calculate text content size (UTF-8 encoding: 1-4 bytes per character)
        const textContent = formData.title + formData.description + formData.content +
            formData.metaTitle + formData.metaDescription + formData.tags;
        totalSize += new Blob([textContent]).size;

        // Add actual image size (fetched from image)
        totalSize += imageSize;

        // Calculate base64 embedded images in content (if any)
        const base64Images = formData.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g);
        if (base64Images) {
            base64Images.forEach(base64 => {
                // Base64 size is approximately 4/3 of original, but we count the string length
                totalSize += new Blob([base64]).size;
            });
        }

        return totalSize;
    };

    // Form validation function
    const validateForm = () => {
        if (!formData.fullName.trim()) {
            alert('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            alert('Email is required');
            return false;
        }
        // Mobile number is optional, but if provided, it must be exactly 10 digits
        if (formData.mobileNumber.trim() && formData.mobileNumber.length !== 10) {
            alert('Mobile number must be exactly 10 digits');
            return false;
        }
        if (!formData.title.trim()) {
            alert('Blog title is required');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Blog description is required');
            return false;
        }
        if (!formData.content.trim()) {
            alert('Blog content is required');
            return false;
        }
        if (formData.categories.length === 0) {
            alert('Please select at least one category');
            return false;
        }
        if (!formData.tags.trim()) {
            alert('Tags are required');
            return false;
        }
        if (!formData.metaTitle.trim()) {
            alert('Meta title is required');
            return false;
        }
        if (!formData.metaDescription.trim()) {
            alert('Meta description is required');
            return false;
        }

        // Check content size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        const contentSize = calculateContentSize();

        if (contentSize > maxSize) {
            const sizeInMB = (contentSize / (1024 * 1024)).toFixed(2);
            alert(`Content size (${sizeInMB} MB) exceeds the maximum limit of 2 MB. Please reduce the content size or use smaller images.`);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // First, submit to blog-submissions API to trigger OTP email
            const submissionData = {
                fullName: formData.fullName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                title: formData.title,
                description: formData.description,
                content: formData.content,
                categories: formData.categories,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                formName: formData.formName
            };

            // Submit to blog-submissions API to get submissionId and trigger OTP
            const response = await fetch('/api/blog-submissions/submitBlog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();
            setLoading(false);

            if (result.success && result.data && result.data.submissionId) {
                // Store submission ID and show verification modal
                setSubmissionId(result.data.submissionId);
                setShowVerification(true);
                startOtpTimer(); // Start 15-minute timer
                setVerificationMessage('Verification code sent to your email! Please check your inbox.');
            } else {
                alert(`Failed to send verification code: ${result.message || 'Unknown error'}`);
                console.error('Submission error:', result);
            }
        } catch (err) {
            setLoading(false);
            alert('Server error! Please try again.');
            console.error('Error details:', err);
        }
    };

    // Function to submit to Contact Form 7 and WordPress after verification
    const submitToBackends = async () => {
        try {
            // Prepare JSON data for submission
            const submissionData = {
                fullName: formData.fullName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                title: formData.title,
                description: formData.description,
                content: formData.content,
                categories: formData.categories,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                imageLink: imageLink.trim() || '' // Add image link if provided
            };

            // Submit to Contact Form 7 API
            try {
                const formDataCF7 = new FormData();
                formDataCF7.append('fullName', formData.fullName);
                formDataCF7.append('email', formData.email);
                formDataCF7.append('mobileNumber', formData.mobileNumber);

                const cf7Response = await fetch('https://docs.techy-blog.com/wp-json/contact-form-7/v1/contact-forms/19/feedback', {
                    method: 'POST',
                    body: formDataCF7
                });

                const cf7Result = await cf7Response.json();
            } catch (cf7Error) {
                console.error('⚠️ Contact Form 7 submission error:', cf7Error);
                // Continue with WordPress submission even if CF7 fails
            }

            // Submit to WordPress via Next.js API route
            const response = await fetch('/api/wordpress/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();

            if (result.success) {
                return { success: true, data: result.data };
            } else {
                console.error('WordPress submission error:', result);
                return { success: false, message: result.message || 'Unknown error' };
            }
        } catch (err) {
            console.error('Backend submission error:', err);
            return { success: false, message: 'Server error during submission' };
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setVerificationLoading(true);
        setVerificationMessage('');
        setVerificationError('');

        // Validate inputs before sending
        if (!submissionId || !verificationCode) {
            setVerificationError('Please enter the verification code from your email.');
            setVerificationLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/blog-submissions/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    verificationCode: verificationCode.trim()
                })
            });

            const result = await response.json();

            if (result.success) {
                setIsVerified(true);
                setVerificationMessage('Email verified successfully! Submitting your blog...');

                // Stop OTP timer since verification is successful
                setIsOtpValid(false);
                setOtpTimer(0);
                setCanResendOtp(true);

                // Now submit to Contact Form 7 and WordPress after successful verification
                const backendResult = await submitToBackends();

                if (backendResult.success) {
                    setVerificationMessage('🎉 Thank you! Your email has been verified and your blog has been submitted successfully! A confirmation email has been sent to your inbox.\n\n✨ Your post is now under review by our editorial team. We carefully review each submission to ensure quality and relevance. You can expect to hear back from us within 24 to 72 hours. Once approved, your blog will be published and shared with our community of readers.\n\nWe appreciate your patience and look forward to sharing your insights with the world!' + (backendResult.data?.postId ? `\n\n📝 Post ID: ${backendResult.data.postId}` : ''));
                } else {
                    setVerificationError(`Email verified, but submission failed: ${backendResult.message || 'Unknown error'}`);
                    setIsVerified(false); // Allow retry
                }
            } else {
                const errorMessage = result.message || 'Verification failed';
                setVerificationError(errorMessage);
                console.error('❌ Verification failed:', errorMessage);
            }
        } catch (err) {
            console.error('❌ Network error during verification:', err);
            setVerificationError('Network error. Please check your connection and try again.');
        } finally {
            setVerificationLoading(false);
        }
    };

    // Handle closing verification modal and resetting form
    const handleCloseVerification = () => {
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
        setImageLink('');
        setVerificationCode('');
        setIsVerified(false);
        setVerificationMessage('');
        setVerificationError('');
        // Reset timer states
        setIsOtpValid(false);
        setOtpTimer(0);
        setCanResendOtp(true);
        setSubmissionId('');
    };

    const handleResendCode = async () => {
        setVerificationLoading(true);
        setVerificationMessage('');
        setVerificationError('');

        try {
            const response = await fetch('/api/blog-submissions/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ submissionId })
            });

            const result = await response.json();

            if (result.success) {
                setVerificationMessage('New verification code sent to your email!');
                // Start new 15-minute timer
                startOtpTimer();
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
                        Share your knowledge and insights with our community. Submit your blog content and we will review and publish it for you.
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
                                    <label className="block mb-2 text-sm font-medium text-white">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number (optional)"
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
                                    <label className="block mb-2 text-sm font-medium text-white">
                                        Image Link (Google Drive Link) *
                                    </label>
                                    <input
                                        type="url"
                                        value={imageLink}
                                        onChange={(e) => setImageLink(e.target.value)}
                                        placeholder="https://drive.google.com/file/d/... or https://drive.google.com/uc?export=view&id=..."
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                        required
                                    />
                                    <p className="text-sm text-gray-300 mt-2">
                                        Enter your Google Drive image link. Make sure the file is set to "Anyone with the link can view" for it to work properly.
                                    </p>
                                    <p className="text-xs text-yellow-300 mt-1">
                                        💡 Tip: Right-click your image in Google Drive → Get link → Make sure sharing is set to "Anyone with the link"
                                    </p>
                                    {imageLink && (
                                        <div className="mt-4 relative w-full h-64">
                                            <NextImage
                                                src={imageLink}
                                                alt="Banner preview"
                                                fill
                                                className="object-contain rounded-lg border border-white/30"
                                                unoptimized
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Blog Content *</label>
                                    <div className="mb-4 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                                        <p className="text-sm text-white font-semibold mb-2">📝 Option 1: Share Google Drive Document</p>
                                        <p className="text-sm text-gray-200 mb-2">
                                            If you have your blog content in a Google Drive document, please share it with:
                                        </p>
                                        <p className="text-sm text-yellow-300 font-mono mb-3">
                                            <strong>mvivekraz@gmail.com</strong>
                                        </p>
                                        <p className="text-xs text-gray-300 mb-2">
                                            <strong>Steps:</strong>
                                        </p>
                                        <ol className="text-xs text-gray-300 list-decimal list-inside space-y-1 ml-2">
                                            <li>Open your Google Drive document</li>
                                            <li>Click "Share" button</li>
                                            <li>Add email: <span className="text-yellow-300 font-mono">mvivekraz@gmail.com</span></li>
                                            <li>Give "Editor" or "Viewer" permission</li>
                                            <li>Click "Send"</li>
                                        </ol>
                                        <p className="text-xs text-yellow-300 mt-3">
                                            ⚠️ After sharing, you can write "Content shared via Google Drive" in the field below, or paste your content directly.
                                        </p>
                                    </div>
                                    {isMounted && editor ? (
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
                                            {/* Toolbar */}
                                            <div className="flex flex-wrap gap-2 p-3 bg-white/15 border-b border-white/20">
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 })
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    H2
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 3 })
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    H3
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bold')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    <strong>B</strong>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('italic')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    <em>I</em>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('underline')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    <u>U</u>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('strike')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    <s>S</s>
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                {/* Image Link */}
                                                <button
                                                    type="button"
                                                    onClick={handleImageLink}
                                                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30"
                                                    title="Add Image Link (Google Drive or any image URL)"
                                                >
                                                    📷 Image
                                                </button>
                                                {/* Link */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const url = window.prompt('Enter URL:');
                                                        if (url) {
                                                            editor.chain().focus().setLink({ href: url }).run();
                                                        }
                                                    }}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('link')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    🔗 Link
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bulletList')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    •
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('orderedList')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    1.
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('blockquote')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    "
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().setParagraph().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('paragraph')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    P
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                {/* Text Alignment */}
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                                    className={`px-2 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'left' })
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                    title="Align Left"
                                                >
                                                    ⬅
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                                    className={`px-2 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'center' })
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                    title="Align Center"
                                                >
                                                    ⬌
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                                    className={`px-2 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'right' })
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                    title="Align Right"
                                                >
                                                    ➡
                                                </button>
                                                <div className="w-px h-6 bg-white/30 mx-1"></div>
                                                {/* Code Block */}
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('codeBlock')
                                                        ? 'bg-yellow-400 text-gray-900'
                                                        : 'bg-white/20 text-white hover:bg-white/30'
                                                        }`}
                                                >
                                                    {'</>'}
                                                </button>
                                                {/* Undo/Redo */}
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().undo().run()}
                                                    disabled={!editor.can().undo()}
                                                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Undo"
                                                >
                                                    ↶
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => editor.chain().focus().redo().run()}
                                                    disabled={!editor.can().redo()}
                                                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Redo"
                                                >
                                                    ↷
                                                </button>
                                            </div>
                                            {/* Editor Content */}
                                            <div className="p-4 min-h-[300px] bg-white/10">
                                                <EditorContent editor={editor} />
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea
                                            name="content"
                                            rows="8"
                                            required
                                            value={formData.content}
                                            onChange={handleChange}
                                            placeholder="Loading editor... Write your full blog content here..."
                                            className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                            style={{ minHeight: '300px' }}
                                        />
                                    )}
                                    <style jsx global>{`
                                        .ProseMirror {
                                            outline: none;
                                            min-height: 300px;
                                            color: white;
                                        }
                                        .ProseMirror p {
                                            margin-bottom: 1rem;
                                            line-height: 1.6;
                                        }
                                        .ProseMirror h2 {
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            margin-top: 1.5rem;
                                            margin-bottom: 1rem;
                                            color: white;
                                        }
                                        .ProseMirror h3 {
                                            font-size: 1.25rem;
                                            font-weight: 600;
                                            margin-top: 1.25rem;
                                            margin-bottom: 0.75rem;
                                            color: white;
                                        }
                                        .ProseMirror ul, .ProseMirror ol {
                                            margin-left: 1.5rem;
                                            margin-bottom: 1rem;
                                        }
                                        .ProseMirror ul {
                                            list-style-type: disc;
                                        }
                                        .ProseMirror ol {
                                            list-style-type: decimal;
                                        }
                                        .ProseMirror blockquote {
                                            border-left: 4px solid rgba(255, 255, 255, 0.3);
                                            padding-left: 1rem;
                                            margin: 1rem 0;
                                            font-style: italic;
                                            color: rgba(255, 255, 255, 0.9);
                                        }
                                        .ProseMirror img {
                                            max-width: 100%;
                                            height: auto;
                                            margin: 1rem 0;
                                            border-radius: 0.5rem;
                                            border: 2px solid rgba(255, 255, 255, 0.2);
                                        }
                                        .ProseMirror a {
                                            color: #60a5fa;
                                            text-decoration: underline;
                                        }
                                        .ProseMirror a:hover {
                                            color: #93c5fd;
                                        }
                                        .ProseMirror code {
                                            background: rgba(0, 0, 0, 0.3);
                                            padding: 0.2rem 0.4rem;
                                            border-radius: 0.25rem;
                                            font-family: monospace;
                                            color: #fbbf24;
                                        }
                                        .ProseMirror pre {
                                            background: rgba(0, 0, 0, 0.5);
                                            padding: 1rem;
                                            border-radius: 0.5rem;
                                            overflow-x: auto;
                                            margin: 1rem 0;
                                        }
                                        .ProseMirror pre code {
                                            background: transparent;
                                            padding: 0;
                                            color: white;
                                        }
                                        .ProseMirror p.is-editor-empty:first-child::before {
                                            content: attr(data-placeholder);
                                            float: left;
                                            color: rgba(255, 255, 255, 0.7);
                                            pointer-events: none;
                                            height: 0;
                                        }
                                        .ProseMirror [style*="text-align: left"] {
                                            text-align: left;
                                        }
                                        .ProseMirror [style*="text-align: center"] {
                                            text-align: center;
                                        }
                                        .ProseMirror [style*="text-align: right"] {
                                            text-align: right;
                                        }
                                    `}</style>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-gray-300">
                                            💡 Use the toolbar above to format your content with headings (H2, H3), paragraphs, lists, bold, italic, and more. Or share a Google Drive document with <span className="text-yellow-300 font-mono">mvivekraz@gmail.com</span> and mention it in the editor.
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-xs text-gray-400">
                                            📦 Total size includes content + image
                                        </p>
                                        {(() => {
                                            const maxSize = 2 * 1024 * 1024; // 2MB
                                            const currentSize = calculateContentSize();
                                            const remainingSize = maxSize - currentSize;
                                            const remainingMB = (remainingSize / (1024 * 1024)).toFixed(2);
                                            const currentMB = (currentSize / (1024 * 1024)).toFixed(2);

                                            return (
                                                <div className="text-right">
                                                    <span className={`text-xs font-medium ${currentSize > maxSize
                                                        ? 'text-red-400'
                                                        : currentSize > 1.5 * 1024 * 1024
                                                            ? 'text-yellow-400'
                                                            : 'text-green-400'
                                                        }`}>
                                                        {currentSize > maxSize ? (
                                                            <span>⚠️ Exceeded by {Math.abs(remainingMB)} MB</span>
                                                        ) : (
                                                            <span>✅ {remainingMB} MB remaining ({currentMB} MB used)</span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Section - Fixed */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                Categories & Tags *
                            </h3>
                            <div className="space-y-6">
                                {/* Categories as checkboxes */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Categories *</label>
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
                                    <p className="text-sm text-gray-300 mt-2">
                                        Select at least one category for your blog
                                    </p>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Tags *</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        required
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="Enter tags separated by commas (required)"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                    <p className="text-sm text-gray-300 mt-1">Example: technology, programming, web development</p>
                                </div>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                                SEO Information *
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Meta Title *</label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        required
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        placeholder="SEO title for search engines (required)"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                    />
                                    <p className="mt-2 text-sm text-white/70">
                                        This will be the title shown in search engine results
                                    </p>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-white">Meta Description *</label>
                                    <textarea
                                        name="metaDescription"
                                        rows="3"
                                        required
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        placeholder="SEO description for search engines (required)"
                                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                                    ></textarea>
                                    <p className="mt-2 text-sm text-white/70">
                                        Brief description that will appear in search engine results
                                    </p>
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
                                    ? 'Your blog submission has been received and is ready for review!'
                                    : `Enter the 6-digit code sent to ${formData.email}`
                                }
                            </p>
                        </div>

                        {/* Timer Status - Always show when verification is active */}
                        {!isVerified && (isOtpValid && otpTimer > 0) && (
                            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-blue-800">OTP Valid</span>
                                    </div>
                                    <div className="font-mono text-sm font-bold text-blue-900">
                                        {formatTimer(otpTimer)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {verificationMessage && (
                            <div className={`mb-4 p-4 ${isVerified ? 'bg-green-50 border-2 border-green-400' : 'bg-green-100 border border-green-400'} text-green-700 rounded-lg text-sm`}>
                                <div className="flex items-start gap-2">
                                    <div className={`w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0 ${isVerified ? 'animate-pulse' : ''}`}></div>
                                    <div className="flex-1 whitespace-pre-line">{verificationMessage}</div>
                                </div>
                                {verificationMessage.includes('sent') && isOtpValid && !isVerified && (
                                    <div className="mt-2 text-xs text-green-600">
                                        Your OTP is valid for 15 minutes. Timer started!
                                    </div>
                                )}
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

                                {/* OTP Timer Display - Always show when OTP is active */}
                                {isOtpValid && otpTimer > 0 && (
                                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="font-semibold text-blue-700">OTP Active - Expires in:</span>
                                        </div>
                                        <div className="font-mono text-3xl font-bold text-blue-900 mb-1">
                                            {formatTimer(otpTimer)}
                                        </div>
                                        <p className="text-xs text-blue-600">
                                            Resend will be available after timer expires
                                        </p>
                                    </div>
                                )}

                                {/* Timer Expired Message */}
                                {!isOtpValid && otpTimer === 0 && canResendOtp && !isVerified && (
                                    <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="font-semibold text-red-700">OTP has expired!</span>
                                        </div>
                                        <p className="text-sm text-red-600 mb-1">
                                            Your verification code is no longer valid
                                        </p>
                                        <p className="text-xs text-red-500">
                                            Click &ldquo;Resend OTP&rdquo; below to get a new 15-minute code
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={verificationLoading || verificationCode.length !== 6 || (!isOtpValid && otpTimer === 0)}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verificationLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={verificationLoading || !canResendOtp}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] ${canResendOtp
                                            ? 'border border-green-400 text-green-700 hover:bg-green-50 bg-green-50'
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}
                                        title={!canResendOtp ? `Resend available in ${formatTimer(otpTimer)}` : 'Send new 15-minute OTP'}
                                    >
                                        {!canResendOtp ? (
                                            <div className="text-center">
                                                <div className="text-xs font-normal">Resend in</div>
                                                <div className="font-mono text-sm font-bold">{formatTimer(otpTimer)}</div>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="font-semibold">Resend OTP</div>
                                                <div className="text-xs font-normal">Get new 15min code</div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {isVerified && (
                            <button
                                onClick={handleCloseVerification}
                                className="mt-6 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
                            >
                                Close
                            </button>
                        )}

                        {!isVerified && (
                            <button
                                onClick={handleCloseVerification}
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