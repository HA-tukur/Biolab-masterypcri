import { X, Bell } from "lucide-react";

interface PCRWaitlistModalProps {
  onClose: () => void;
}

export const PCRWaitlistModal = ({ onClose }: PCRWaitlistModalProps) => {
  const waitlistUrl = "https://forms.gle/CdyH4KoC8Lz8Kr8L8";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-800 border border-indigo-500/50 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3 text-indigo-400">
            <Bell size={24} />
            <h3 className="font-mono font-bold uppercase tracking-widest">PCR Coming Soon</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white border-0 bg-transparent cursor-pointer transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6 text-white">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center">
              <Bell size={32} className="text-indigo-400" />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight">
              PCR Missions in Development
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Polymerase Chain Reaction simulations are coming soon. Join the waitlist to be
              notified when PCR missions launch.
            </p>
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl">
            <p className="text-xs text-indigo-300 font-mono">
              You'll learn: thermal cycling, primer design, reaction optimization, and
              contamination control.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-700 space-y-3">
          <a
            href={waitlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-white text-center border-0 cursor-pointer uppercase tracking-widest transition-all"
          >
            Get Notified
          </a>
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-2xl font-bold text-slate-300 border-0 cursor-pointer uppercase tracking-wider transition-all"
          >
            Return to Library
          </button>
        </div>
      </div>
    </div>
  );
};
