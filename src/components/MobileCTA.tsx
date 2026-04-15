import { Phone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useSiteData';
import { useState, useEffect } from 'react';

export default function MobileCTA() {
  const data = useSiteData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-navy/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex gap-3">
        <a href={data.company.phone} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm"><Phone className="w-4 h-4 text-amber" />Appeler</a>
        <Link to="/contact" className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber to-amber-light text-navy font-bold rounded-xl text-sm"><FileText className="w-4 h-4" />Devis gratuit</Link>
      </div>
    </div>
  );
}
