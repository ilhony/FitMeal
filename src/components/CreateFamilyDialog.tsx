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
import { Loader2, Copy, Check } from "lucide-react";

interface CreateFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateFamilyDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateFamilyDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!user || !familyName.trim()) return;

    setIsLoading(true);
    try {
      // Create family circle
      const { data: family, error: familyError } = await supabase
        .from("family_circles")
        .insert({
          name: familyName.trim(),
          created_by: user.id,
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from("family_members")
        .insert({
          family_id: family.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      setInviteCode(family.invite_code);
      toast({
        title: "Family created!",
        description: "Share the invite code with your family members.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create family. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (inviteCode) {
      onSuccess();
    }
    setFamilyName("");
    setInviteCode(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Family Circle</DialogTitle>
        </DialogHeader>

        {!inviteCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                placeholder="e.g., The Smiths"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={isLoading || !familyName.trim()}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Family
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Share this code with your family:
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-muted px-6 py-3 rounded-lg">
                  <span className="text-2xl font-mono font-bold tracking-wider">
                    {inviteCode}
                  </span>
                </div>
                <Button variant="outline" size="icon" onClick={copyCode}>
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
