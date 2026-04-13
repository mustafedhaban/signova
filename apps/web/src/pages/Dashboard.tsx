import React from 'react';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import SignatureCard from '@/features/signatures/components/SignatureCard';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CSVUploader from '@/features/teams/components/CSVUploader';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';

const Dashboard: React.FC = () => {
  const { signatures, isLoading, isError, deleteSignature } = useSignatures();
  const navigate = useNavigate();

  const handleEdit = (id: string) => navigate(`/builder/${id}`);
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this signature?')) {
      deleteSignature(id);
    }
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
    <AppLayout>
      {(activeTab) => (
        <>
          <Navbar
            title={activeTab === 'signatures' ? 'My Signatures' : 'Team Management'}
            showNewButton={activeTab === 'signatures'}
          />

          <div className="flex-1 overflow-y-auto p-8 bg-muted/20">
            {activeTab === 'signatures' ? (
              signatures.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-card border border-dashed rounded-lg h-[400px]">
                  <h3 className="text-xl font-bold text-primary mb-2">No signatures yet</h3>
                  <p className="text-muted-foreground mb-8">Create your first professional email signature in minutes.</p>
                  <button
                    onClick={() => navigate('/builder/new')}
                    className="flex items-center px-6 py-3 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Signature</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {signatures.map((signature) => (
                    <SignatureCard
                      key={signature.id}
                      signature={signature}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                <CSVUploader />
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Existing Teams</h3>
                  <div className="text-center p-8 text-muted-foreground border rounded-md bg-muted/10 italic">
                    Team list coming soon.
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
