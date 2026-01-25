import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface LeaveFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyName: string;
  onSuccess: () => void;
}

export const LeaveFamilyDialog = ({
  open,
  onOpenChange,
  familyName,
  onSuccess,
}: LeaveFamilyDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    if (!user) return;

    setIsLeaving(true);
    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Left family",
        description: `You have left ${familyName}`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave family",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {familyName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this family circle? You will no longer
            be able to see other members' progress or participate in challenges.
            You can rejoin later with an invite code.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            disabled={isLeaving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLeaving ? "Leaving..." : "Leave Family"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
