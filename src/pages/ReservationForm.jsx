import React, { useState, useEffect } from 'react';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState('');

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.guests) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert('Reservation request submitted successfully! We will contact you shortly to confirm.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const inputClasses = `
    w-full px-5 py-4 bg-white/10 border border-yellow-400/30 rounded-xl 
    text-white text-base placeholder-gray-400 font-sans
    transition-all duration-300 ease-out
    focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20
    hover:border-yellow-400/50
  `;

  const guestOptions = [
    { value: '', label: 'Number of Guests' },
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '5', label: '5 Guests' },
    { value: '6+', label: '6+ Guests' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-5 md:px-20 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-yellow-400 mb-5 font-bold">
              Reserve Your Table
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Reserve your seat and enjoy a special meal with us
            </p>
          </div>

          {/* Reservation Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-8 md:p-12 
              shadow-2xl shadow-black/50 animate-slide-in-up">
              
              <div className="space-y-6">
                {/* Name Input */}
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className={inputClasses}
                  />
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className={inputClasses}
                  />
                </div>

                {/* Phone Input */}
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                    className={inputClasses}
                  />
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={minDate}
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Guests Select */}
                <div className="form-group">
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    className={`${inputClasses} cursor-pointer`}
                  >
                    {guestOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        className="bg-gray-800 text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Special requests"
                    rows="4"
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`
                    w-full py-5 px-8 rounded-xl font-semibold text-lg uppercase tracking-wider
                    transition-all duration-300 ease-out
                    ${isSubmitting 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/40 active:translate-y-0'
                    }
                  `}
                >
                  {isSubmitting ? 'Submitting...' : 'Reserve Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out 0.2s both;
        }

        /* Custom scrollbar for textarea */
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.7);
        }

        /* Custom date and time input styling */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ReservationForm;