
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash, List } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import VoiceAssistant from "@/components/chat/VoiceAssistant";
import NavBar from "@/components/layout/NavBar";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

// Mock responses for the AI
const mockResponses = [
  "Thank you for sharing that with me. How long have you been feeling this way?",
  "I understand that can be challenging. Could you tell me more about what you're experiencing?",
  "That's completely normal to feel that way. Many people go through similar experiences.",
  "I'd recommend trying some mindfulness exercises. Would you like me to suggest some?",
  "It sounds like you're going through a difficult time. Remember that it's okay to seek support.",
  "I'm here to listen and help you work through these feelings. What specifically is bothering you the most?",
  "Have you considered speaking with a professional therapist? They could provide personalized guidance for your situation.",
  "Let's work on some strategies that might help you cope with these feelings. Does that sound helpful?",
  "I appreciate you trusting me with your thoughts. Would it help to talk about some practical steps you could take?",
  "Remember to be kind to yourself during this process. Healing takes time and you're doing great by reaching out."
];

interface ChatHistoryItem {
  date: string;
  preview: string;
}

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean; timestamp: Date}>>([
    {
      text: "Hi there! I'm Manas, your mental health assistant. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Mock chat history
  const chatHistory: ChatHistoryItem[] = [
    { date: "Today", preview: "Discussed anxiety management techniques" },
    { date: "Yesterday", preview: "Sleep improvement strategies" },
    { date: "Apr 5, 2025", preview: "Mindfulness exercises for focus" },
    { date: "Apr 3, 2025", preview: "Stress management during work" },
    { date: "Mar 29, 2025", preview: "Dealing with social anxiety" },
  ];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (text: string = inputValue) => {
    if (text.trim() === '') return;
    
    // Add user message
    const userMessage = {
      text: text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsAiTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsAiTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };
  
  const handleVoiceInput = (transcription: string) => {
    if (transcription.trim() !== "") {
      toast({
        title: "Voice captured!",
        description: transcription,
        duration: 3000,
      });
      handleSendMessage(transcription);
    }
  };
  
  const handleClearChat = () => {
    setMessages([{
      text: "Hi there! I'm Manas, your mental health assistant. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }]);
    
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isAiTyping && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse mb-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    AI
                  </div>
                  <div className="px-4 py-3 bg-muted dark:bg-muted/30 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0" aria-label="Chat history">
                    <List size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    {chatHistory.map((chat, index) => (
                      <div 
                        key={index}
                        className="py-3 px-4 hover:bg-muted rounded-lg mb-2 cursor-pointer transition-colors"
                      >
                        <div className="font-medium text-sm">{chat.date}</div>
                        <div className="text-sm text-muted-foreground truncate">{chat.preview}</div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0"
                onClick={handleClearChat}
                aria-label="Clear chat"
              >
                <Trash size={20} />
              </Button>
              
              <div className="relative flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder="How can I help you?"
                  className="pr-10 py-6"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => handleSendMessage()}
                  disabled={inputValue.trim() === ''}
                  aria-label="Send message"
                >
                  <Send size={20} className={inputValue.trim() ? "text-arogya-primary" : ""} />
                </Button>
              </div>
              
              <VoiceAssistant onRecordingComplete={handleVoiceInput} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
