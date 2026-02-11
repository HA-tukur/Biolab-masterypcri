import { Link } from 'react-router-dom';
import { Mail, Microscope } from 'lucide-react';

export function VerificationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Microscope className="w-8 h-8 text-cyan-500" />
            <span className="text-2xl font-bold text-gray-900">BioSim Lab</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-6">
              <Mail className="w-8 h-8 text-cyan-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Check your email to verify your account
            </h1>

            <p className="text-gray-600 mb-6">
              We've sent you a verification link. Please check your email and click the link to verify your account.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong> Check your spam folder or contact support if you need assistance.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-block w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already verified?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
