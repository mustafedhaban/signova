import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AppLayout from '@/components/AppLayout';
import PageLoading from '@/components/PageLoading';
import DeleteSignatureDialog from '@/components/DeleteSignatureDialog';
import { EmptyState } from '@/components/layout/empty-state';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import { SignaturePreviewPane } from '@/features/signatures/components/SignaturePreviewPane';
import { SignatureToolbar } from '@/features/signatures/components/SignatureToolbar';
import { PlusCircle, Users } from 'lucide-react';
import CSVUploader from '@/features/teams/components/CSVUploader';
import TeamsList from '@/features/teams/components/TeamsList';
import OrganizationMembersCard from '@/features/organizations/components/OrganizationMembersCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'signatures';
  const signatureParam = searchParams.get('signature');
  const { signatures, isLoading, isError, deleteSignature } = useSignatures();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name?: string } | null>(null);

  const selectedSignature =
    signatures.find((s) => s.id === signatureParam) ?? signatures[0] ?? null;

  useEffect(() => {
    if (tabParam !== 'signatures' || signatures.length === 0) return;
    if (signatureParam && signatures.some((s) => s.id === signatureParam)) return;
    setSearchParams({ tab: 'signatures', signature: signatures[0].id }, { replace: true });
  }, [tabParam, signatureParam, signatures, setSearchParams]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteSignature(deleteTarget.id);
    setDeleteTarget(null);
    const remaining = signatures.filter((s) => s.id !== deleteTarget.id);
    if (remaining[0]) {
      setSearchParams({ tab: 'signatures', signature: remaining[0].id });
    } else {
      setSearchParams({ tab: 'signatures' });
    }
  };

  if (isLoading) {
    return <PageLoading label="Loading signatures…" />;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="size-4" />
          <AlertTitle>Could not load signatures</AlertTitle>
          <AlertDescription>Please refresh the page or try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <AppLayout defaultTab={tabParam}>
        {(activeTab) => (
          <div className="flex h-full min-h-0 flex-col">
            <Navbar
              title={activeTab === 'signatures' ? 'Signatures' : 'Team management'}
              description={
                activeTab === 'signatures'
                  ? 'Manage and export your email signatures'
                  : 'Bulk import and organize team signatures'
              }
            />

            {activeTab === 'signatures' ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {signatures.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center p-8">
                    <EmptyState
                      icon={PlusCircle}
                      title="No signatures yet"
                      description="Create your first professional email signature."
                      action={{
                        label: 'Create signature',
                        onClick: () => navigate('/builder/new'),
                      }}
                    />
                  </div>
                ) : selectedSignature ? (
                  <>
                    <SignatureToolbar
                      signature={selectedSignature}
                      onDelete={(id, name) => setDeleteTarget({ id, name })}
                    />
                    <SignaturePreviewPane signature={selectedSignature} />
                  </>
                ) : null}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
                    <TabsList>
                      <TabsTrigger value="teams" className="gap-2">
                        <Users className="size-3.5" />
                        Teams
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="teams" className="mt-6 space-y-6 outline-none">
                      <CSVUploader />
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Signature teams</CardTitle>
                          <CardDescription>
                            Group bulk-imported signatures by campaign or department
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <TeamsList />
                        </CardContent>
                      </Card>
                      <OrganizationMembersCard />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
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
