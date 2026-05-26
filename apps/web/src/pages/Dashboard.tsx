import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppLayout from '@/components/AppLayout';
import PageLoading from '@/components/PageLoading';
import DeleteSignatureDialog from '@/components/DeleteSignatureDialog';
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
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);

  const handleDeleteRequest = (id: string, name?: string) => {
    setDeleteTarget({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteSignature(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/builder/${id}`);
  };

  if (isLoading) {
    return <PageLoading label="Loading signatures..." />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <p className="text-destructive font-bold">Error loading signatures</p>
          <p className="mt-2 text-sm text-muted-foreground">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppLayout defaultTab={tabParam}>
        {(activeTab, setActiveTab, openSidebar) => (
          <div className="flex h-full w-full flex-col overflow-hidden">
            <Navbar
              title={activeTab === 'signatures' ? 'My Signatures' : 'Team Management'}
              showNewButton={activeTab === 'signatures'}
              onMenuClick={openSidebar}
            />

            <main className="flex-1 overflow-hidden bg-muted/30 p-4 sm:p-8">
              <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    setActiveTab(v);
                    setSearchParams({ tab: v });
                  }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-6 flex items-center justify-between sm:mb-8">
                    <TabsList className="rounded-xl border border-border/50 bg-muted/50 p-1">
                      <TabsTrigger
                        value="signatures"
                        className="rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm sm:px-6"
                      >
                        <Mail className="mr-2 h-3.5 w-3.5" />
                        Signatures
                      </TabsTrigger>
                      <TabsTrigger
                        value="teams"
                        className="rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm sm:px-6"
                      >
                        <Users className="mr-2 h-3.5 w-3.5" />
                        Teams
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <TabsContent value="signatures" className="m-0 outline-none focus-visible:outline-none">
                      {signatures.length === 0 ? (
                        <div className="flex w-full min-h-[min(500px,70vh)] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-card p-8 text-center shadow-soft animate-in-up sm:p-16">
                          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 rotate-3 motion-safe:animate-pulse">
                            <PlusCircle className="h-12 w-12 text-primary" />
                          </div>
                          <h3 className="mb-4 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                            No signatures yet
                          </h3>
                          <p className="mb-10 max-w-sm text-sm font-medium leading-relaxed text-muted-foreground">
                            Design professional email signatures for yourself or your entire team in minutes.
                          </p>
                          <Button
                            size="lg"
                            onClick={() => navigate('/builder/new')}
                            className="h-14 space-x-3 rounded-2xl bg-primary px-10 text-base font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all active:scale-95 hover:bg-primary/90"
                          >
                            <PlusCircle className="h-5 w-5" />
                            <span>Start Designing</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid w-full grid-cols-1 gap-6 pb-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                          {signatures.map((signature, index) => (
                            <div
                              key={signature.id}
                              className="animate-in-up"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <SignatureCard
                                signature={signature}
                                onDelete={handleDeleteRequest}
                                onEdit={handleEdit}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="teams" className="m-0 outline-none focus-visible:outline-none">
                      <div className="mx-auto w-full max-w-4xl space-y-10 pb-12 animate-in-up">
                        <CSVUploader />
                        <div className="rounded-[2.5rem] border bg-card p-6 shadow-soft sm:p-10">
                          <div className="mb-8 flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold tracking-tight text-primary">Existing Teams</h3>
                              <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Manage and sync team-wide signatures
                              </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex flex-col items-center rounded-3xl border-2 border-dashed bg-muted/20 p-12 text-center italic font-medium text-muted-foreground sm:p-16">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted opacity-50">
                              <Globe className="h-8 w-8" />
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

      <DeleteSignatureDialog
        open={!!deleteTarget}
        signatureName={deleteTarget?.name}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Dashboard;
