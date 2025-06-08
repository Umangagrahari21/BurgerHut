import React, { useEffect, useState } from 'react';

const BergerHutAbout = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* About Section */}
      <section className="min-h-screen bg-zinc-900 relative flex items-center py-32">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-yellow-600 to-yellow-300"></div>
        
        <div className="max-w-6xl mx-auto px-5 lg:px-20">
          <div className={`grid lg:grid-cols-2 gap-20 lg:gap-20 items-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="relative">
                <h2 className="font-serif text-5xl lg:text-6xl font-bold text-yellow-600 mb-8">
                  Our Story
                </h2>
                <div className="absolute -bottom-2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-16 h-1 bg-gradient-to-r from-yellow-600 to-yellow-300 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed font-normal">
                     Burger Hut was born from a love for great taste and happy moments.
                     We mix old-style cooking with new ideas to make every burger special. Each one is made with care, using fresh local ingredients, top-quality meat, and our own tasty sauces we’ve worked on for years.                </p>
                <p className="text-lg leading-relaxed font-normal">
                 People love coming to Burger Hut not just for the food, but for the feeling.
                 It’s a place where you can enjoy a delicious meal, feel at home, and create memories with every bite
                </p>
              </div>
              
              <button 
                className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-300 text-zinc-900 font-semibold text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-600/40 shadow-lg shadow-yellow-600/30"
                // onClick={() => handleClick(href ='#menu')}
                //  href="#about"
                // onClick={(e) => handleNavClick(e, 'about')}
              >
                Explore Menu
              </button>
            </div>
            
            {/* Image/Icon */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-yellow-600 to-yellow-300 rounded-3xl flex items-center justify-center text-8xl lg:text-9xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-black/30">
                🍔
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default BergerHutAbout;