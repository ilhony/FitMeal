import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ShareInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
  familyName: string;
}

export const ShareInviteDialog = ({
  open,
  onOpenChange,
  inviteCode,
  familyName,
}: ShareInviteDialogProps) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {familyName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Share this code with family members:
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-muted px-6 py-3 rounded-lg">
                <span className="text-2xl font-mono font-bold tracking-wider">
                  {inviteCode.toUpperCase()}
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
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
