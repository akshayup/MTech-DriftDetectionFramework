import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Shield, Users, Zap, BarChart3, Database, Activity, Cpu, Code, Server, Globe, Layers } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const LoginPage = ({ onLogin }) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Initialize particle system
    initParticleSystem();
    
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Enhanced Enterprise Particle System
  const initParticleSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create enhanced data particles
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 75; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          opacity: Math.random() * 0.7 + 0.3,
          type: Math.floor(Math.random() * 5), // More particle types
          pulse: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          trail: []
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles with trails
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += 0.03;
        particle.rotation += particle.rotationSpeed;

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 5) {
          particle.trail.shift();
        }

        // Wrap around edges with smooth transition
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Draw particle trail
        particle.trail.forEach((point, trailIndex) => {
          ctx.save();
          ctx.globalAlpha = (particle.opacity * (trailIndex / particle.trail.length)) * 0.3;
          ctx.fillStyle = isDark ? '#3b82f6' : '#1e40af';
          const trailSize = particle.size * (trailIndex / particle.trail.length);
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw main particle with enhanced effects
        ctx.save();
        ctx.globalAlpha = particle.opacity * (0.8 + 0.3 * Math.sin(particle.pulse));
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        // Enhanced particle shapes with gradients
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, isDark ? '#60a5fa' : '#2563eb');
        gradient.addColorStop(1, isDark ? '#1e40af' : '#1e3a8a');
        ctx.fillStyle = gradient;
        
        switch (particle.type) {
          case 0: // Enhanced circle with glow
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            // Add glow effect
            ctx.globalAlpha = particle.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1: // Rotating square
            ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            break;
          case 2: // Triangle with rotation
            ctx.beginPath();
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(-particle.size, particle.size);
            ctx.lineTo(particle.size, particle.size);
            ctx.closePath();
            ctx.fill();
            break;
          case 3: // Diamond
            ctx.beginPath();
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(particle.size, 0);
            ctx.lineTo(0, particle.size);
            ctx.lineTo(-particle.size, 0);
            ctx.closePath();
            ctx.fill();
            break;
          case 4: // Star shape
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5;
              const x = Math.cos(angle) * particle.size;
              const y = Math.sin(angle) * particle.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.restore();

        // Enhanced connections with animated flow
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.save();
            const connectionOpacity = (1 - distance / 120) * 0.2;
            ctx.globalAlpha = connectionOpacity;
            
            // Animated gradient line
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y);
            gradient.addColorStop(0, isDark ? '#3b82f6' : '#1e40af');
            gradient.addColorStop(0.5, isDark ? '#8b5cf6' : '#7c3aed');
            gradient.addColorStop(1, isDark ? '#3b82f6' : '#1e40af');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "Real-time monitoring and alerts", delay: "0.2s", color: "blue" },
    { icon: Zap, text: "Instant drift detection", delay: "0.4s", color: "yellow" },
    { icon: Users, text: "Team collaboration tools", delay: "0.6s", color: "green" },
    { icon: Database, text: "Multi-source data integration", delay: "0.8s", color: "purple" }
  ];

  // New floating tech icons
  const techIcons = [
    { icon: Code, delay: 1, duration: 8 },
    { icon: Server, delay: 2, duration: 6 },
    { icon: Globe, delay: 3, duration: 7 },
    { icon: Layers, delay: 4, duration: 9 }
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden relative`}>
      {/* Enhanced Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Left Side - Enhanced Branding */}
      <div className={`hidden lg:flex lg:w-1/2 ${isDark ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600'} flex-col justify-center items-center p-12 relative overflow-hidden`}>
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Multiple floating geometric shapes with different animations */}
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white bg-opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white bg-opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-white bg-opacity-10 animate-bounce" style={{ animationDelay: '2s' }}></div>
          
          {/* New animated shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-20 animate-spin" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '3s' }}></div>
          
          {/* Enhanced Corporate grid pattern with animation */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>

          {/* Enhanced floating data visualization elements */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white bg-opacity-20 rounded-sm"
              style={{
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
                left: `${5 + (i * 8)}%`,
                top: `${15 + Math.sin(i) * 35}%`,
                animation: `float ${2 + i * 0.3}s ease-in-out infinite, spin ${10 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
                transform: `rotate(${i * 30}deg)`
              }}
            />
          ))}

          {/* New floating tech icons */}
          {techIcons.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={i}
                className="absolute opacity-10"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + i * 15}%`,
                  animation: `float ${tech.duration}s ease-in-out infinite, fadeInOut ${tech.duration * 2}s ease-in-out infinite`,
                  animationDelay: `${tech.delay}s`
                }}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
            );
          })}
        </div>

        <div className="text-center text-white relative z-10">
          {/* Enhanced Animated Logo with more complex animation */}
          <div 
            className={`flex justify-center mb-8 transform transition-all duration-1500 ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
            }`}
          >
            <div className="relative">
              <div className="p-4 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-500 hover:scale-110 hover:rotate-3 cursor-pointer">
                <TrendingUp className="h-16 w-16 text-white animate-pulse" />
              </div>
              
              {/* Enhanced orbiting elements with different speeds */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute -bottom-2 left-1/2 w-2.5 h-2.5 bg-purple-400 rounded-full transform -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 -right-2 w-2 h-2 bg-green-400 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -left-2 w-2 h-2 bg-pink-400 rounded-full transform -translate-y-1/2 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              {/* New pulsing rings */}
              <div className="absolute inset-0 animate-ping opacity-20" style={{ animationDuration: '3s' }}>
                <div className="w-full h-full rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Title with typewriter and wave effect */}
          <h1 
            className={`text-4xl font-bold mb-4 transform transition-all duration-1500 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              background: 'linear-gradient(45deg, #ffffff, #e0e7ff, #c7d2fe, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 4s ease-in-out infinite, textWave 2s ease-in-out infinite'
            }}
          >
            Schema Drift Detector
          </h1>

          {/* Enhanced Subtitle with floating animation */}
          <p 
            className={`text-xl mb-8 opacity-90 transform transition-all duration-1500 delay-500 ${
              isVisible ? 'translate-y-0 opacity-90' : 'translate-y-10 opacity-0'
            }`}
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            Monitor your data pipelines with confidence
          </p>
          
          {/* Enhanced Animated Features with staggered hover effects */}
          <div 
            className={`space-y-4 text-left max-w-md transform transition-all duration-1500 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 transform transition-all duration-1000 hover:translate-x-4 hover:scale-110 cursor-pointer group ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${0.9 + index * 0.2}s`,
                    animation: `slideInLeft 1s ease-out ${0.9 + index * 0.2}s both`
                  }}
                >
                  <div className="relative">
                    <div className={`p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm group-hover:bg-opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {/* Enhanced status indicator with animation */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
                    {/* New ripple effect on hover */}
                    <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                  </div>
                  <span className="group-hover:text-blue-200 transition-colors duration-500 group-hover:font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Enhanced Data Visualization with wave animation */}
          <div 
            className={`mt-12 flex justify-center items-end space-x-1 transform transition-all duration-1500 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-40 rounded-full hover:bg-opacity-60 transition-all duration-300 cursor-pointer"
                style={{
                  width: '3px',
                  height: `${12 + Math.sin(Date.now() * 0.001 + i * 0.5) * 25}px`,
                  animation: `pulse ${1.5 + i * 0.1}s ease-in-out infinite, wave ${3 + i * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* Enhanced Floating Enterprise Icons with complex animations */}
          <div className="absolute top-16 right-16 opacity-15">
            <Cpu className="h-10 w-10 animate-spin hover:animate-pulse transition-all duration-300" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute bottom-16 left-16 opacity-15">
            <BarChart3 className="h-8 w-8 animate-bounce hover:animate-spin transition-all duration-300" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute top-1/3 right-8 opacity-10">
            <Database className="h-6 w-6 animate-pulse hover:animate-bounce transition-all duration-300" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Login with more animations */}
      <div className={`flex-1 flex flex-col justify-center items-center p-12 ${isDark ? 'bg-gray-900' : 'bg-white'} relative z-10`}>
        {/* Enhanced Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, ${isDark ? '#3b82f6' : '#1e40af'} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'patternMove 15s linear infinite'
          }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Enhanced Mobile Logo */}
          <div 
            className={`lg:hidden text-center mb-8 transform transition-all duration-1500 ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'} hover:scale-110 transition-all duration-500 hover:rotate-3 cursor-pointer`}>
                  <TrendingUp className={`h-12 w-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
                </div>
                {/* Enhanced pulsing rings */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full border border-blue-400 animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Schema Drift Detector
            </h1>
          </div>

          {/* Enhanced Login Form with more sophisticated animations */}
          <div 
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-8 rounded-xl shadow-2xl border backdrop-blur-sm transform transition-all duration-1500 delay-300 hover:shadow-3xl hover:scale-[1.02] group ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{
              background: isDark 
                ? 'linear-gradient(145deg, #1f2937, #111827)' 
                : 'linear-gradient(145deg, #ffffff, #f8fafc)',
              boxShadow: isDark 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)',
              animation: 'formGlow 4s ease-in-out infinite'
            }}
          >
            {/* Enhanced Status Bar with animated dots */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse hover:animate-bounce cursor-pointer transition-all duration-300"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse hover:animate-bounce cursor-pointer transition-all duration-300" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse hover:animate-bounce cursor-pointer transition-all duration-300" style={{ animationDelay: '1s' }}></div>
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                SECURE CONNECTION
              </div>
            </div>

            {/* Enhanced Header with floating animation */}
            <div className="text-center mb-8">
              <h2 
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 transform transition-all duration-1500 delay-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ animation: 'float 4s ease-in-out infinite' }}
              >
                Enterprise Portal
              </h2>
              <p 
                className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transform transition-all duration-1500 delay-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}
              >
                Secure authentication with Microsoft Azure AD
              </p>
            </div>

            {/* Enhanced Microsoft Sign In Button with complex animations */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-500 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
              style={{ 
                transitionDelay: '0.9s',
                animation: 'buttonGlow 3s ease-in-out infinite'
              }}
            >
              {/* Enhanced button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 transition-all duration-1000 group-hover:translate-x-full"></div>
              
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" 
                    viewBox="0 0 21 21" 
                    fill="currentColor"
                  >
                    <path d="M11.5,0 L21,0 L21,9.5 L11.5,9.5 L11.5,0 Z M0,0 L9.5,0 L9.5,9.5 L0,9.5 L0,0 Z M11.5,11.5 L21,11.5 L21,21 L11.5,21 L11.5,11.5 Z M0,11.5 L9.5,11.5 L9.5,21 L0,21 L0,11.5 Z" />
                  </svg>
                  <span className="group-hover:font-semibold transition-all duration-300">Sign in with Microsoft</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:animate-bounce"></div>
                </>
              )}
            </button>

            {/* Enhanced Additional Info */}
            <div 
              className={`mt-6 text-center transform transition-all duration-1500 delay-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-500 transition-colors duration-500 cursor-pointer`}>
                Enterprise-grade security with multi-factor authentication
              </p>
            </div>
          </div>

          {/* Enhanced Support Info */}
          <div 
            className={`mt-8 text-center transform transition-all duration-1500 delay-1200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500 transition-colors duration-500 cursor-pointer flex items-center justify-center space-x-2 group`}>
              <Shield className="h-4 w-4 group-hover:animate-pulse" />
              <span className="group-hover:font-semibold">Need help? Contact IT Support</span>
            </p>
          </div>

          {/* Enhanced Floating Elements with complex animations */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-500 cursor-pointer" style={{ animation: 'float 3s ease-in-out infinite, spin 20s linear infinite' }}>
            <div className="w-full h-full flex items-center justify-center">
              <Database className="h-8 w-8 text-blue-500 opacity-60 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500 bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-500 cursor-pointer" style={{ animation: 'float 4s ease-in-out infinite 1s, pulse 2s ease-in-out infinite' }}>
            <div className="w-full h-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-500 opacity-60 hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        
        @keyframes slideInLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes textWave {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-2px); }
          75% { transform: translateY(2px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.5); }
        }
        
        @keyframes formGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        }
        
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};