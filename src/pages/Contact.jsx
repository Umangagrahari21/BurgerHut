import React, { useState, useEffect } from 'react';

const BergerHutContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactItems = [
    {
      icon: '📍',
      title: 'Location',
      content: '123 Govind Nagar Market\nNear Raj Guest House,Raebareli'
    },
    {
      icon: '📞',
      title: 'Phone',
      content: '+91(9474633552)\nCall us for reservations'
    },
    {
      icon: '✉️',
      title: 'Email',
      content: 'rajS@burgerhut.com\nWe reply within 24 hours'
    },
    {
      icon: '🕐',
      title: 'Hours',
      content: 'Monday - Sunday\n09:00 AM - 09:00 PM'
    }
  ];

  const socialLinks = [
    { icon: '📘', label: 'Facebook', href: '#' },
    { icon: '📷', label: 'Instagram', href: '#' },
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '🎵', label: 'TikTok', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Contact Section */}
      <section className="min-h-screen bg-zinc-950 relative py-32">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-yellow-600 to-yellow-300"></div>
        
        <div className="max-w-6xl mx-auto px-5 lg:px-20">
          {/* Section Title */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="font-serif text-5xl lg:text-6xl font-bold text-yellow-600 mb-5">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We'd love to hear from you
            </p>
          </div>

          <div className={`grid lg:grid-cols-2 gap-20 items-start transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-yellow-600">
                Visit Us
              </h3>
              
              {/* Contact Items */}
              <div className="space-y-6">
                {contactItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-5 bg-white/5 rounded-2xl border border-yellow-600/10 transition-all duration-300 hover:bg-white/8 hover:border-yellow-600/30 hover:translate-x-2 group cursor-pointer"
                  >
                    <div className="text-2xl text-red-500 mr-5 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white text-base leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-12 text-center">
                <h4 className="text-yellow-600 mb-5 font-serif text-xl">
                  Follow Us
                </h4>
                <div className="flex justify-center gap-5">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      onClick={() => window.open(social.href, '_blank')}
                      className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-300 text-zinc-900 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-yellow-600/40"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 h-72 bg-white/10 border border-yellow-600/20 rounded-2xl flex items-center justify-center text-gray-400 text-lg backdrop-blur-sm">
                <span className="mr-3 text-xl">🗺️</span>
                Interactive Map Coming Soon
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-yellow-600/30 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/30">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-5 py-4 bg-white/10 border border-yellow-600/30 rounded-xl text-white text-base placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-yellow-600 focus:shadow-lg focus:shadow-yellow-600/20 focus:bg-white/15"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className="w-full px-5 py-4 bg-white/10 border border-yellow-600/30 rounded-xl text-white text-base placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-yellow-600 focus:shadow-lg focus:shadow-yellow-600/20 focus:bg-white/15"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject"
                      className="w-full px-5 py-4 bg-white/10 border border-yellow-600/30 rounded-xl text-white text-base placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-yellow-600 focus:shadow-lg focus:shadow-yellow-600/20 focus:bg-white/15"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      rows="5"
                      className="w-full px-5 py-4 bg-white/10 border border-yellow-600/30 rounded-xl text-white text-base placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-yellow-600 focus:shadow-lg focus:shadow-yellow-600/20 focus:bg-white/15 resize-vertical"
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-300 text-zinc-900 font-semibold text-lg uppercase tracking-wider rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-600/40 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BergerHutContact;