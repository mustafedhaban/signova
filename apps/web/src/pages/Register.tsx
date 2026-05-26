import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      login(data.access_token, data.refresh_token);
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-4 rotate-3 shadow-soft border-2 border-primary/5">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Signova</h1>
          <p className="text-muted-foreground font-medium">Start creating professional team signatures</p>
        </div>

        <Card className="border-2 shadow-soft rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-6 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-2xl font-bold">Create account</CardTitle>
            <CardDescription className="font-medium">Join thousands of teams using Signova</CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="pl-11 bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-12 font-medium transition-all"
                  />
                </div>
              </div>

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
                {isLoading ? (
                  'Creating account...'
                ) : (
                  <span className="flex items-center">
                    Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-border/50 bg-muted/10 py-6">
            <p className="text-sm font-medium text-muted-foreground">
              Already have an account?&nbsp;
              <Link to="/login" className="text-primary hover:underline font-bold decoration-2 underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
          &copy; 2026 Signova Inc. All rights reserved.
        </p>
    </AuthLayout>
  );
};

export default RegisterPage;
