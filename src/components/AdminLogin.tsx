import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToStore }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated secure administration check (using typical admin credentials)
    setTimeout(() => {
      const savedCredentialsStr = localStorage.getItem('luxora_admin_credentials');
      let customEmail = 'admin@luxora.com';
      let customPassword = 'admin123';
      
      if (savedCredentialsStr) {
        try {
          const parsed = JSON.parse(savedCredentialsStr);
          if (parsed.email) customEmail = parsed.email;
          if (parsed.password) customPassword = parsed.password;
        } catch (e) {
          console.error('Error parsing admin credentials:', e);
        }
      }

      const inputEmail = email.trim().toLowerCase();
      if (
        (inputEmail === customEmail.toLowerCase() && password === customPassword) ||
        (inputEmail === 'admin' && password === 'admin')
      ) {
        onLoginSuccess();
      } else {
        setError('Neteisingas el. paštas arba slaptažodis. Bandykite dar kartą.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative Geometric Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Logo and header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono font-black tracking-[0.3em] text-yellow-400 uppercase block mb-3">
            — SAUGI PRIEIGA —
          </span>
          <h1 className="text-4xl font-extrabold uppercase tracking-[0.25em] text-white">
            LUXORA
          </h1>
          <p className="text-neutral-500 font-mono text-[11px] uppercase tracking-wider mt-2">
            ADMINISTRATORIAUS VALDYMO SKYDELIS
          </p>
        </div>

        {/* Card Frame */}
        <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500/20 via-yellow-400 to-yellow-500/20"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-950/40 border border-red-900/60 p-3 flex gap-2 items-start text-xs font-mono text-red-400"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">
                El. paštas / Prisijungimo vardas
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-neutral-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luxora.com"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded-md pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Slaptažodis
                </label>
                <span className="text-[10px] font-mono text-neutral-600 uppercase">
                  numatytasis: admin
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-neutral-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded-md pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-neutral-500 hover:text-neutral-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> PRISIJUNGTI SAUGIAI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back navigation */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToStore}
            className="text-neutral-500 hover:text-yellow-400 font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            ← Grįžti į parduotuvę
          </button>
        </div>
      </motion.div>
    </div>
  );
}
