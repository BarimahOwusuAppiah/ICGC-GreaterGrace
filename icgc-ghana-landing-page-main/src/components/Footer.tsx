import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <LogoImage />
              <div>
                <h3 className="font-display font-semibold text-lg">ICGC</h3>
                <p className="text-cream/60 text-xs">
                  International Central Gospel Church
                </p>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Transforming lives through faith, empowering believers to discover
              their purpose, and building a community of excellence.
            </p>
            <div className="flex gap-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-burgundy-dark transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">
              Stay Connected
            </h4>
            <p className="text-cream/70 text-sm mb-4">
              Subscribe to our newsletter for updates, devotionals, and event
              announcements.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 text-sm focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-burgundy-dark rounded-lg font-medium text-sm hover:bg-gold-light transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-cream/60">
            <p>© 2024 International Central Gospel Church. All rights reserved.</p>
            <div className="flex gap-6">
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
