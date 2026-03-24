'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSocket, ChatMessage, OnlineUser } from '@/hooks/use-socket';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Users,
  Train,
  Radio,
  Wifi,
  WifiOff,
  Smile,
  MapPin,
  Clock,
  AlertCircle,
  RefreshCw,
  Settings,
  ChevronDown
} from 'lucide-react';

/*
 * TRAIN CHAT ROOM PAGE
 * ====================
 * 
 * Real-time chat room for train passengers.
 * 
 * Features:
 * - Real-time messaging with WebSocket
 * - Online user tracking
 * - Anonymous location sharing
 * - Connection status indicator
 * - Custom display name
 * - Message timestamps
 * - System messages (join/leave)
 * - Mobile-friendly design
 */

interface TrainData {
  id: string;
  trainName: string;
  trainNumber: string;
  sourceStation: string;
  destinationStation: string;
}

// Quick emoji reactions
const QUICK_EMOJIS = ['👋', '👍', '🙏', '😊', '🚂', '📍', '⏰', '✅'];

export default function TrainChatPage() {
  const params = useParams();
  const router = useRouter();
  const trainId = params.id as string;
  
  // Socket hook for real-time communication
  const {
    isConnected,
    isConnecting,
    connectionError,
    messages,
    onlineUsers,
    joinTrainChat,
    leaveTrainChat,
    sendMessage,
    shareLocation,
    currentUserId,
    currentDisplayName,
    setDisplayName
  } = useSocket();

  // Local state
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [train, setTrain] = useState<TrainData | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const locationWatchRef = useRef<number | null>(null);
  const hasJoinedRef = useRef(false);

  // Fetch train data
  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const response = await fetch(`/api/trains/${trainId}`);
        if (response.ok) {
          const data = await response.json();
          setTrain(data);
        }
      } catch (err) {
        console.error('Failed to fetch train:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrain();
  }, [trainId]);

  // Join train chat when connected
  useEffect(() => {
    if (isConnected && trainId && !isLoading && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      joinTrainChat(trainId, currentUserId, currentDisplayName);
    }
  }, [isConnected, trainId, isLoading, joinTrainChat, currentUserId, currentDisplayName]);

  // Leave chat on unmount
  useEffect(() => {
    return () => {
      if (hasJoinedRef.current) {
        leaveTrainChat();
      }
    };
  }, [leaveTrainChat]);

  // Handle location sharing
  useEffect(() => {
    if (locationSharing && navigator.geolocation) {
      locationWatchRef.current = navigator.geolocation.watchPosition(
        (position) => {
          shareLocation(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.speed || undefined,
            position.coords.heading || undefined
          );
        },
        (error) => {
          console.error('Location error:', error);
          setLocationSharing(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
        locationWatchRef.current = null;
      }
    };
  }, [locationSharing, shareLocation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = useCallback((messageText?: string) => {
    const text = messageText || newMessage.trim();
    if (!text) return;
    
    sendMessage(text);
    setNewMessage('');
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, [newMessage, sendMessage]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  // Update display name
  const handleUpdateName = () => {
    if (tempDisplayName.trim()) {
      setDisplayName(tempDisplayName.trim());
      // Rejoin with new name
      if (isConnected && trainId) {
        joinTrainChat(trainId, currentUserId, tempDisplayName.trim());
      }
    }
    setShowNameDialog(false);
  };

  // Format time
  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-[50vh] w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="shrink-0 hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Train className="w-5 h-5 text-primary" />
                  <h1 className="text-lg font-bold text-foreground truncate">
                    {train?.trainName || `Train #${trainId}`} Chat
                  </h1>
                  {/* Connection status */}
                  {isConnected ? (
                    <Badge variant="outline" className="border-green-300 text-green-600 bg-green-50 dark:bg-green-950 dark:border-green-700 dark:text-green-400">
                      <Wifi className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  ) : isConnecting ? (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-400">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Connecting...
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-300 text-red-600 bg-red-50 dark:bg-red-950 dark:border-red-700 dark:text-red-400">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <button 
                    onClick={() => setShowUserList(!showUserList)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>{onlineUsers.length} online</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showUserList ? 'rotate-180' : ''}`} />
                  </button>
                  {train && (
                    <>
                      <span>•</span>
                      <span className="truncate">{train.sourceStation} → {train.destinationStation}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Settings & Location Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setTempDisplayName(currentDisplayName);
                    setShowNameDialog(true);
                  }}
                  className="shrink-0 hover:bg-muted"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </Button>
                
                <div className="hidden sm:flex items-center gap-2">
                  <Label htmlFor="location-toggle" className="text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Location
                  </Label>
                  <Switch
                    id="location-toggle"
                    checked={locationSharing}
                    onCheckedChange={setLocationSharing}
                  />
                </div>
              </div>
            </div>

            {/* Online Users Dropdown */}
            {showUserList && (
              <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Online Users ({onlineUsers.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {onlineUsers.map(user => (
                    <Badge 
                      key={user.id} 
                      variant="secondary"
                      className={`${user.id === currentUserId ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      {user.displayName}
                      {user.id === currentUserId && ' (You)'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Connection error */}
            {connectionError && (
              <div className="mt-2 p-3 bg-destructive/10 rounded-xl text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {connectionError}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl icon-primary mx-auto mb-4 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground font-medium">Welcome to the chat!</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Be the first to say hello to fellow passengers
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {QUICK_EMOJIS.slice(0, 4).map(emoji => (
                        <Button
                          key={emoji}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(emoji)}
                          className="text-lg"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.userId === currentUserId;
                    const isSystem = msg.type === 'system';
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          isSystem ? 'justify-center' : 
                          isCurrentUser ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {!isSystem && (
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className={`text-xs font-medium ${
                              isCurrentUser 
                                ? 'bg-primary text-white' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {msg.displayName?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[75%] ${
                          isSystem 
                            ? 'text-center' 
                            : isCurrentUser
                              ? 'text-right'
                              : ''
                        }`}>
                          {!isSystem && !isCurrentUser && (
                            <p className="text-xs text-muted-foreground mb-1 ml-1">
                              {msg.displayName}
                            </p>
                          )}
                          
                          <div className={`inline-block px-4 py-2 rounded-2xl ${
                            isSystem
                              ? 'bg-muted/50 text-muted-foreground text-sm'
                              : isCurrentUser
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                          
                          {!isSystem && (
                            <p className={`text-xs text-muted-foreground mt-1 ${
                              isCurrentUser ? 'mr-1' : 'ml-1'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4">
              {/* Location sharing indicator */}
              {locationSharing && (
                <div className="mb-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-sm text-accent">Sharing your location anonymously</span>
                  </div>
                </div>
              )}
              
              {/* Quick emojis */}
              {showEmojiPicker && (
                <div className="mb-3 p-3 bg-muted/50 rounded-xl">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_EMOJIS.map(emoji => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => addEmoji(emoji)}
                        className="text-xl h-10 w-10 p-0"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 hover:bg-muted"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className={`w-5 h-5 ${showEmojiPicker ? 'text-primary' : 'text-muted-foreground'}`} />
                </Button>
                
                {/* Mobile location toggle */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`shrink-0 sm:hidden ${locationSharing ? 'bg-accent/10' : 'hover:bg-muted'}`}
                  onClick={() => setLocationSharing(!locationSharing)}
                >
                  <MapPin className={`w-5 h-5 ${locationSharing ? 'text-accent' : 'text-muted-foreground'}`} />
                </Button>
                
                <Input
                  ref={inputRef}
                  placeholder={isConnected ? "Type a message..." : "Connecting..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                  className="flex-1 bg-muted/50 border-border focus:border-primary"
                />
                <Button 
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={!newMessage.trim() || !isConnected}
                  className="btn-primary shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Online Users Sidebar - Desktop only */}
          <div className="hidden lg:block w-72 border-l border-border bg-muted/30">
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Online ({onlineUsers.length})
              </h3>
              <ScrollArea className="h-[calc(100vh-18rem)]">
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        user.id === currentUserId 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className={`text-xs font-medium ${
                            user.id === currentUserId 
                              ? 'bg-primary text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground truncate block font-medium">
                          {user.displayName}
                          {user.id === currentUserId && <span className="text-muted-foreground"> (You)</span>}
                        </span>
                        {user.isSharingLocation && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Sharing location
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {onlineUsers.length === 0 && (
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No users online</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              {/* Train Info */}
              {train && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Train className="w-4 h-4" />
                    <span>#{train.trainNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{train.sourceStation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{train.destinationStation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Display Name</DialogTitle>
            <DialogDescription>
              Choose how others see you in the chat
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter your display name"
            value={tempDisplayName}
            onChange={(e) => setTempDisplayName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateName} disabled={!tempDisplayName.trim()}>
              Update Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
