'use client';

import { useState, useEffect } from 'react';
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
import {
  Brain,
  Train,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  MessageSquare,
  Send,
  Route,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function AIPage() {
  // Delay Prediction State
  const [prediction, setPrediction] = useState<Record<string, unknown> | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [trainSearch, setTrainSearch] = useState('701');

  // AI Assistant State
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Journey Planning State
  const [journey, setJourney] = useState<Record<string, unknown> | null>(null);
  const [journeyForm, setJourneyForm] = useState({
    from: 'Dhaka',
    to: 'Chittagong',
    date: new Date().toISOString().split('T')[0],
    time: 'morning',
  });
  const [planning, setPlanning] = useState(false);

  const predictDelay = async () => {
    setPredicting(true);
    try {
      const response = await fetch(`/api/ai/predict-delay?trainNumber=${trainSearch}`);
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setPredicting(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setSending(false);
    }
  };

  const planJourney = async () => {
    setPlanning(true);
    try {
      const response = await fetch('/api/ai/journey-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journeyForm),
      });
      const data = await response.json();
      setJourney(data);
    } catch (error) {
      console.error('Journey planning error:', error);
    } finally {
      setPlanning(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            AI Features
          </h1>
          <p className="text-lg text-muted-foreground">
            Smart predictions, journey planning, and travel assistance powered by AI
          </p>
        </div>

        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
            <TabsTrigger value="predictions">
              <TrendingUp className="w-4 h-4 mr-2" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="assistant">
              <MessageSquare className="w-4 h-4 mr-2" />
              Assistant
            </TabsTrigger>
            <TabsTrigger value="planner">
              <Route className="w-4 h-4 mr-2" />
              Planner
            </TabsTrigger>
          </TabsList>

          {/* Delay Predictions Tab */}
          <TabsContent value="predictions" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Delay Prediction
                </CardTitle>
                <CardDescription>
                  Get intelligent delay predictions based on historical data and current conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter train number (e.g., 701)"
                    value={trainSearch}
                    onChange={(e) => setTrainSearch(e.target.value)}
                  />
                  <Button onClick={predictDelay} disabled={predicting}>
                    {predicting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Predict'}
                  </Button>
                </div>

                {prediction && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{prediction.trainName as string}</h4>
                        <p className="text-sm text-muted-foreground">#{prediction.trainNumber as string}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${(prediction.predictedDelay as number) > 15 ? 'text-red-500' : (prediction.predictedDelay as number) > 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                          ~{prediction.predictedDelay as number} min
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((prediction.confidence as number) * 100)}% confidence
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Contributing Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {(prediction.factors as string[]).map((factor, i) => (
                          <Badge key={i} variant="outline">{factor}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm">
                        <strong>Recommendation:</strong> {prediction.recommendation as string}
                      </p>
                    </div>

                    {(prediction.alternativeTrains as Array<Record<string, string>>)?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Alternative Trains:</p>
                        <div className="space-y-2">
                          {(prediction.alternativeTrains as Array<Record<string, string>>).map((train, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span>{train.trainName} (#{train.trainNumber})</span>
                              <span className="text-sm text-muted-foreground">{train.departureTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  AI Travel Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about trains, schedules, stations, and travel tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto mb-4 p-4 bg-muted/30 rounded-lg space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Start a conversation with the AI assistant</p>
                      <p className="text-sm mt-2">Try: &quot;When is the next train to Chittagong?&quot;</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card border border-border'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-card border border-border p-3 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about trains, schedules, stations..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={sending || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Journey Planner Tab */}
          <TabsContent value="planner" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  AI Journey Planner
                </CardTitle>
                <CardDescription>
                  Get personalized journey recommendations based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From</label>
                    <Input
                      value={journeyForm.from}
                      onChange={(e) => setJourneyForm({ ...journeyForm, from: e.target.value })}
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">To</label>
                    <Input
                      value={journeyForm.to}
                      onChange={(e) => setJourneyForm({ ...journeyForm, to: e.target.value })}
                      placeholder="Chittagong"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={journeyForm.date}
                      onChange={(e) => setJourneyForm({ ...journeyForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Time</label>
                    <Select value={journeyForm.time} onValueChange={(v) => setJourneyForm({ ...journeyForm, time: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={planJourney} disabled={planning}>
                  {planning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Plan My Journey
                </Button>

                {journey && (
                  <div className="mt-4 space-y-4">
                    <h4 className="font-semibold">Recommended Journeys</h4>
                    {(journey.journeys as Array<Record<string, unknown>>)?.map((j, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${i === journey.bestOption ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-semibold">{j.trainName as string}</h5>
                            <p className="text-sm text-muted-foreground">#{j.trainNumber as string}</p>
                          </div>
                          {i === journey.bestOption && (
                            <Badge className="bg-primary/20 text-primary">Recommended</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="font-medium">{j.departureTime as string}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{j.arrivalTime as string}</span>
                          <span className="text-muted-foreground">({j.duration as string})</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{j.recommendation as string}</p>
                      </div>
                    ))}
                    
                    {(journey.tips as string[])?.length > 0 && (
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <p className="text-sm font-medium mb-1">Travel Tips:</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {(journey.tips as string[]).map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
