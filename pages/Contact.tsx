import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate EmailJS call
    // In a real integration: emailjs.sendForm('service_id', 'template_id', e.target, 'user_id')
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success message after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Have questions about DataFlow AI? We're here to help you automate your machine learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-apple-blue mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500 text-sm mb-4">
              Our friendly team is here to help.
            </p>
            <a href="mailto:work.vishwas1@gmail.com" className="text-apple-blue font-semibold hover:underline">
              work.vishwas1@gmail.com
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Office</h3>
            <p className="text-gray-500 text-sm">
              123 AI Boulevard<br/>
              Tech District, CA 94043
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
            {isSent && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-slide-up">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you shortly.</p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-8 text-apple-blue font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-apple-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Message <Send size={18} className="ml-2" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;