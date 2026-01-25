import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ClassCreatedState {
  classCode: string;
  className: string;
}

export default function InstructorSetup() {
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classCreated, setClassCreated] = useState<ClassCreatedState | null>(null);

  const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const classCode = generateClassCode();

      const { error: insertError } = await supabase
        .from('classes')
        .insert({
          instructor_name: instructorName,
          instructor_email: instructorEmail,
          class_name: className,
          class_code: classCode
        });

      if (insertError) throw insertError;

      setClassCreated({ classCode, className });
    } catch (err) {
      setError('Failed to create class. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (classCreated) {
      navigator.clipboard.writeText(classCreated.classCode);
      alert('Class code copied to clipboard!');
    }
  };

  if (classCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Class Created Successfully!
              </h1>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Your class code:</p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {classCreated.classCode}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-blue-600 text-sm hover:text-blue-700 font-medium"
                >
                  Copy Code
                </button>
              </div>

              <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Share this code with your students</li>
                  <li>Students enter the code before starting their lab</li>
                  <li>View results on your dashboard</li>
                </ol>
              </div>
            </div>

            <a
              href={`/instructor/${classCreated.classCode}`}
              className="block w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </a>

            <button
              onClick={() => {
                setClassCreated(null);
                setInstructorName('');
                setInstructorEmail('');
                setClassName('');
              }}
              className="mt-3 text-sm text-gray-600 hover:text-gray-800"
            >
              Create Another Class
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            BioSim Lab - Instructor Setup
          </h1>
          <p className="text-gray-600">
            Create a class to track your students' progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="instructorName"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <label htmlFor="instructorEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="instructorEmail"
              value={instructorEmail}
              onChange={(e) => setInstructorEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="jsmith@university.edu"
            />
          </div>

          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Molecular Biology 301"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Class...' : 'Generate Class Code'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Lab
          </a>
        </div>
      </div>
    </div>
  );
}