'use client';
import React, { useState, useEffect } from 'react';

const serviceOptions = [
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'seo', label: 'SEO' },
    { id: 'sem', label: 'SEM' },
    { id: 'maintenance', label: 'Website Maintenance' },
    { id: 'development', label: 'Development' },
];

const LetsWorkTogether = () => {
    const [selected, setSelected] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
    });

    const toggleOption = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelected(selected.length === serviceOptions.length ? [] : serviceOptions.map(opt => opt.id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selected.length === 0) {
            alert("Please select at least one service.");
            return;
        }

        const payload = { ...formData, services: selected };

        try {
            const response = await fetch('/api/sendMail/work-together', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Network error');

            setFormData({ name: '', company: '', email: '', phone: '', message: '' });
            setSelected([]);
            setShowModal(true);
        } catch (error) {
            console.error('Form submission error:', error);
            alert("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        if (showModal) window.scrollTo(0, 0);
    }, [showModal]);

    return (
        <section className="bg-[#1F2A3C] py-16 px-4 text-white relative">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-lg">
                    Let’s Work Together
                </h2>
                <p className="text-gray-300 mb-10 text-lg">
                    Tell us more about your company and needs. We'll reach out with tailored solutions.
                </p>

                <form onSubmit={handleSubmit} className="bg-[#14202E] rounded-xl p-8 shadow-2xl text-left space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-[#1F2A3C] border border-gray-600 px-4 py-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            name="company"
                            type="text"
                            placeholder="Company Name"
                            required
                            value={formData.company}
                            onChange={handleInputChange}
                            className="bg-[#1F2A3C] border border-gray-600 px-4 py-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-[#1F2A3C] border border-gray-600 px-4 py-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-[#1F2A3C] border border-gray-600 px-4 py-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <textarea
                        name="message"
                        placeholder="Brief description about your project, goals or requirements..."
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-[#1F2A3C] border border-gray-600 px-4 py-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <div className="space-y-2">
                        <p className="text-gray-300 font-medium">Services You’re Interested In:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {serviceOptions.map(option => (
                                <label key={option.id} className="flex items-center space-x-3 text-gray-200 cursor-pointer hover:text-white">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option.id)}
                                        onChange={() => toggleOption(option.id)}
                                        className="accent-purple-500 w-5 h-5"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                            <label className="flex items-center space-x-3 text-gray-200 cursor-pointer hover:text-white col-span-full">
                                <input
                                    type="checkbox"
                                    checked={selected.length === serviceOptions.length}
                                    onChange={toggleSelectAll}
                                    className="accent-yellow-400 w-5 h-5"
                                />
                                <span>Select All</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-black font-semibold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition-transform"
                    >
                        Submit Request
                    </button>
                </form>
            </div>

            {/* Popup Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white text-black rounded-xl p-8 max-w-md text-center shadow-xl animate-fadeIn">
                        <h3 className="text-2xl font-semibold mb-4">🎉 Thank you!</h3>
                        <p className="text-lg mb-6">We’ve received your request. Our team will contact you soon.</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 px-6 py-2 rounded-full text-white font-medium shadow-md hover:scale-105 transition-transform"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LetsWorkTogether;
