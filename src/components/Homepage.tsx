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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Learn Biotech Skills Without a Physical Lab
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
          Practice DNA Extraction, PCR, and Western Blot in realistic simulations. Make mistakes safely, learn faster, and build confidence before real lab sessions.
        </p>
        <div className="flex flex-col gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
          <button
            onClick={onStartFree}
            className="w-full sm:w-auto px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white text-base font-medium rounded-md transition-colors"
          >
            Start Practicing Free
          </button>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 text-base font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 text-base font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              University Partnership
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 items-start sm:items-center justify-center text-base text-gray-600 mb-3">
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
            <span>Create classes & track progress (verified instructors)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Institution-wide deployment available</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="border-l-4 border-teal-700 bg-gray-50 p-6 sm:p-8 rounded-md">
        <blockquote className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
          "Coming from an Ecology background, I needed to master DNA extraction for a specific research project. BioSimLab allowed me to practice the protocol virtually until it was second nature. When I got to the bench, I was confident and knew exactly what to do."
        </blockquote>
        <p className="text-sm sm:text-base text-gray-600">
          — Dr. J.S., Postdoc, Rice University
        </p>
      </div>
    </section>
  );
}

function ValuePropSection() {
  return (
    <section id="for-universities" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <div className="bg-blue-50 p-6 sm:p-8 rounded-md border border-blue-100">
          <p className="text-sm sm:text-base font-medium text-blue-700 mb-3">For Learners</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
            Biotech training is expensive, limited, and unequal
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Many institutions face limited lab capacity and reagent costs. Learners get fewer hands-on opportunities, confidence stays low, and failed attempts become costly.
          </p>
          <p className="text-base text-gray-900 font-medium">
            Build confidence and reduce trial-and-error before entering physical labs.
          </p>
        </div>

        <div className="bg-pink-50 p-6 sm:p-8 rounded-md border border-pink-100">
          <p className="text-sm sm:text-base font-medium text-pink-700 mb-3">For Universities</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
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
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-base rounded-lg transition-colors font-medium"
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
    <section id="for-instructors" className="bg-blue-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3 sm:mb-4 leading-tight">
          For Instructors: Enhance Your Lab Courses
        </h2>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
          Prepare students, track progress, and reduce equipment costs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center leading-tight">{feature.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed text-center">{feature.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onRequestInstructorAccess}
            className="w-full sm:w-auto px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white text-base font-medium rounded-md transition-colors"
          >
            Request Instructor Access
          </button>
          <p className="text-sm sm:text-base text-gray-500 mt-3 px-4">
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
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-gray-50">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 leading-tight">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white p-6 sm:p-8 rounded-md border border-gray-200">
            <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded mb-4">
              {step.number}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">{step.title}</h3>
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
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12 leading-tight">FAQ</h2>
      <div className="space-y-6 sm:space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight">{faq.question}</h3>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Microscope className="w-6 h-6" />
            <span className="text-xl font-bold">BioSimLab.app</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white text-base font-medium rounded-md transition-colors"
            >
              Start Practicing Today
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-2 border border-gray-600 hover:border-gray-500 text-white text-base font-medium rounded-md transition-colors text-center"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="w-full sm:w-auto px-6 py-2 border border-gray-600 hover:border-gray-500 text-white text-base font-medium rounded-md transition-colors text-center"
            >
              Partner With Us
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-400 mt-6">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="mailto:info@biosimlab.app" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}

