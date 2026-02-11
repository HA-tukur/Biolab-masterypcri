import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Microscope, Play, ChevronRight, User, LogOut, HelpCircle,
  ChevronDown, ArrowRight, Award, Clock, BookOpen, GraduationCap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Footer } from './Footer';

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
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Microscope className="w-6 h-6 text-teal-700" />
              <span className="text-xl font-bold text-gray-900">BioSimLab</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                For Instructors
              </button>
              <button
                onClick={() => scrollToSection('for-universities')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                For Universities
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <HeroSection onStartFree={onStartFree} />
      <TestimonialSection />
      <ValuePropSection />
      <HowItWorksSection />
      <FAQSection />
      <FooterSection onStartFree={onStartFree} />
    </div>
  );
}

function AuthenticatedView() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, instructor_verified')
      .eq('id', user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    }

    const { data: certsData } = await supabase
      .from('certificates')
      .select('id, mission_id, mission_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (certsData) {
      setCertificates(certsData);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const missions = [
    {
      id: 'DNA_EXT_A',
      title: 'DNA Extraction',
      description: 'Learn to isolate high-purity genomic DNA from clinical samples',
      estimatedTime: '30-45 min',
      difficulty: 'Beginner',
      available: true,
    },
    {
      id: 'PCR_lagos-diagnostic',
      title: 'PCR',
      description: 'Master polymerase chain reaction techniques for DNA amplification',
      estimatedTime: '45-60 min',
      difficulty: 'Intermediate',
      available: true,
    },
    {
      id: 'WESTERN_BLOT',
      title: 'Western Blot',
      description: 'Detect and analyze specific proteins using antibody-based techniques',
      estimatedTime: '60-90 min',
      difficulty: 'Advanced',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Microscope className="w-6 h-6 text-teal-700" />
            <span className="text-xl font-bold text-gray-900">BioSimLab</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.open('mailto:info@biosimlab.app', '_blank')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 hidden sm:inline">{firstName}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Settings
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {firstName}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ready to continue your biotech training?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/lab')}
                className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors inline-flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Continue Practicing
              </button>
              <button
                onClick={() => document.getElementById('missions')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors inline-flex items-center justify-center gap-2"
              >
                Browse Missions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Your Progress Panel */}
        <section className="bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-teal-700" />
                  <h3 className="font-semibold text-gray-900">Certificates Earned</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{certificates.length}</p>
                {certificates.length > 0 ? (
                  <div className="space-y-2">
                    {certificates.map(cert => (
                      <div key={cert.id} className="text-sm text-gray-600">
                        {cert.mission_name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Complete your first mission to earn a certificate</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-teal-700" />
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Last practiced: {certificates.length > 0 ? 'Recently' : 'Start your first mission'}
                </p>
                <button
                  onClick={() => navigate('/lab')}
                  className="mt-4 text-sm text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1"
                >
                  Resume last mission
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-teal-700" />
                  <h3 className="font-semibold text-gray-900">Practice Time</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">-</p>
                <p className="text-sm text-gray-600">Total hours in simulations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Missions Grid */}
        <section id="missions" className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Missions</h2>
          <p className="text-gray-600 mb-8">Choose a technique to master</p>

          <div className="grid md:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`bg-white border rounded-lg p-6 ${
                  mission.available
                    ? 'border-gray-200 hover:border-teal-700 hover:shadow-lg transition-all'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{mission.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{mission.difficulty}</span>
                  </div>
                </div>

                {mission.available ? (
                  <button
                    onClick={() => navigate('/lab')}
                    className="w-full px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-md cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Instructor Section */}
        {profile?.instructor_verified && (
          <section className="bg-teal-50 border-y border-teal-100">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-8 h-8 text-teal-700" />
                <h2 className="text-2xl font-bold text-gray-900">For Instructors and Departments</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/instructor/setup')}
                  className="bg-white border border-teal-200 hover:border-teal-300 rounded-lg p-6 text-left transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Create a Class</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Set up a new class and generate a join code for your students
                  </p>
                  <span className="text-sm text-teal-700 font-medium inline-flex items-center gap-1">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>

                <button
                  onClick={() => navigate('/instructor/setup')}
                  className="bg-white border border-teal-200 hover:border-teal-300 rounded-lg p-6 text-left transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Invite Students</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Share class codes and track student enrollment
                  </p>
                  <span className="text-sm text-teal-700 font-medium inline-flex items-center gap-1">
                    Manage students
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>

                <a
                  href="mailto:info@biosimlab.app?subject=Department Pilot Program"
                  className="bg-white border border-teal-200 hover:border-teal-300 rounded-lg p-6 text-left transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">Book a Pilot</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore department-wide training programs and custom integrations
                  </p>
                  <span className="text-sm text-teal-700 font-medium inline-flex items-center gap-1">
                    Contact us
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
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
            Start Practicing Free
          </button>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors inline-flex items-center justify-center"
            >
              University Partnership
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Practice unlimited simulations</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Create classes & track progress (verified instructors)</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Institution-wide deployment available</span>
        </div>
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
          <p className="text-sm font-medium text-blue-700 mb-3">For Learners</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Biotech training is expensive, limited, and unequal
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Many institutions face limited lab capacity and reagent costs. Learners get fewer hands-on opportunities, confidence stays low, and failed attempts become costly.
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
            Give learners unlimited practice in core biotech techniques with real consequences for mistakes and real-world decision making.
          </p>
          <p className="text-gray-900 font-medium">
            Train more learners without proportional expansion in lab space and manpower.
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
              Start Practicing Today
            </button>
            <Link
              to="/login"
              className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-md transition-colors"
            >
              Instructor Portal
            </Link>
            <a
              href="mailto:info@biosimlab.app?subject=University Partnership Inquiry"
              className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-md transition-colors"
            >
              Partner With Us
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 mb-6">
          Developed by PhD scientists
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

