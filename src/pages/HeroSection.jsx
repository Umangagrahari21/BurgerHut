import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black to-gray-900" id="home">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-burger absolute text-6xl opacity-10 top-1/5 left-1/12 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
        🍔
      </div>
      <div className="floating-burger absolute text-6xl opacity-10 top-3/5 right-1/12 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
        🍟
      </div>
      <div className="floating-burger absolute text-6xl opacity-10 bottom-1/5 left-1/5 animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}>
        🥤
      </div>

      {/* Hero Content */}
      <div className="hero-content text-center max-w-4xl px-5 relative z-10">
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
          Burger Hut
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-fade-in-up">
          Every Bite Feels Like a Story Made Just for You
        </p>
        <a 
          href="#menu" 
          className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/40 relative overflow-hidden group"
        >
          <span className="relative z-10">Explore Our Menu</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
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
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.5s both;
        }
        
        .floating-burger {
          animation: floatBurger 6s ease-in-out infinite;
        }
        
        @keyframes floatBurger {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;