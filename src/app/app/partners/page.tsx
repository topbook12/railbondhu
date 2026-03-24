'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Code,
  Key,
  Zap,
  Building,
  Check,
  ArrowRight,
  Terminal,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';

const codeExamples = {
  javascript: `// JavaScript example
const response = await fetch('https://api.railbondhu.com/api/trains', {
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  }
});
const trains = await response.json();
console.log(trains);`,
  python: `# Python example
import requests

headers = {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
}
response = requests.get(
    'https://api.railbondhu.com/api/trains',
    headers=headers
)
trains = response.json()
print(trains)`,
  curl: `# cURL example
curl -H "X-API-Key: your-api-key" \\
     -H "Content-Type: application/json" \\
     https://api.railbondhu.com/api/trains`,
};

export default function PartnersPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [showRegistration, setShowRegistration] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    website: '',
    plan: 'Free',
    useCase: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRegister = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage as keyof typeof codeExamples]);
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4" variant="outline">Partner API</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Build with RailBondhu API
          </h1>
          <p className="text-lg text-muted-foreground">
            Integrate train schedules, real-time tracking, and booking into your applications
          </p>
        </div>

        {/* Quick Start */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Quick Start
            </CardTitle>
            <CardDescription>Get started with our API in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {['javascript', 'python', 'curl'].map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={copyCode} className="ml-auto">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Free', price: 0, requests: '1,000/month', features: ['Train schedules', 'Station info', 'Basic search'], popular: false },
            { name: 'Developer', price: 29, requests: '50,000/month', features: ['All Free features', 'Live locations', 'Delay predictions', 'Email support'], popular: true },
            { name: 'Business', price: 99, requests: '500,000/month', features: ['All Developer features', 'AI journey planning', 'Booking API', 'Priority support'], popular: false },
            { name: 'Enterprise', price: 'Custom', requests: 'Unlimited', features: ['All Business features', 'Dedicated support', 'Custom integrations'], popular: false },
          ].map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Popular</Badge>
              )}
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.requests} requests</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => {
                    setForm({ ...form, plan: plan.name });
                    setShowRegistration(true);
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Available Endpoints</CardTitle>
            <CardDescription>Explore our comprehensive API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { method: 'GET', path: '/api/trains', desc: 'Get all trains with schedules', auth: 'API Key' },
                { method: 'GET', path: '/api/trains/:id/live-location', desc: 'Get real-time train location', auth: 'API Key' },
                { method: 'GET', path: '/api/stations', desc: 'Get all stations', auth: 'API Key' },
                { method: 'POST', path: '/api/ai/predict-delay', desc: 'AI-powered delay predictions', auth: 'Premium' },
                { method: 'POST', path: '/api/ai/journey-plan', desc: 'AI-powered journey planning', auth: 'Premium' },
                { method: 'POST', path: '/api/booking', desc: 'Create ticket booking', auth: 'Partner' },
              ].map((endpoint, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Badge className={endpoint.method === 'GET' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">{endpoint.desc}</span>
                  <Badge variant="outline">{endpoint.auth}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registration Dialog */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{submitted ? 'Application Submitted!' : 'Register for API Access'}</CardTitle>
                <CardDescription>
                  {submitted 
                    ? 'We will review your application and contact you soon.'
                    : 'Fill out the form to get your API key'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-6">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Thank you for your interest! Our team will review your application and get back to you within 2 business days.
                    </p>
                    <Button className="mt-4" onClick={() => {
                      setShowRegistration(false);
                      setSubmitted(false);
                    }}>
                      Close
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Company Name"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <Input
                      placeholder="Website (optional)"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                    <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Free">Free Plan</SelectItem>
                        <SelectItem value="Developer">Developer - $29/mo</SelectItem>
                        <SelectItem value="Business">Business - $99/mo</SelectItem>
                        <SelectItem value="Enterprise">Enterprise - Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="How will you use the API?"
                      value={form.useCase}
                      onChange={(e) => setForm({ ...form, useCase: e.target.value })}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowRegistration(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleRegister} disabled={submitting}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
