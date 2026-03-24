'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Languages,
  Check,
  Globe
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', progress: 100 },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', progress: 100 },
];

export default function LanguagePage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            Language Settings
        </h1>
          <p className="text-muted-foreground">Choose your preferred language for the app</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Language</CardTitle>
            <CardDescription>
              RailBondhu supports multiple languages for your convenience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedLang} onValueChange={setSelectedLang} className="space-y-4">
              {languages.map((lang) => (
                <div 
                  key={lang.code}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedLang === lang.code 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedLang(lang.code)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lang.name}</span>
                        {selectedLang === lang.code && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{lang.progress}% translated</div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                More languages coming soon
              </p>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how the app looks in your selected language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">English</p>
                <p className="font-medium">Welcome to RailBondhu</p>
                <p className="text-sm">Your Train Travel Companion</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">বাংলা</p>
                <p className="font-medium">রেলবন্ধুতে স্বাগতম</p>
                <p className="text-sm">আপনার ট্রেন ভ্রমণ সঙ্গী</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Translate */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Languages className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Help Us Translate</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Want to see RailBondhu in your language? Contribute to our translation efforts.
            </p>
            <Button variant="outline">
              Contribute Translations
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
