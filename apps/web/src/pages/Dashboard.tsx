import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppLayout from '@/components/AppLayout';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import SignatureCard from '@/features/signatures/components/SignatureCard';
import { PlusCircle, Users, Mail, Globe } from 'lucide-react';
import CSVUploader from '@/features/teams/components/CSVUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'signatures';
  const { signatures, isLoading, isError, deleteSignature } = useSignatures();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this signature?')) {
      await deleteSignature(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/builder/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-destructive">Error loading signatures. Please try again.</p>
      </div>
    );
  }

  return (
    <AppLayout defaultTab={tabParam}>
      {(activeTab, setActiveTab) => (
        <div className="flex flex-col h-full overflow-hidden">
          <Navbar title={activeTab === 'signatures' ? 'My Signatures' : 'Team Management'} showNewButton={activeTab === 'signatures'} />
          
          <main className="flex-1 overflow-hidden p-8 bg-muted/30">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={(v) => {
                setActiveTab(v);
                setSearchParams({ tab: v });
              }} className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50">
                    <TabsTrigger value="signatures" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Mail className="w-3.5 h-3.5 mr-2" />
                      Signatures
                    </TabsTrigger>
                    <TabsTrigger value="teams" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Users className="w-3.5 h-3.5 mr-2" />
                      Teams
                    </TabsTrigger>
                  </TabsList>

                  
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                  <TabsContent value="signatures" className="m-0 focus-visible:outline-none outline-none">
                    {signatures.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-16 text-center bg-card border-2 border-dashed rounded-[2.5rem] h-[500px] shadow-soft animate-in-up">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 animate-pulse">
                          <PlusCircle className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">No signatures yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-12 text-sm font-medium leading-relaxed">
                          Design professional email signatures for yourself or your entire team in minutes.
                        </p>
                        <Button
                          size="lg"
                          onClick={() => navigate('/builder/new')}
                          className="h-14 px-10 space-x-3 text-white bg-primary rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-2xl shadow-primary/30 active:scale-95 font-bold text-base"
                        >
                          <PlusCircle className="w-5 h-5" />
                          <span>Start Designing</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {signatures.map((signature, index) => (
                          <div key={signature.id} className="animate-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <SignatureCard
                              signature={signature}
                              onDelete={handleDelete}
                              onEdit={handleEdit}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="teams" className="m-0 focus-visible:outline-none outline-none">
                    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in-up">
                      <CSVUploader />
                      <div className="bg-card border rounded-[2.5rem] p-10 shadow-soft">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-2xl font-bold text-primary tracking-tight">Existing Teams</h3>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Manage and sync team-wide signatures</p>
                          </div>
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="text-center p-16 text-muted-foreground border-2 border-dashed rounded-3xl bg-muted/20 italic font-medium flex flex-col items-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 opacity-50">
                            <Globe className="w-8 h-8" />
                          </div>
                          <p>Team management dashboard coming soon.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      )}
    </AppLayout>
  );
}
export default Dashboard;
