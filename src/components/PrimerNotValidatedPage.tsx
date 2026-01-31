import { AlertCircle, Star, RotateCcw, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PrimerNotValidatedPageProps {
  onTryAgain: () => void;
  onBackToLibrary: () => void;
  errors: string[];
}

export const PrimerNotValidatedPage = ({ onTryAgain, onBackToLibrary, errors }: PrimerNotValidatedPageProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      <div className="flex justify-center">
        <AlertCircle size={80} className="text-amber-400" />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black uppercase text-white">
          Primers Not Validated
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Your primers do not meet one or more standard design criteria (for example, length or GC content).
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          This is a normal part of primer design — most primers require a few iterations.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          Please adjust your sequences and try again.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-xl text-left">
          <p className="text-sm text-amber-300 font-bold mb-3">Validation Issues:</p>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-amber-200 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Rate This Experience
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all hover:scale-110 bg-transparent border-0 cursor-pointer p-1"
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  size={32}
                  className={`${
                    value <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-emerald-400 animate-pulse">
              Thank you for your rating!
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-700 space-y-3">
          <p className="text-sm text-amber-400 font-bold">
            How was your experience? Share feedback
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Join the PCR waitlist — we'll notify you when the full PCR module launches.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Thank you for being part of BioSim Lab's mission to close the biotech skills gap.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://forms.gle/m5ua7v3mGZGLMSf66"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all no-underline"
            >
              <span>Submit Feedback</span>
              <ExternalLink size={16} />
            </a>
            <a
              href="mailto:info@biosimlab.app?subject=PCR Mission Feedback&body=I just attempted the PCR primer design mission.%0D%0A%0D%0AMy feedback:"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all no-underline"
            >
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <button
          onClick={onTryAgain}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
        >
          <RotateCcw size={20} />
          Try Again
        </button>
        <button
          onClick={onBackToLibrary}
          className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
        >
          <BookOpen size={20} />
          Technique Library
        </button>
      </div>
    </div>
  );
};
