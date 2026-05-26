import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteSignatureDialogProps {
  open: boolean;
  signatureName?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteSignatureDialog: React.FC<DeleteSignatureDialogProps> = ({
  open,
  signatureName,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-2">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete signature?</AlertDialogTitle>
          <AlertDialogDescription>
            {signatureName
              ? `"${signatureName}" will be permanently removed. This cannot be undone.`
              : 'This signature will be permanently removed. This cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSignatureDialog;
