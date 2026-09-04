import React from "react";
import { Heart } from "lucide-react";
import EcoMascotQuote from "./EcoMascotQuote";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-6 pb-8 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Feature Presentation at the end: Captain ZeroWaste Quote of the Day */}
        <EcoMascotQuote />

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/40">
          <span>© {new Date().getFullYear()} ZeroWaste Sustainability Platform. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for a Cleaner Planet
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
