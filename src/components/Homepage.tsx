import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Microscope, Play, ChevronRight } from 'lucide-react';

export function Homepage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartFree = () => {
    if (user) {
      navigate('/lab');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {user ? <AuthenticatedView /> : <NonAuthenticatedView onStartFree={handleStartFree} />}
    </div>
  );
}

function NonAuthenticatedView({ onStartFree }: { onStartFree: () => void }) {
  return (
    <>
      <HeroSection onStartFree={onStartFree} />
      <TestimonialSection />
      <ValuePropSection />
      <HowItWorksSection />
      <FAQSection />
      <FooterSection onStartFree={onStartFree} />
    </>
  );
}

function AuthenticatedView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <>
      <DashboardHeader firstName={firstName} onResume={() => navigate('/lab')} />
      <ValuePropSection />
      <HowItWorksSection />
      <FAQSection />
      <FooterSection onStartFree={() => navigate('/lab')} />
    </>
  );
}

function HeroSection({ onStartFree }: { onStartFree: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Learn Biotech Skills Without a Physical Lab
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Practice DNA Extraction, PCR, and Western Blot in realistic simulations. Make mistakes safely, learn faster, and build confidence before real lab sessions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={onStartFree}
            className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
          >
            Start Free
          </button>
          <Link
            to="/instructor/setup"
            className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors"
          >
            Book a University Pilot
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          No credit card required • Works on mobile • PhD-validated
        </p>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="border-l-4 border-teal-700 bg-gray-50 p-8 rounded-md">
        <blockquote className="text-lg text-gray-700 leading-relaxed mb-4">
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
    <section id="for-universities" className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-blue-50 p-8 rounded-md border border-blue-100">
          <p className="text-sm font-medium text-blue-700 mb-3">For Students</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Biotech training is expensive, limited, and unequal
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Many institutions face limited lab capacity and reagent costs. Students get fewer hands-on opportunities, confidence stays low, and failed attempts become costly.
          </p>
          <p className="text-gray-900 font-medium">
            Build confidence and reduce trial-and-error before entering physical labs.
          </p>
        </div>

        <div className="bg-pink-50 p-8 rounded-md border border-pink-100">
          <p className="text-sm font-medium text-pink-700 mb-3">For Universities</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Scale training without expanding infrastructure
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Give students unlimited practice in core biotech techniques with real consequences for mistakes and real-world decision making.
          </p>
          <p className="text-gray-900 font-medium">
            Train more students without proportional expansion in lab space and manpower.
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
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white p-8 rounded-md border border-gray-200">
            <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.body}</p>
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
      answer: 'No. It prepares students before physical lab sessions.',
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
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">FAQ</h2>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterSection({ onStartFree }: { onStartFree: () => void }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Microscope className="w-6 h-6" />
            <span className="text-xl font-bold">BioSimLab.app</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onStartFree}
              className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
            >
              Start Free Today
            </button>
            <Link
              to="/instructor/setup"
              className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-md transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 mb-6">
          Endorsed by AMR Intervarsity Training Program • Developed by PhD scientists
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="mailto:info@biosimlab.app" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function DashboardHeader({ firstName, onResume }: { firstName: string; onResume: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome back, {firstName}
      </h1>

      <div className="bg-teal-50 border border-teal-200 rounded-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700 mb-2">Continue where you left off</p>
            <p className="text-lg font-semibold text-gray-900">DNA Extraction Simulation</p>
          </div>
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-700">Your Progress</p>
          <p className="text-sm text-gray-600">1/5 completed</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-teal-700 h-2 rounded-full" style={{ width: '20%' }}></div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Simulations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SimulationCard
            title="DNA Extraction"
            status="In Progress"
            statusColor="teal"
            onClick={onResume}
          />
          <SimulationCard
            title="PCR"
            status="Not Started"
            statusColor="gray"
          />
          <SimulationCard
            title="Western Blot"
            status="Not Started"
            statusColor="gray"
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            title="DNA Extraction Simulation"
            timestamp="2 hours ago"
          />
          <ActivityItem
            title="PCR Mission Viewed"
            timestamp="Yesterday"
          />
        </div>
      </div>
    </section>
  );
}

function SimulationCard({
  title,
  status,
  statusColor,
  onClick,
}: {
  title: string;
  status: string;
  statusColor: 'teal' | 'gray';
  onClick?: () => void;
}) {
  const statusStyles = {
    teal: 'bg-teal-100 text-teal-800',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-md p-6 ${onClick ? 'cursor-pointer hover:border-teal-700 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusStyles[statusColor]}`}>
          {status}
        </span>
      </div>
      {onClick && (
        <div className="flex items-center text-teal-700 text-sm font-medium">
          Continue <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  );
}

function ActivityItem({ title, timestamp }: { title: string; timestamp: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <p className="text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{timestamp}</p>
    </div>
  );
}
