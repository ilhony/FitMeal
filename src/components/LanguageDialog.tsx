import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export const LanguageDialog = ({ open, onOpenChange }: LanguageDialogProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelect = (code: string) => {
    setSelectedLanguage(code);
    // In a real app, this would update i18n settings
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Language</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-1">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant="ghost"
                className="w-full justify-between h-12"
                onClick={() => handleSelect(lang.code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            More languages coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
