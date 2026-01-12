
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Loader2, CheckCircle2 } from 'lucide-react';

interface SecurityCheckProps {
  onVerify: () => void;
}

const SecurityCheck: React.FC<SecurityCheckProps> = ({ onVerify }) => {
  const [status, setStatus] = useState<'initial' | 'checking' | 'success'>('initial');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'checking') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setStatus('success');
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'success') {
      const timeout = setTimeout(() => {
        onVerify();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [status, onVerify]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 transition-opacity duration-1000">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Cloudflare-style branding */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight uppercase">Security Gateway</h1>
            <p className="text-[10px] text-slate-500 font-mono">Protected by GuardCore v2.4.0</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Lock size={24} className="text-indigo-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Verify you are human</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Checking if the site connection is secure. This process is automatic.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-4 group cursor-pointer hover:border-indigo-500/30 transition-all"
               onClick={() => status === 'initial' && setStatus('checking')}>
            
            {status === 'initial' && (
              <div className="flex items-center gap-4 w-full">
                <div className="w-6 h-6 border-2 border-slate-700 rounded-md group-hover:border-indigo-500 transition-colors" />
                <span className="text-slate-300 font-medium">Verify you are human</span>
              </div>
            )}

            {status === 'checking' && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-indigo-500" />
                  <span className="text-slate-300 font-medium">Checking browser environment...</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-4 w-full animate-in zoom-in-95 duration-300">
                <CheckCircle2 size={28} className="text-green-500" />
                <span className="text-green-400 font-semibold text-lg">Verification successful</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center opacity-40">
            <span className="text-[10px] text-slate-500 font-mono">Ray ID: {Math.random().toString(36).substring(2, 12).toUpperCase()}</span>
            <span className="text-[10px] text-slate-500 font-mono">Performance & Security by GuardCore</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
      </div>

      <p className="mt-8 text-xs text-slate-600 max-w-xs text-center leading-relaxed">
        Ruiping Wang's portfolio is protected to ensure the safety and integrity of project data and professional documents.
      </p>
    </div>
  );
};

export default SecurityCheck;
