import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!token) setError('Missing or invalid reset token.');
  }, [token]);

  const handleReset = async () => {
    if (!token) return;
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Invalid or expired token.');
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
          <h1 className="text-3xl font-black tracking-tight text-primary">Finalize Reset</h1>
          <p className="text-muted-foreground font-medium">You're one click away from your account</p>
        </div>

        <Card className="border-2 shadow-soft rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-6 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-2xl font-bold">Reset your session</CardTitle>
            <CardDescription className="font-medium">Click below to sign in with your reset token</CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {error ? (
              <div className="p-4 bg-destructive/10 border-2 border-destructive/20 rounded-xl text-sm font-bold text-destructive flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <Button
                onClick={handleReset}
                disabled={isLoading || !token}
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {isLoading ? (
                  'Restoring Session...'
                ) : (
                  <span className="flex items-center">
                    Sign In to Signova <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </Button>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-border/50 bg-muted/10 py-6">
            <Link to="/login" className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4">
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
