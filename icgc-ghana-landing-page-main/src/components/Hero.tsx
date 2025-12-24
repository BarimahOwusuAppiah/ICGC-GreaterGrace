import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";
import heroImageDefault from "@/assets/hero-worship.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Hero = () => {
  const { config } = useSiteConfig();
  const heroImage = config.heroImage ?? heroImageDefault;
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="ICGC worship service with congregation praising"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-burgundy-dark/30" />
      </div>

      {/* Animated particles/glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-pulse-glow delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="animate-fade-up text-gold font-medium tracking-widest uppercase mb-6 text-sm md:text-base">
            Welcome to ICGC Ghana
          </p>

          {/* Main Heading */}
          <h1 className="animate-fade-up delay-100 font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6">
            Experience the{" "}
            <span className="text-gradient-gold">Presence of God</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of believers at the International Central Gospel
            Church. Discover your purpose, grow in faith, and become part of a
            loving community transforming lives across Ghana and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Plan Your Visit
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="w-5 h-5 mr-2" />
              Watch Live
            </Button>
          </div>

          {/* Service Times Preview */}
          <div className="animate-fade-up delay-400 mt-16 inline-flex items-center gap-6 bg-burgundy-dark/50 backdrop-blur-sm rounded-full px-8 py-4 border border-gold/20">
            <div className="text-center">
              <p className="text-gold text-sm font-medium">Sunday Service</p>
              <p className="text-cream font-semibold">8:00 AM & 10:30 AM</p>
            </div>
            <div className="w-px h-10 bg-gold/30" />
            <div className="text-center">
              <p className="text-gold text-sm font-medium">Wednesday Bible Study</p>
              <p className="text-cream font-semibold">6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/70 hover:text-gold transition-colors animate-float"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
};

export default Hero;
