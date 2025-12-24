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
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <img
              src={communityImage}
              alt="ICGC community members gathering together"
              className="rounded-3xl shadow-elevated w-full"
            />
            {/* Overlay Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 bg-burgundy rounded-2xl p-6 shadow-gold max-w-xs">
              <p className="text-gold font-display text-4xl font-bold mb-1">
                50,000+
              </p>
              <p className="text-cream">Active Members Worldwide</p>
            </div>
            {/* Decorative */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
          </div>

          {/* Right - Content */}
          <div>
            <p className="text-gold font-medium tracking-widest uppercase mb-4 text-sm">
              Our Community
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              A Family Bound by <span className="text-primary">Faith & Love</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At ICGC, you're not just attending a church — you're joining a
              family. Our vibrant community spans generations and backgrounds,
              united by our commitment to worship, service, and mutual support.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button variant="burgundy" size="lg">
                Become a Member
              </Button>
              <Button variant="outline" size="lg">
                Find a Local Assembly
              </Button>
            </div>

            {/* Testimonial */}
            <div className="bg-background rounded-2xl p-6 shadow-soft">
              <Quote className="w-8 h-8 text-gold mb-4" />
              <p className="text-foreground italic mb-4 leading-relaxed">
                "{testimonials[0].quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonials[0].name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonials[0].role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* More Testimonials */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {testimonials.slice(1).map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 shadow-soft hover-lift"
            >
              <Quote className="w-6 h-6 text-gold mb-3" />
              <p className="text-foreground italic mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
