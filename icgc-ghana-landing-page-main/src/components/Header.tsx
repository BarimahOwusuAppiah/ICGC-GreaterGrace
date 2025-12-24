import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";

// Logo component that tries multiple formats
const LogoImage = () => {
  // Try webp first (already exists), then png, then svg
  const [logoSrc, setLogoSrc] = useState("/icgc-logo.webp");
  const [showFallback, setShowFallback] = useState(false);

  const handleError = () => {
    if (logoSrc.includes('.webp')) {
      setLogoSrc('/icgc-logo.png');
    } else if (logoSrc.includes('.png')) {
      setLogoSrc('/icgc-logo.svg');
    } else {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
        <span className="font-display font-bold text-forest-dark text-lg">ICGC</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="ICGC Logo - International Central Gospel Church"
      className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      style={{ maxHeight: '56px' }}
      onError={handleError}
    />
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Events", to: "/events" },
    { label: "Gallery", to: "/gallery" },
    { label: "Community", to: "/community" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex items-center relative">
            <LogoImage />
          </div>
          <div className="hidden sm:block">
            <h1
              className={`font-display font-semibold text-lg transition-colors ${
                isScrolled ? "text-foreground" : "text-cream"
              }`}
            >
              ICGC
            </h1>
            <p
              className={`text-xs transition-colors ${
                isScrolled ? "text-muted-foreground" : "text-cream/80"
              }`}
            >
              International Central Gospel Church
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={`font-medium transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full ${
                isScrolled ? "text-foreground" : "text-cream"
              }`}
              activeClassName="text-gold after:w-full"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="hero" size="lg">
            Join Us Sunday
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`}
            />
          ) : (
            <Menu
              className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-cream"}`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background shadow-elevated transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="font-medium text-foreground hover:text-gold transition-colors py-2"
              activeClassName="text-gold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Button variant="hero" size="lg" className="mt-4">
            Join Us Sunday
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
