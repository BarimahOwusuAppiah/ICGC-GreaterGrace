import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";
import communityImageDefault from "@/assets/community.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Community = () => {
  const { config } = useSiteConfig();
  const communityImage = config.communityImage ?? communityImageDefault;
  const testimonials = [
    {
      quote:
        "ICGC transformed my perspective on life and faith. The teachings have helped me discover my purpose and lead with excellence.",
      name: "Kwame Asante",
      role: "Business Owner",
    },
    {
      quote:
        "Finding ICGC was a turning point for my family. The community support and genuine love we've experienced here is incredible.",
      name: "Akosua Mensah",
      role: "Healthcare Professional",
    },
    {
      quote:
        "The youth ministry equipped me with leadership skills that have opened doors in my career. Forever grateful for ICGC.",
      name: "Daniel Osei",
      role: "Software Engineer",
    },
  ];

  return (
    <section id="community" className="py-24 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={communityImage}
              alt="ICGC community members gathering together"
              className="rounded-2xl sm:rounded-3xl shadow-elevated w-full"
            />
            {/* Overlay Card */}
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 md:bottom-8 md:right-8 bg-burgundy rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-gold max-w-[200px] sm:max-w-xs">
              <p className="text-gold font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                50,000+
              </p>
              <p className="text-cream text-xs sm:text-sm">Active Members Worldwide</p>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-24 sm:w-32 h-24 sm:h-32 bg-gold/20 rounded-full blur-3xl" />
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <p className="text-gold font-medium tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">
              Our Community
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              A Family Bound by <span className="text-primary">Faith & Love</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              At ICGC, you're not just attending a church — you're joining a
              family. Our vibrant community spans generations and backgrounds,
              united by our commitment to worship, service, and mutual support.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Button variant="burgundy" size="lg" className="w-full sm:w-auto">
                Become a Member
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Find a Local Assembly
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-gold mb-3 sm:mb-4" />
              <p className="text-foreground italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "{testimonials[0].quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">
                  {testimonials[0].name}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {testimonials[0].role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* More Testimonials */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-12 sm:mt-16">
          {testimonials.slice(1).map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover-lift"
            >
              <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-gold mb-2 sm:mb-3" />
              <p className="text-foreground italic mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
