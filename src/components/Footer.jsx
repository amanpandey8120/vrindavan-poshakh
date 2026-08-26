import React from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function Footer() {
  const { navigateTo } = useNavigation();

  return (
    // Matches Stitch: bg-primary-container (#002b36), text-on-primary-container (#6f93a0)
    <footer className="w-full mt-20 px-4 py-10 md:px-16 md:py-16 flex flex-col gap-8 bg-[#002b36] text-[#6f93a0] border-t border-[#71787b]/20 relative overflow-hidden">

      {/* Subtle Watermark — matches Stitch */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <span className="material-symbols-outlined text-[400px] text-[#fed65b]">spa</span>
      </div>

      {/* Main grid — matches Stitch col-span-12 grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">

        {/* Brand column — col-span-4 */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <h3 className="text-xl md:text-2xl font-serif uppercase tracking-widest text-white">
            Vrindavan Poshakh
          </h3>
          <p className="text-sm text-[#6f93a0] max-w-sm leading-relaxed">
            Bringing the divine elegance of Vrindavan to your home. Premium Poshakh and Shringar for your beloved Krishna.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="#share"
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 rounded-full bg-[#406370]/20 flex items-center justify-center text-[#6f93a0] hover:bg-[#fed65b] hover:text-[#745c00] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </a>
          </div>
        </div>

        {/* Links columns — col-span-8 — matches Stitch 3-column grid */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">

          {/* Shop column — matches Stitch: Poshakh, Jewellery, Accessories */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-[#fed65b] tracking-widest uppercase">Shop</h4>
            <button onClick={() => navigateTo(SCREENS.KRISHNA_COLLECTION)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Poshakh</button>
            <button onClick={() => navigateTo(SCREENS.JEWELLERY)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Jewellery</button>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Accessories</button>
          </div>

          {/* Support column — matches Stitch: Privacy Policy, Terms of Service, Shipping & Returns, Admin Portal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-[#fed65b] tracking-widest uppercase">Support</h4>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Terms of Service</button>
            <button onClick={() => navigateTo(SCREENS.SHOP)} className="text-left text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors">Shipping &amp; Returns</button>
            <button onClick={() => navigateTo(SCREENS.ADMIN_LOGIN)} className="text-left text-sm text-[#fed65b] hover:underline transition-colors flex items-center gap-1.5 pt-2 border-t border-[#6f93a0]/20">
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Contact column — matches Stitch */}
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold text-[#fed65b] tracking-widest uppercase">Contact Us</h4>
            <a
              href="mailto:avnimisra7602@gmail.com"
              className="text-sm text-[#6f93a0] hover:text-[#fed65b] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              avnimisra7602@gmail.com
            </a>
            <p className="text-xs text-[#6f93a0]/80 leading-relaxed flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">location_on</span>
              <span>H3PQ+7W6, Gali Number 1, P Block, Sadh Nagar II, Palam, New Delhi, Delhi, 110045</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar — matches Stitch */}
      <div className="relative z-10 pt-8 border-t border-[#6f93a0]/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#6f93a0]/70 tracking-wider text-center md:text-left">
          © 2026 Vrindavan Poshakh. Divine Elegance Redefined.
        </p>
      </div>
    </footer>
  );
}
