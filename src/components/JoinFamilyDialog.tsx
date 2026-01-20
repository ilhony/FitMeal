import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface JoinFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const JoinFamilyDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: JoinFamilyDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const handleJoin = async () => {
    if (!user || !inviteCode.trim()) return;

    setIsLoading(true);
    try {
      // Find family by invite code
      const { data: family, error: findError } = await supabase
        .from("family_circles")
        .select("id, name")
        .eq("invite_code", inviteCode.trim().toLowerCase())
        .maybeSingle();

      if (findError) throw findError;

      if (!family) {
        toast({
          title: "Invalid code",
          description: "No family found with that invite code.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from("family_members")
        .select("id")
        .eq("family_id", family.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already a member",
          description: "You're already part of this family circle.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Join family
      const { error: joinError } = await supabase
        .from("family_members")
        .insert({
          family_id: family.id,
          user_id: user.id,
        });

      if (joinError) throw joinError;

      toast({
        title: "Welcome!",
        description: `You've joined ${family.name}!`,
      });

      setInviteCode("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join family. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Family Circle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="Enter 8-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="text-center text-lg font-mono tracking-wider"
            />
          </div>
          <Button
            onClick={handleJoin}
            disabled={isLoading || inviteCode.trim().length < 8}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Family
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
