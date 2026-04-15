import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Realisations from '../components/Realisations';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import HomeFAQPreview from '../components/HomeFAQPreview';
import ZoneIntervention from '../components/ZoneIntervention';
import HomeContactCTA from '../components/HomeContactCTA';
import SchemaMarkup from '../components/SchemaMarkup';

export default function HomePage() {
  return (
    <>
      <SchemaMarkup />
      <Hero />
      <Stats />
      <Services />
      <Realisations />
      <Testimonials />
      <About />
      <HomeFAQPreview />
      <ZoneIntervention />
      <HomeContactCTA />
    </>
  );
}
