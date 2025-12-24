import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Unique Home Hero */}
        <Hero />

        {/* Home-only highlight section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <p className="text-gold font-medium tracking-widest uppercase mb-3 text-sm">
                Welcome Home
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                A Place to Begin Your ICGC Journey
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                This homepage gives you a warm introduction to ICGC. Use the
                navigation above to explore detailed pages about our story,
                services, events, community, and how to contact us.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Discover Our Story
                </h3>
                <p className="text-muted-foreground text-sm">
                  Visit the About page to learn more about our history, vision,
                  and leadership.
                </p>
              </div>
              <div className="bg-background rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Join Us in Worship
                </h3>
                <p className="text-muted-foreground text-sm">
                  The Services page has full service times and ministry
                  information.
                </p>
              </div>
              <div className="bg-background rounded-2xl p-6 shadow-soft">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Connect & Reach Out
                </h3>
                <p className="text-muted-foreground text-sm">
                  Looking to visit, partner, or ask a question? Head over to
                  the Contact page.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
