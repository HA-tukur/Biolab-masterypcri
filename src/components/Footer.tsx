import { Mail, Globe, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <h3 className="text-lg font-bold text-gray-900">
            Contact Us
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-700">
            <a
              href="mailto:info@biosimlab.app"
              className="flex items-center gap-2 hover:text-primary-500"
            >
              <Mail size={20} />
              <span>info@biosimlab.app</span>
            </a>

            <a
              href="https://biosimlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-500"
            >
              <Globe size={20} />
              <span>biosimlab.app</span>
            </a>

            <a
              href="https://www.linkedin.com/company/biosim-lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-500"
            >
              <Linkedin size={20} />
              <span>BioSim Lab</span>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-700 text-sm">
              Questions? Feedback? Ideas?
            </p>
            <p className="text-primary-500 font-semibold mt-2">
              We'd love to hear from you!
            </p>
          </div>

          <div className="text-xs text-gray-500 pt-4">
            © {new Date().getFullYear()} BioSim Lab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
