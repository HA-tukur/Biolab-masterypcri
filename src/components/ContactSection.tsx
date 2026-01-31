import { Mail, Calendar, Lightbulb, GraduationCap } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="bg-slate-900/50 border border-slate-700 rounded-3xl p-8 md:p-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
          Get In Touch
        </h2>
        <p className="text-slate-400 text-lg">
          Have questions? Want to try BioSimLab with your class?
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 text-emerald-400">
            <Mail size={24} />
            <h3 className="font-bold text-lg">General Inquiries</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Questions about BioSimLab? Reach out anytime.
          </p>
          <a
            href="mailto:info@biosimlab.app"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-sm no-underline"
          >
            info@biosimlab.app
          </a>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 text-blue-400">
            <GraduationCap size={24} />
            <h3 className="font-bold text-lg">For Instructors</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Interested in using BioSimLab with your students?
          </p>
          <a
            href="mailto:info@biosimlab.app?subject=Demo Request - University Instructor&body=Hi BioSim Lab team,%0D%0A%0D%0AI'm interested in learning more about BioSimLab for my class.%0D%0A%0D%0AInstitution:%0D%0ACourse:%0D%0ANumber of students:%0D%0A%0D%0AThank you!"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm no-underline"
          >
            Book a demo
          </a>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3 text-amber-400">
            <Lightbulb size={24} />
            <h3 className="font-bold text-lg">Feedback & Ideas</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Share your suggestions to help us improve.
          </p>
          <a
            href="mailto:info@biosimlab.app?subject=BioSimLab Feedback"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-sm no-underline"
          >
            Share your ideas
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
        <a
          href="mailto:info@biosimlab.app"
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold uppercase transition-all no-underline"
        >
          <Mail size={20} />
          Contact Us
        </a>
        <a
          href="mailto:info@biosimlab.app?subject=Demo Request - University Instructor&body=Hi BioSim Lab team,%0D%0A%0D%0AI'm interested in learning more about BioSimLab for my class.%0D%0A%0D%0AInstitution:%0D%0ACourse:%0D%0ANumber of students:%0D%0A%0D%0AThank you!"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold uppercase transition-all no-underline"
        >
          <Calendar size={20} />
          Book Demo
        </a>
      </div>
    </section>
  );
};
