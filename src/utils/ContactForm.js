'use client';
import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            setLoading(false);

            if (result.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Something went wrong. Try again.');
                console.log(result.error);
            }
        } catch (err) {
            setLoading(false);
            alert('Server error!');
            console.error(err);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#1e1b4b] via-[#9333ea] to-[#facc15] p-6">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-10 text-white animate-fade-in-up">
                <h2 className="text-4xl font-bold mb-8 text-center drop-shadow-md">
                    Start Your Journey With Us
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your message here..."
                            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>

            {/* Popup on success */}
            {submitted && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-black max-w-sm text-center">
                        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                        <p>Thank you for contacting us. We’ll get back to you ASAP.</p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactForm;
