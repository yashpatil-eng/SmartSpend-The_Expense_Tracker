import AIInsights from "../components/landing/AIInsights";
import Calculator from "../components/landing/Calculator";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import LandingNavbar from "../components/landing/Navbar";
import LivePreview from "../components/landing/Preview";
import UseCases from "../components/landing/UseCases";

const LandingPage = () => (
  <div className="bg-slate-50">
    <LandingNavbar />
    <Hero />
    <LivePreview />
    <Features />
    <HowItWorks />
    <AIInsights />
    <Calculator />
    <UseCases />
    <Footer />
  </div>
);

export default LandingPage;
