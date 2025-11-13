"use client";

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, CornerDownLeft, Loader2, Mic, Send, Sparkles, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { persistentAIAssistant } from '@/ai/flows/persistent-ai-assistant';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function UKiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await persistentAIAssistant({ query: input });
      const assistantMessage: Message = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get a response. Please try again.",
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message if AI fails
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
          >
            <Button
              size="icon"
              onClick={() => setIsOpen(true)}
              className="rounded-full w-16 h-16 shadow-2xl bg-primary hover:bg-primary/90"
              aria-label="Open AI Assistant"
            >
              <Bot className="h-8 w-8" />
            </Button>
          </motion.div>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="text-accent h-6 w-6" />
              <span className="font-headline">Chat with UKi</span>
            </SheetTitle>
          </SheetHeader>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border-2 border-accent">
                    <AvatarFallback className="bg-accent text-accent-foreground"><Bot size={20}/></AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[85%]">
                    <p className="text-sm">Hi there! I'm UKi, your AI assistant. How can I help you save on your utilities today?</p>
                </div>
            </div>
            <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.role === 'assistant' && (
                             <Avatar className="w-8 h-8 border-2 border-accent">
                                <AvatarFallback className="bg-accent text-accent-foreground"><Bot size={20}/></AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={`p-3 rounded-lg max-w-[85%] ${
                            msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-tl-none'
                            }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                        </div>
                         {msg.role === 'user' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback><User size={20}/></AvatarFallback>
                            </Avatar>
                        )}
                    </motion.div>
                ))}
                 {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <Avatar className="w-8 h-8 border-2 border-accent">
                            <AvatarFallback className="bg-accent text-accent-foreground"><Bot size={20}/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
          <div className="p-4 border-t bg-background">
            <div className="relative">
                <Textarea
                    placeholder="Ask about deals, plans, or savings..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className="pr-24 min-h-[50px] max-h-[150px]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button size="icon" variant="ghost" disabled>
                        <Mic className="h-5 w-5" />
                    </Button>
                    <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-2 text-center">UKi can make mistakes. Consider checking important information.</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
