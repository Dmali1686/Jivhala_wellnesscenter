import { Link } from 'react-router-dom';
import { Camera, User } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f0f4f1] py-12 px-6 mt-12 rounded-t-3xl">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">Jivhala Wellness</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Radical Calm defined. Your partner in holistic life and childcare.
        </p>
        
        <div className="flex gap-4 mb-8 text-[var(--color-primary)]">
          <button className="p-2 border border-[#c2e5c6] rounded-full hover:bg-[#c2e5c6] transition-colors">
            <Camera size={18} />
          </button>
          <button className="p-2 border border-[#c2e5c6] rounded-full hover:bg-[#c2e5c6] transition-colors">
            <User size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-[var(--color-text-muted)] mb-12">
          <Link to="/contact" className="hover:text-[var(--color-primary)]">Contact Us</Link>
          <Link to="/privacy" className="hover:text-[var(--color-primary)]">Privacy Policy</Link>
          <Link to="/faq" className="hover:text-[var(--color-primary)]">FAQ</Link>
          <Link to="/terms" className="hover:text-[var(--color-primary)]">Terms of Service</Link>
        </div>
        
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Jivhala Wellness. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
