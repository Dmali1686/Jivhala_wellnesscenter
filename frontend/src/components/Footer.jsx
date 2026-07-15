import { Link } from 'react-router-dom';
import { Camera, Video, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#003300] text-gray-300 py-16 px-6 mt-12 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                 <span className="text-[#004d00] font-bold text-xl">J</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{t('footer.title')}</h2>
            </div>
            <p className="text-sm text-green-100/70 mb-8 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4 text-white">
              <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1">
                <Camera size={20} />
              </a>
              <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1">
                <Video size={20} />
              </a>
              <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/20 transition-all hover:-translate-y-1">
                <Heart size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links Column */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide">{t('footer.quickLinks')}</h3>
            <div className="flex flex-col gap-4 text-sm text-green-100/70">
              <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
              <Link to="/vlogs" className="hover:text-white transition-colors">{t('nav.vlogs')}</Link>
              <Link to="/success-stories" className="hover:text-white transition-colors">{t('nav.successStories')}</Link>
            </div>
          </div>

          {/* Legal & Info Column */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide">{t('footer.legal')}</h3>
            <div className="flex flex-col gap-4 text-sm text-green-100/70">
              <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
              <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
              <Link to="/faq" className="hover:text-white transition-colors">{t('footer.faq')}</Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-white font-bold mb-6 text-lg tracking-wide">{t('footer.contactUs')}</h3>
            <div className="flex flex-col gap-4 text-sm text-green-100/70">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-green-400 mt-0.5 shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-400 shrink-0" />
                <span>hello@jivhala.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider and Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-green-100/50">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <div className="flex items-center gap-2 text-xs text-green-100/30">
            <span>Designed with</span>
            <span className="text-red-500 animate-pulse">❤</span>
            <span>for your wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
