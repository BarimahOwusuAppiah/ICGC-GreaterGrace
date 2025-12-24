import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import pastorImageDefault from "@/assets/pastor-otabil.jpg";
import churchImageDefault from "@/assets/church-building.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";

const About = () => {
  const { config } = useSiteConfig();
  const churchImage = config.aboutMainImage ?? churchImageDefault;
  const pastorImage = config.aboutPastorImage ?? pastorImageDefault;
  const stats = [
    { number: "40+", label: "Years of Ministry" },
    { number: "500+", label: "Local Assemblies" },
    { number: "30+", label: "Countries Reached" },
    { number: "1M+", label: "Lives Transformed" },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-warm relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold font-medium tracking-widest uppercase mb-4 text-sm">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Transforming Lives Through{" "}
            <span className="text-primary">Faith & Purpose</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Founded by Dr. Mensa Otabil, ICGC has grown from a small gathering
            in Accra to a global movement impacting millions with the message of
            hope, empowerment, and spiritual transformation.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Images */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={churchImage}
                alt="ICGC Greater Grace Church Building"
                className="rounded-2xl shadow-elevated w-full"
              />
            </div>
            {/* Pastor Image Overlay */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 w-48 md:w-64 z-20">
              <img
                src={pastorImage}
                alt="Greater Grace DR.Rev Philip Adjei Acquah - Founder of ICGC"
                className="rounded-xl shadow-gold border-4 border-background"
              />
              <div className="absolute -bottom-4 left-4 right-4 bg-burgundy text-cream rounded-lg p-3 text-center shadow-soft">
                <p className="font-display font-semibold text-sm">Greater Grace Overseer Dr.Rev Philip Adjei Acquah</p>
                <p className="text-xs text-cream/80">Founder & General Overseer</p>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
          </div>

          {/* Right - Content */}
          <div>
            <h3 className="font-display text-3xl font-bold text-foreground mb-6">
              A Legacy of Faith, Excellence & Empowerment
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                The International Central Gospel Church was established in 19555
                with a vision to raise leaders who would transform society
                through biblical principles and practical wisdom.
              </p>
              <p>
                Under the leadership of Dr. Mensa Otabil, ICGC has become known
                for its emphasis on mental liberation, educational excellence,
                and holistic development. Our flagship campus, Christ Temple,
                stands as a beacon of hope in Accra, hosting thousands every
                Sunday.
              </p>
              <p>
                Today, ICGC continues to impact communities through education,
                healthcare, and spiritual nurturing, with assemblies across
                Ghana, Europe, North America, and Africa.
              </p>
            </div>
            <Button variant="burgundy" size="lg">
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-2xl shadow-soft hover-lift"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
                {stat.number}
              </p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
