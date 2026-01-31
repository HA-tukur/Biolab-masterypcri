import { Mail, Globe, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-black uppercase text-white tracking-tight">
            Contact Us
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-300">
            <a
              href="mailto:info@biosimlab.app"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors no-underline"
            >
              <Mail size={20} />
              <span>info@biosimlab.app</span>
            </a>

            <a
              href="https://biosimlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors no-underline"
            >
              <Globe size={20} />
              <span>biosimlab.app</span>
            </a>

            <a
              href="https://www.linkedin.com/company/biosim-lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors no-underline"
            >
              <Linkedin size={20} />
              <span>BioSim Lab</span>
            </a>
          </div>

          <div className="pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              Questions? Feedback? Ideas?
            </p>
            <p className="text-emerald-400 font-bold mt-2">
              We'd love to hear from you!
            </p>
          </div>

          <div className="text-xs text-slate-500 pt-4">
            © {new Date().getFullYear()} BioSim Lab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
