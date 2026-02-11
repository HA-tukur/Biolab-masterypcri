import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle, Microscope, User, Building, GraduationCap } from 'lucide-react';

export function SignupForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [programDepartment, setProgramDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!fullName.trim() || !university.trim() || !programDepartment.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email,
      password,
      fullName,
      university,
      programDepartment,
      yearOfStudy,
      referralSource,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Microscope className="w-8 h-8 text-cyan-500" />
            <span className="text-2xl font-bold text-gray-900">BioSim Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start your molecular biology journey</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">Account Created!</h3>
              <p className="text-sm text-green-700">
                Check your email to verify your account. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="university"
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="University of Lagos"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="programDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                  Program/Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="programDepartment"
                    type="text"
                    value={programDepartment}
                    onChange={(e) => setProgramDepartment(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="Biochemistry"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study
                </label>
                <select
                  id="yearOfStudy"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">Select year (optional)</option>
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                  <option value="MSc">MSc</option>
                  <option value="PhD">PhD</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
                  How did you hear about us?
                </label>
                <select
                  id="referralSource"
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">Select source (optional)</option>
                  <option value="WhatsApp Group">WhatsApp Group</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Friend">Friend</option>
                  <option value="Social Media">Social Media</option>
                  <option value="AMR-ITP">AMR-ITP</option>
                  <option value="Noblekinmat">Noblekinmat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
