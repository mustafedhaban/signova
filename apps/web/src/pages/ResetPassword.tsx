import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset your session</CardTitle>
          <CardDescription>Click below to sign in with your reset token</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive text-center">{error}</p>
          ) : (
            <Button
              variant="blue"
              className="w-full"
              onClick={handleReset}
              disabled={isLoading || !token}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          )}
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          <Link to="/login" className="text-blue-600 hover:underline">Back to sign in</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
