import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, Microscope, User, Building, GraduationCap, X, Lightbulb } from 'lucide-react';

export function SignupForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [universityOther, setUniversityOther] = useState('');
  const [programDepartment, setProgramDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!fullName.trim() || !university.trim() || !programDepartment.trim() || !yearOfStudy.trim() || !referralSource.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (university === 'Other' && !universityOther.trim()) {
      setError('Please specify your university');
      return;
    }

    setLoading(true);

    const finalUniversity = university === 'Other' ? universityOther : university;

    const { error } = await signUp({
      email,
      password,
      fullName,
      university: finalUniversity,
      programDepartment,
      yearOfStudy,
      referralSource,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
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

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

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
                    placeholder="At least 8 characters"
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
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University / Institution <span className="text-red-500">*</span>
                </label>
                <select
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">Select your institution</option>
                  <option value="LAUTECH">LAUTECH</option>
                  <option value="FUNAAB">FUNAAB</option>
                  <option value="Summit University">Summit University</option>
                  <option value="University of Ibadan">University of Ibadan</option>
                  <option value="University of Lagos">University of Lagos</option>
                  <option value="Obafemi Awolowo University">Obafemi Awolowo University</option>
                  <option value="Covenant University">Covenant University</option>
                  <option value="University of Nigeria, Nsukka">University of Nigeria, Nsukka</option>
                  <option value="Ahmadu Bello University">Ahmadu Bello University</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {university === 'Other' && (
                <div>
                  <label htmlFor="universityOther" className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify your institution <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="universityOther"
                      type="text"
                      value={universityOther}
                      onChange={(e) => setUniversityOther(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                      placeholder="Enter your institution name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="programDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                  Program / Department <span className="text-red-500">*</span>
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
                    placeholder="e.g., Biochemistry, Microbiology"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study <span className="text-red-500">*</span>
                </label>
                <select
                  id="yearOfStudy"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">Select your year/level</option>
                  <option value="Undergraduate (Year 1)">Undergraduate (Year 1)</option>
                  <option value="Undergraduate (Year 2)">Undergraduate (Year 2)</option>
                  <option value="Undergraduate (Year 3)">Undergraduate (Year 3)</option>
                  <option value="Undergraduate (Year 4)">Undergraduate (Year 4)</option>
                  <option value="Undergraduate (Year 5)">Undergraduate (Year 5)</option>
                  <option value="Masters Student">Masters Student</option>
                  <option value="PhD Student">PhD Student</option>
                  <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
                  <option value="Faculty/Instructor">Faculty/Instructor</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Industry Professional">Industry Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
                  How did you hear about us? <span className="text-red-500">*</span>
                </label>
                <select
                  id="referralSource"
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">Select a source</option>
                  <option value="Lecturer/Professor Recommendation">Lecturer/Professor Recommendation</option>
                  <option value="Friend/Colleague">Friend/Colleague</option>
                  <option value="Social Media (LinkedIn, Twitter, etc.)">Social Media (LinkedIn, Twitter, etc.)</option>
                  <option value="WhatsApp/Telegram Group">WhatsApp/Telegram Group</option>
                  <option value="Google Search">Google Search</option>
                  <option value="University/Program Announcement">University/Program Announcement</option>
                  <option value="Conference/Workshop">Conference/Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Faculty & Instructors:</strong> Request instructor access after signup to create classes and track student progress. Free for verified instructors.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Just browsing?{' '}
                <Link to="/browse" className="text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center gap-1">
                  Continue as guest →
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
