import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Contact = () => {
  const { toast } = useToast();
  const { addContactSubmission } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the contact submission
    addContactSubmission({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message,
    });
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon. God bless you!",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Greater Grace", "Bubiashie-Control, Accra", "Ghana"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+233 024 308 9037", "+233 055 358 6495"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["icgcgreatergrace@gmail.com", "support@icgc.org"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday", "8:00 AM - 5:00 PM"],
    },
  ];

  return (
    <section id="contact" className="py-24 bg-burgundy-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-burgundy to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-gold font-medium tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">
            Get In Touch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-4 sm:mb-6 px-2">
            We'd Love to <span className="text-gradient-gold">Hear From You</span>
          </h2>
          <p className="text-cream/80 text-base sm:text-lg leading-relaxed px-2">
            Have questions about our services, ministries, or how to get
            involved? Reach out to us and we'll be happy to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-burgundy rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-elevated">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-cream mb-4 sm:mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-cream/80 text-xs sm:text-sm mb-1 sm:mb-2 block">
                    Full Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-burgundy-dark/50 border-gold/20 text-cream placeholder:text-cream/50 focus:border-gold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-cream/80 text-xs sm:text-sm mb-1 sm:mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-burgundy-dark/50 border-gold/20 text-cream placeholder:text-cream/50 focus:border-gold text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-cream/80 text-xs sm:text-sm mb-1 sm:mb-2 block">
                  Phone Number
                </label>
                <Input
                  placeholder="+233 xxx xxx xxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-burgundy-dark/50 border-gold/20 text-cream placeholder:text-cream/50 focus:border-gold text-sm"
                />
              </div>
              <div>
                <label className="text-cream/80 text-xs sm:text-sm mb-1 sm:mb-2 block">
                  Your Message
                </label>
                <Textarea
                  placeholder="How can we help you?"
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-burgundy-dark/50 border-gold/20 text-cream placeholder:text-cream/50 focus:border-gold resize-none text-sm"
                  required
                />
              </div>
              <Button variant="hero" size="lg" type="submit" className="w-full text-sm sm:text-base">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-burgundy/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gold/10 hover-lift"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-3 sm:mb-4">
                  <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <h4 className="text-cream font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                  {info.title}
                </h4>
                {info.details.map((detail, dIndex) => (
                  <p key={dIndex} className="text-cream/70 text-xs sm:text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
