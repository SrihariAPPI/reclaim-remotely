import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = isSignUp
      ? await signUp(email, password, displayName)
      : await signIn(email, password);
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else if (isSignUp) {
      toast.success('Check your email to confirm your account');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm mx-4 relative z-10"
      >
        <div className="glass-card rounded-3xl p-8 border-border/30">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4 animate-glow-pulse">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold heading-display gradient-text-glow tracking-tight">FindMyDevice</h1>
            <p className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase mt-1">Secure Device Tracker</p>
          </motion.div>

          <h2 className="text-lg font-semibold text-center mb-6 heading-display">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="relative"
              >
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-muted/30 border-border/30 text-sm"
                />
              </motion.div>
            )}
            <div className="relative glow-ring rounded-xl">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted/30 border-border/30 text-sm"
                required
              />
            </div>
            <div className="relative glow-ring rounded-xl">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted/30 border-border/30 text-sm"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold gap-2 text-sm"
              disabled={submitting}
            >
              {submitting ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/30">
            <p className="text-center text-xs text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
