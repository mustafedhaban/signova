import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      // Show the token directly (in production this would be emailed)
      setResetToken(data.resetToken || '');
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (resetToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-3xl mb-4 rotate-3 shadow-soft border-2 border-green-200">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-primary">Check your email</h1>
            <p className="text-muted-foreground font-medium">We've sent a reset link to your inbox</p>
          </div>

          <Card className="border-2 shadow-soft rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/20 pb-6 border-b border-border/50">
              <CardTitle className="text-xl font-bold">Development Mode</CardTitle>
              <CardDescription className="font-medium">
                In production, this token would be emailed to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="p-4 bg-muted/40 rounded-2xl border-2 border-dashed border-border/50 break-all text-xs font-mono text-muted-foreground leading-relaxed">
                {resetToken}
              </div>
              <Link to={`/reset-password?token=${resetToken}`}>
                <Button className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95">
                  Continue to Reset <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="justify-center border-t border-border/50 bg-muted/10 py-6">
              <Link to="/login" className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4">
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4 rotate-3 shadow-soft border-2 border-primary/5">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-primary">Reset Password</h1>
          <p className="text-muted-foreground font-medium">Don't worry, it happens to the best of us</p>
        </div>

        <Card className="border-2 shadow-soft rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-6 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
            <CardDescription className="font-medium">Enter your email and we'll send you a link</CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="pl-11 bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-12 font-medium transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border-2 border-destructive/20 rounded-xl text-xs font-bold text-destructive animate-in shake-1 duration-300">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/50 bg-muted/10 py-6">
            <Link to="/login" className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4">
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
