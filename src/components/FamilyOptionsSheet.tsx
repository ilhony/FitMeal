import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

interface FamilyOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFamily: () => void;
  onJoinFamily: () => void;
}

export const FamilyOptionsSheet = ({
  open,
  onOpenChange,
  onCreateFamily,
  onJoinFamily,
}: FamilyOptionsSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Get Started</SheetTitle>
        </SheetHeader>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-16 justify-start gap-4"
            onClick={() => {
              onOpenChange(false);
              onCreateFamily();
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Create Family Circle</p>
              <p className="text-xs text-muted-foreground">Start a new family and invite others</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full h-16 justify-start gap-4"
            onClick={() => {
              onOpenChange(false);
              onJoinFamily();
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Join Family Circle</p>
              <p className="text-xs text-muted-foreground">Enter an invite code to join</p>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
