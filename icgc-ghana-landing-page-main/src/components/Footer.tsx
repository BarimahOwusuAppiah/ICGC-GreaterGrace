import { useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

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
      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
        <span className="font-display font-bold text-burgundy-dark text-lg">ICGC</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="ICGC Logo - International Central Gospel Church"
      className="h-12 md:h-14 w-auto object-contain"
      style={{ maxHeight: '56px' }}
      onError={handleError}
    />
  );
};

const Footer = () => {
  const socials = [
    { icon: Facebook, href: "https://web.facebook.com/share/g/17K36hkCPU/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/icgcgreatergracetemple?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-cream">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <LogoImage />
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg">ICGC</h3>
                <p className="text-cream/60 text-[10px] sm:text-xs">
                  ICGC Greater Grace Temple
                </p>
              </div>
            </div>
            <p className="text-cream/70 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Transforming lives through faith, empowering believers to discover
              their purpose, and building a community of excellence.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-burgundy-dark transition-all duration-300"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Stay Connected
            </h4>
            <p className="text-cream/70 text-xs sm:text-sm mb-3 sm:mb-4">
              Subscribe to our newsletter for updates, devotionals, and event
              announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 text-xs sm:text-sm focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-burgundy-dark rounded-lg font-medium text-xs sm:text-sm hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-cream/60 text-center md:text-left">
            <p>© 2025 ICGC Greater Grace Temple. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
