import React from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout defaultTab="settings">
      {() => (
        <>
          <Navbar title="Settings" />
          <div className="flex-1 overflow-y-auto p-8 bg-muted/20">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-medium capitalize">{user?.provider || 'dev'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>More settings will be available here</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Organization management, branding, and notification preferences are on the roadmap.
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Settings;
