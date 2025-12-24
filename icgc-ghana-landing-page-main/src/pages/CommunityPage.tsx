import Header from "@/components/Header";
import Community from "@/components/Community";
import Footer from "@/components/Footer";

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;


