'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  ArrowLeft,
  Bot,
  User,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner';

function AIAdvisorContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userSummary, setUserSummary] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      initializeChat();
    }
  }, [user, loading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Get user's financial insights to personalize the welcome
      const response = await fetch(`/api/ai/financial-advisor?user_id=${user.uid}&insights_only=true`);
      if (response.ok) {
        const data = await response.json();
        setUserSummary(data.user_summary);
        
        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          type: 'ai',
          content: `Hello ${user.displayName || 'there'}! 👋 

I'm your AI Financial Advisor, powered by advanced AI technology. I've analyzed your financial profile:

💰 **Your Financial Snapshot:**
- Total Payments: $${data.user_summary?.total_payments || 0}
- Rewards Earned: ${data.user_summary?.total_rewards || 0} points
- Active Bills: ${data.user_summary?.bills_count || 0}
- Payment Pattern: ${data.user_summary?.payment_frequency || 'New user'}

I can help you with:
• 💳 Credit score optimization strategies
• 📊 Bill payment prioritization 
• 🎯 Debt reduction planning
• 💰 Rewards maximization tips
• 📱 AutoPay setup guidance
• 📈 Financial goal planning

What would you like to know about your finances today?`,
          timestamp: new Date().toISOString()
        };
        
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Initialize chat error:', error);
      // Add fallback welcome message
      const fallbackMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Welcome to your AI Financial Advisor! 🎯

I'm here to help you optimize your finances with personalized advice. Ask me anything about:

• Managing credit cards and bills
• Improving your credit score  
• Maximizing rewards and cashback
• Setting up AutoPay systems
• Planning debt reduction strategies

What financial question can I help you with today?`,
        timestamp: new Date().toISOString()
      };
      setMessages([fallbackMessage]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          action: 'ask_question',
          query: inputMessage
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.advice,
          timestamp: new Date().toISOString(),
          session_id: data.session_id
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Send message error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I apologize, but I'm having trouble processing your request right now. Here's some general advice based on your question about "${inputMessage}":

If you're asking about **credit scores**: Focus on paying bills on time (35% of your score) and keeping credit utilization below 30%.

If you're asking about **bill management**: Set up AutoPay for consistent payments and prioritize high-interest debts first.

If you're asking about **rewards**: Use CREDX USA for all bill payments to earn 1 point per dollar spent.

Please try your question again, or contact support if the issue persists.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const provideFeedback = async (messageId, rating) => {
    try {
      await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          action: 'provide_feedback',
          rating: rating
        })
      });
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const quickQuestions = [
    "How can I improve my credit score?",
    "Which bills should I prioritize paying?",
    "How do I maximize my rewards?",
    "Should I enable AutoPay for all my bills?",
    "What's the best debt reduction strategy?",
    "How can I avoid late payment fees?"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading AI advisor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your AI Financial Advisor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => router.push('/auth')}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                AI Financial Advisor
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by OpenAI
                </Badge>
              </h1>
              <p className="text-gray-600">Get personalized financial advice powered by AI</p>
            </div>
          </div>

          {/* User Summary */}
          {userSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Total Payments</p>
                      <p className="font-bold">${userSummary.total_payments || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Rewards</p>
                      <p className="font-bold">{userSummary.total_rewards || 0} pts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Active Bills</p>
                      <p className="font-bold">{userSummary.bills_count || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Pattern</p>
                      <p className="font-bold text-xs capitalize">{userSummary.payment_frequency || 'New'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with Your AI Advisor
            </CardTitle>
            <CardDescription>
              Ask any financial question and get personalized advice based on your profile
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      {message.type === 'ai' ? (
                        <Bot className="h-4 w-4 mt-1 text-orange-600" />
                      ) : (
                        <User className="h-4 w-4 mt-1" />
                      )}
                      <span className="text-xs font-medium">
                        {message.type === 'ai' ? 'AI Advisor' : 'You'}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => provideFeedback(message.id, 'positive')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => provideFeedback(message.id, 'negative')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-orange-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      className="text-left justify-start h-auto p-3 hover:bg-orange-50"
                    >
                      <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your finances... (Press Enter to send)"
                className="flex-1 min-h-[60px] resize-none"
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-orange-600 hover:bg-orange-700 px-4"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AIAdvisorPage() {
  return (
    <AuthProvider>
      <AIAdvisorContent />
    </AuthProvider>
  );
}