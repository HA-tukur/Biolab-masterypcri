import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Microscope, Play, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export function Homepage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleStartFree = () => {
    if (user) {
      navigate('/lab');
    } else {
      localStorage.setItem('guestTrial', 'dna-extraction');
      navigate('/lab');
    }
  };

  const handleRequestInstructorAccess = () => {
    navigate('/signup');
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <NonAuthenticatedView onStartFree={handleStartFree} onRequestInstructorAccess={handleRequestInstructorAccess} />
    </div>
  );
}

function NonAuthenticatedView({ onStartFree, onRequestInstructorAccess }: { onStartFree: () => void; onRequestInstructorAccess: () => void }) {
  return (
    <>
      <HeroSection onStartFree={onStartFree} />
      <TestimonialSection />
      <ValuePropSection />
      <ForInstructorsSection onRequestInstructorAccess={onRequestInstructorAccess} />
      <HowItWorksSection />
      <FAQSection />
      <FooterSection onStartFree={onStartFree} />
    </>
  );
}


function HeroSection({ onStartFree }: { onStartFree: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-16 md:pb-24 relative">
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dnaHelix" x="0" y="0" width="100" height="180" patternUnits="userSpaceOnUse">
              <path d="M30,0 Q35,22.5 40,45 Q45,67.5 40,90 Q35,112.5 30,135 Q25,157.5 30,180"
                    stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M70,0 Q65,22.5 60,45 Q55,67.5 60,90 Q65,112.5 70,135 Q75,157.5 70,180"
                    stroke="#e5e7eb" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <line x1="30" y1="15" x2="70" y2="15" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="32" y1="30" x2="68" y2="30" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="35" y1="45" x2="65" y2="45" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="37" y1="60" x2="63" y2="60" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="38" y1="75" x2="62" y2="75" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="37" y1="90" x2="63" y2="90" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="35" y1="105" x2="65" y2="105" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="32" y1="120" x2="68" y2="120" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="30" y1="135" x2="70" y2="135" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="32" y1="150" x2="68" y2="150" stroke="#e5e7eb" strokeWidth="1.2"/>
              <line x1="35" y1="165" x2="65" y2="165" stroke="#e5e7eb" strokeWidth="1.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dnaHelix)"/>
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Master Molecular Biology Techniques Through High-Fidelity Simulations
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
          Practice DNA Extraction, PCR, and Western Blot in realistic simulations. Master the protocols and make mistakes safely before your real lab sessions, saving you from wasting expensive reagents or your one shot at a successful experiment.
          </p>

          <div className="flex flex-col gap-4 mb-6">
            <button
              onClick={onStartFree}
              className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white text-base font-medium rounded-md transition-colors"
            >
              Start Practicing Free
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <Link
              to="/login"
              className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-base font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-base font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              University Partnership
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Practice unlimited simulations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Performance tracking monitors technical precision and safety compliance across practice sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Institution-wide deployment available</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <SimulationPreview />
        </div>
      </div>
    </section>
  );
}

function SimulationPreview() {
  const width = 320;
  const height = 190;
  const padding = 40;

  const minWavelength = 220;
  const maxWavelength = 350;

  const wavelengths: number[] = [];
  for (let i = minWavelength; i <= maxWavelength; i += 0.5) {
    wavelengths.push(i);
  }

  const absorbanceData = wavelengths.map((wl) => {
    const dna = 1.2 * Math.exp(-Math.pow((wl - 260) / 22, 2)) * (1 + 0.002 * (260 - wl));
    const protein = 0.35 * Math.exp(-Math.pow((wl - 280) / 15, 2));
    const salt = 0.25 * Math.exp(-Math.pow((wl - 230) / 18, 2));
    const scattering = 1500000000 / Math.pow(wl, 4);
    const post300Decay = wl > 300 ? Math.exp(-(wl - 300) / 8) : 1;

    return (dna + protein + salt + scattering) * post300Decay;
  });

  const maxAbsorbance = Math.max(...absorbanceData);

  const xScale = (wl: number) =>
    padding + ((wl - minWavelength) / (maxWavelength - minWavelength)) * (width - 2 * padding);

  const yScale = (abs: number) =>
    height - padding - (abs / maxAbsorbance) * (height - 2 * padding);

  const pathData = wavelengths
    .map((wl, i) => {
      const x = xScale(wl);
      const y = yScale(absorbanceData[i]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const fillPath = `${pathData} L ${xScale(maxWavelength)} ${height - padding} L ${xScale(minWavelength)} ${height - padding} Z`;

  const x230 = xScale(230);
  const x260 = xScale(260);
  const x280 = xScale(280);

  const y230 = yScale(absorbanceData[wavelengths.indexOf(230)]);
  const y260 = yScale(absorbanceData[wavelengths.indexOf(260)]);
  const y280 = yScale(absorbanceData[wavelengths.indexOf(280)]);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg shadow-xl p-4 space-y-4 max-w-md ml-6">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800">NanoDrop Spectrophotometer</h3>
        <p className="text-xs text-slate-600">A260/A280 Purity Analysis</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="relative h-44">
          <svg className="w-full h-full" viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
              </linearGradient>
            </defs>

            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="1.5"/>
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="1.5"/>

            <text x={width / 2} y={height - 12} fontSize="12" fill="#1e293b" textAnchor="middle" fontWeight="500">Wavelength (nm)</text>
            <text x="18" y={height / 2} fontSize="12" fill="#1e293b" textAnchor="middle" transform={`rotate(-90 18 ${height / 2})`} fontWeight="500">Absorbance</text>

            <text x={xScale(220)} y={height - padding + 15} fontSize="11" fill="#475569" textAnchor="middle">220</text>
            <text x={x230} y={height - padding + 15} fontSize="11" fill="#475569" textAnchor="middle">230</text>
            <text x={x260} y={height - padding + 15} fontSize="11" fill="#475569" textAnchor="middle">260</text>
            <text x={x280} y={height - padding + 15} fontSize="11" fill="#475569" textAnchor="middle">280</text>
            <text x={xScale(300)} y={height - padding + 15} fontSize="11" fill="#475569" textAnchor="middle">300</text>

            <path d={fillPath} fill="url(#curveGradient)"/>
            <path d={pathData} stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

            <line x1={x230} y1={y230 - 5} x2={x230} y2={height - padding} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
            <circle cx={x230} cy={y230} r="3.5" fill="#ea580c"/>
            <text x={x230} y={y230 - 12} fontSize="11" fill="#111827" textAnchor="middle" fontWeight="bold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke">Salt/Solvent</text>

            <line x1={x260} y1={y260 - 5} x2={x260} y2={height - padding} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7"/>
            <circle cx={x260} cy={y260} r="4" fill="#dc2626"/>
            <text x={x260} y={y260 - 12} fontSize="11" fill="#111827" textAnchor="middle" fontWeight="bold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke">DNA & RNA</text>

            <line x1={x280} y1={y280 - 5} x2={x280} y2={height - padding} stroke="#2563eb" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
            <circle cx={x280} cy={y280} r="3.5" fill="#2563eb"/>
            <text x={x280} y={y280 - 12} fontSize="11" fill="#111827" textAnchor="middle" fontWeight="bold" stroke="#ffffff" strokeWidth="3" paintOrder="stroke">Protein</text>
          </svg>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded p-2">
            <div className="text-[10px] text-slate-500 mb-0.5">A260/A280</div>
            <div className="text-base font-bold text-slate-700">1.82</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-2">
            <div className="text-[10px] text-slate-500 mb-0.5">Concentration</div>
            <div className="text-base font-bold text-slate-700">450 ng/µL</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700">Volume Control Interface</h4>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-[10px] text-slate-600 mb-2">P1000 Micropipette</div>
          <div className="relative h-1.5 bg-slate-300 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-500">
            <span>100 µL</span>
            <span className="font-bold text-teal-700">650 µL</span>
            <span>1000 µL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="border-l-4 border-teal-700 bg-gray-50 p-6 md:p-8 rounded-md">
        <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
          "Coming from an Ecology background, I needed to master DNA extraction for a specific research project. BioSimLab allowed me to practice the protocol virtually until it was second nature. When I got to the bench, I was confident and knew exactly what to do."
        </blockquote>
        <p className="text-sm text-gray-600">
          — Dr. J.S., Postdoc, Rice University
        </p>
      </div>
    </section>
  );
}

function ValuePropSection() {
  return (
    <section id="for-universities" className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="bg-blue-50 p-6 md:p-8 rounded-md border border-blue-100">
          <p className="text-sm font-medium text-blue-700 mb-3">For Learners</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Biotech training is expensive, limited, and unequal
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Many institutions face limited lab capacity and reagent costs. Learners get fewer hands-on opportunities, confidence stays low, and failed attempts become costly.
          </p>
          <p className="text-base text-gray-900 font-medium">
            Build confidence and reduce trial-and-error before entering physical labs.
          </p>
        </div>

        <div className="bg-pink-50 p-6 md:p-8 rounded-md border border-pink-100">
          <p className="text-sm font-medium text-pink-700 mb-3">For Universities</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Scale training without expanding infrastructure
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Give learners unlimited practice in core biotech techniques with real consequences for mistakes and real-world decision making.
          </p>
          <p className="text-base text-gray-900 font-medium mb-6">
            Train more learners without proportional expansion in lab space and manpower.
          </p>
          <Link
            to="/book-demo"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </section>
  );
}

function ForInstructorsSection({ onRequestInstructorAccess }: { onRequestInstructorAccess: () => void }) {
  const features = [
    {
      icon: '🎓',
      title: 'Prepare Students Before Lab',
      body: 'Let students practice protocols virtually before touching expensive equipment and reagents. Reduce waste, improve safety, increase confidence.',
    },
    {
      icon: '📊',
      title: 'Track Student Progress',
      body: 'Create classes, generate shareable codes, and monitor which students have completed assigned simulations. Export analytics for grading.',
    },
    {
      icon: '✓',
      title: 'Free for Verified Instructors',
      body: 'Get access to create up to 2 free classes with 100 students total. No credit card required. Request instructor access in minutes.',
    },
  ];

  return (
    <section id="for-instructors" className="bg-blue-50 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          For Instructors: Enhance Your Lab Courses
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Prepare students, track progress, and reduce equipment costs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed text-center">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onRequestInstructorAccess}
            className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
          >
            Request Instructor Access
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Free for verified instructors. We'll review your request within 24-48 hours.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Run realistic simulations',
      body: 'Load tubes, spin samples, follow protocols, and perform each step interactively.',
    },
    {
      number: '02',
      title: 'Learn from consequences',
      body: 'See contamination, purity loss, and safety hazards when steps are done incorrectly.',
    },
    {
      number: '03',
      title: 'Build operational judgment',
      body: 'Practice reagent selection, procurement planning, and resource prioritization.',
    },
  ];

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white p-6 md:p-8 rounded-md border border-gray-200">
            <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded mb-4">
              {step.number}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: 'Is this a replacement for physical labs?',
      answer: 'No. It prepares learners before physical lab sessions.',
    },
    {
      question: 'Does it work on low bandwidth?',
      answer: 'Yes. BioSimLab is mobile-first and optimized for 3G environments.',
    },
    {
      question: 'Who validates the scientific content?',
      answer: 'Modules are developed and validated by PhD-level scientists.',
    },
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">FAQ</h2>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterSection({ onStartFree }: { onStartFree: () => void }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Microscope className="w-6 h-6" />
            <span className="text-xl font-bold">BioSimLab.app</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={onStartFree}
              className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
            >
              Start Practicing Today
            </button>
            <Link
              to="/login"
              className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-md transition-colors text-center"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-md transition-colors text-center"
            >
              Partner With Us
            </a>
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-400 mt-6">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="mailto:info@biosimlab.app" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}

