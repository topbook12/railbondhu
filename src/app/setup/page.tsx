'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, Database, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
  const [status, setStatus] = useState<{
    trains: number;
    stations: number;
    users: number;
    needsSeeding: boolean;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/setup/seed');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check database:', error);
      setStatus({ 
        trains: 0, 
        stations: 0, 
        users: 0, 
        needsSeeding: true,
        error: 'Database connection failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      const res = await fetch('/api/setup/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: 'railbondhu-seed-2024' }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSeedResult({ 
          success: true, 
          message: `সফল! ${data.trains}টি ট্রেন এবং ${data.stations}টি স্টেশন যোগ করা হয়েছে।` 
        });
        checkDatabase();
      } else {
        setSeedResult({ 
          success: false, 
          message: data.details || data.error || 'সমস্যা হয়েছে' 
        });
      }
    } catch (error) {
      setSeedResult({ 
        success: false, 
        message: 'ডেটাবেস সিড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Train className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">RailBondhu Setup</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              ডেটাবেস সেটআপ
            </CardTitle>
            <CardDescription>
              ট্রেন এবং স্টেশনের ডেটা যোগ করুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Status */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{status?.trains || 0}</div>
                    <div className="text-sm text-muted-foreground">ট্রেন</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{status?.stations || 0}</div>
                    <div className="text-sm text-muted-foreground">স্টেশন</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-primary">{status?.users || 0}</div>
                    <div className="text-sm text-muted-foreground">ব্যবহারকারী</div>
                  </div>
                </div>

                {/* Error Display */}
                {status?.error && (
                  <div className="p-4 rounded-lg bg-red-50 text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {status.error}
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex justify-center">
                  {(status?.trains === 0) ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      ডেটা যোগ করা প্রয়োজন
                    </Badge>
                  ) : (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                      <CheckCircle className="w-3 h-3" />
                      ডেটাবেস প্রস্তুত
                    </Badge>
                  )}
                </div>

                {/* Seed Button - Always enabled if no trains */}
                <Button
                  onClick={seedDatabase}
                  disabled={isSeeding}
                  className="w-full btn-primary"
                  size="lg"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ডেটা যোগ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      ডেটা যোগ করুন
                    </>
                  )}
                </Button>

                {/* Result */}
                {seedResult && (
                  <div className={`p-4 rounded-lg ${seedResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {seedResult.message}
                  </div>
                )}

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2 p-4 bg-muted rounded-lg">
                  <p className="font-medium">📝 নির্দেশনা:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>"ডেটা যোগ করুন" বাটনে ক্লিক করুন</li>
                    <li>১৫টি ট্রেন ও ১৫টি স্টেশন যোগ হবে</li>
                    <li>এডমিন ইউজার তৈরি হবে</li>
                    <li>তারপর অ্যাপে যান এবং ট্রেন দেখুন</li>
                  </ol>
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      হোম পেজে যান
                    </Button>
                  </Link>
                  <Link href="/app" className="flex-1">
                    <Button variant="outline" className="w-full">
                      অ্যাপে যান
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
