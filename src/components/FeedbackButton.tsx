import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

export const FeedbackButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleEmailFeedback = () => {
    window.location.href = "mailto:info@biosimlab.app?subject=BioSimLab Feedback&body=Hi BioSim Lab team,%0D%0A%0D%0AI'd like to share some feedback:%0D%0A%0D%0A";
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg border-0 cursor-pointer transition-all font-bold"
      >
        <Lightbulb size={20} />
        <span>Feedback</span>
      </button>

      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-800 border border-emerald-500/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-black uppercase text-emerald-400 flex items-center gap-2">
                <Lightbulb size={24} />
                Share Your Feedback
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white border-0 bg-transparent cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-slate-300">
                  We'd love to hear from you! Your feedback helps us improve BioSimLab for everyone.
                </p>

                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-white">What would you like to share?</h4>

                  <div className="space-y-3">
                    <button
                      onClick={handleEmailFeedback}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold border-0 cursor-pointer transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Lightbulb size={20} />
                        <div>
                          <div className="font-bold">Send Feedback via Email</div>
                          <div className="text-xs text-emerald-200">Opens your email client</div>
                        </div>
                      </div>
                    </button>

                    <a
                      href="https://biosimlab.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-bold border-0 cursor-pointer transition-all no-underline"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🌐</div>
                        <div>
                          <div className="font-bold">Visit Our Website</div>
                          <div className="text-xs text-slate-300">More ways to connect</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-xs text-blue-200">
                    You can also reach us at <a href="mailto:info@biosimlab.app" className="text-blue-400 hover:text-blue-300 underline">info@biosimlab.app</a> anytime!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
