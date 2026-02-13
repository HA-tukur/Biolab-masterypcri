import { CheckCircle2, Star, RotateCcw, BookOpen } from "lucide-react";
import { useState } from "react";

interface PrimerValidatedPageProps {
  onTryAgain: () => void;
  onBackToLibrary: () => void;
}

export const PrimerValidatedPage = ({ onTryAgain, onBackToLibrary }: PrimerValidatedPageProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      <div className="flex justify-center">
        <CheckCircle2 size={80} className="text-emerald-400" />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black uppercase text-white">
          Primers Successfully Validated
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          Great work. Your forward and reverse primers meet standard design criteria and are suitable for PCR amplification.
        </p>
        <p className="text-slate-300 text-lg leading-relaxed">
          You've completed one of the most important steps in any molecular biology workflow.
        </p>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl">
        <p className="text-sm text-blue-300 font-bold mb-2">Full PCR Workflow Coming Soon</p>
        <p className="text-sm text-blue-200 leading-relaxed">
          The full PCR workflow (reaction setup, thermal cycling, and gel analysis) is coming soon. You'll be notified when it launches.
        </p>
      </div>

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
          <p className="text-sm text-slate-400 leading-relaxed">
            Thank you for being part of BioSim Lab's mission to close the biotech skills gap.
          </p>
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
