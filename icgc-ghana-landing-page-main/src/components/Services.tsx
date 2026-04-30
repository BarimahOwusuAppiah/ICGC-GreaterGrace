import { Clock, MapPin, Users, Heart, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const serviceSchedule = [
    {
      day: "Sunday",
      services: [
        { time: "8:00 AM", name: "First Service", type: "Main Worship" },
       
      ],
    },
    {
      day: "Wednesday",
      services: [
        { time: "6:00 PM", name: "Midweek Service", type: "Bible Study" },
      ],
    },
    {
      day: "Friday",
      services: [
        { time: "6:30 PM", name: "Prayer Night", type: "Intercession" },
      ],
    },
  ];

  const ministries = [
    {
      icon: Users,
      name: "Youth Ministry (new breed)",
      description: "Empowering the next generation with purpose and faith",
    },
    {
      icon: Heart,
      name: "Women's Fellowship(PVV)",
      description: "Building strong women through prayer and community",
    },
    {
      icon: BookOpen,
      name: "Men's Ministry",
      description: "Raising godly men to lead their families and communities",
    },
    {
      icon: Music,
      name: "Worship & Arts",
      description: "Excellence in worship through music and creative arts",
    },
  ];

  return (
    <section id="services" className="py-24 bg-burgundy-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--gold)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold font-medium tracking-widest uppercase mb-4 text-sm">
            Join Us In Worship
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-6">
            Service Times & <span className="text-gradient-gold">Ministries</span>
          </h2>
          <p className="text-cream/80 text-lg leading-relaxed">
            Experience transformative worship, powerful preaching, and genuine
            fellowship at every service. There's a place for everyone at ICGC.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Service Schedule */}
          <div className="bg-burgundy rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-elevated">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-cream">
                Service Schedule
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {serviceSchedule.map((schedule, index) => (
                <div key={index} className="border-b border-gold/20 pb-4 sm:pb-6 last:border-0 last:pb-0">
                  <h4 className="text-gold font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                    {schedule.day}
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {schedule.services.map((service, sIndex) => (
                      <div
                        key={sIndex}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-burgundy-dark/50 rounded-lg sm:rounded-xl p-3 sm:p-4 gap-2 sm:gap-0"
                      >
                        <div>
                          <p className="text-cream font-medium text-sm sm:text-base">{service.name}</p>
                          <p className="text-cream/60 text-xs sm:text-sm">{service.type}</p>
                        </div>
                        <span className="text-gold font-semibold text-base sm:text-lg">
                          {service.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gold/10 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-cream font-medium text-sm sm:text-base">Greater Grace</p>
                <p className="text-cream/70 text-xs sm:text-sm">
                  Bubiashie-Control, Accra, Ghana
                </p>
              </div>
            </div>
          </div>

          {/* Ministries */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-cream mb-6 sm:mb-8">
              Our Ministries
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {ministries.map((ministry, index) => (
                <div
                  key={index}
                  className="bg-burgundy/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift hover-glow border border-gold/10 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold/30 transition-colors">
                    <ministry.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
                  </div>
                  <h4 className="text-cream font-semibold text-base sm:text-lg mb-2">
                    {ministry.name}
                  </h4>
                  <p className="text-cream/70 text-xs sm:text-sm leading-relaxed">
                    {ministry.description}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="mt-6 sm:mt-8 w-full sm:w-auto text-sm sm:text-base">
              All are humbly invited into all ministries
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
