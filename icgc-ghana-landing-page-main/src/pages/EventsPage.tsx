import Header from "@/components/Header";
import Events from "@/components/Events";
import Footer from "@/components/Footer";

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <Events />
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;


