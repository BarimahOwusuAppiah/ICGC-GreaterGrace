import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Events = () => {
  const { config } = useSiteConfig();
  const events = config.events;

  return (
    <section id="events" className="py-24 bg-gradient-warm relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-16">
          <div>
            <p className="text-gold font-medium tracking-widest uppercase mb-3 sm:mb-4 text-xs sm:text-sm">
              What's Happening
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Upcoming <span className="text-primary">Events</span>
            </h2>
          </div>
          <Button variant="outline" size="lg" className="mt-4 sm:mt-6 md:mt-0 w-full sm:w-auto text-sm sm:text-base">
            View All Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden hover-lift ${
                event.featured
                  ? "bg-burgundy text-cream"
                  : "bg-card border border-border"
              }`}
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex gap-4 sm:gap-6">
                  {/* Date Badge */}
                  <div
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl flex flex-col items-center justify-center ${
                      event.featured
                        ? "bg-gold text-burgundy-dark"
                        : "bg-gold/20 text-gold"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-display font-bold">
                      {event.day}
                    </span>
                    <span className="text-xs sm:text-sm font-medium uppercase">
                      {event.month}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${
                        event.featured ? "text-cream" : "text-foreground"
                      }`}
                    >
                      {event.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${
                        event.featured ? "text-cream/80" : "text-muted-foreground"
                      }`}
                    >
                      {event.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            event.featured ? "text-gold" : "text-gold"
                          }`}
                        />
                        <span
                          className={
                            event.featured ? "text-cream/90" : "text-muted-foreground"
                          }
                        >
                          {event.time}
                        </span>
                      </div>
                      <span
                        className={
                          event.featured ? "text-cream/70" : "text-muted-foreground"
                        }
                      >
                        • {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div
                  className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                    event.featured ? "bg-gold/20" : "bg-gold/10"
                  }`}
                >
                  <ArrowRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${event.featured ? "text-gold" : "text-gold"}`}
                  />
                </div>
              </div>

              {/* Featured Badge */}
              {event.featured && (
                <div className="absolute top-0 right-0 bg-gold text-burgundy-dark text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-bl-lg">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
