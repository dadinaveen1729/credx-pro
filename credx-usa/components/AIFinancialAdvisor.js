'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  DollarSign,
  CreditCard,
  Calendar,
  BarChart3,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Send,
  Sparkles,
  Zap,
  Award,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIFinancialAdvisor({ user }) {
  const [advice, setAdvice] = useState(null);
  const [insights, setInsights] = useState([]);
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('advice');
  const [userQuestion, setUserQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFinancialAdvice();
    }
  }, [user]);

  const fetchFinancialAdvice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/financial-advisor?user_id=${user.uid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setAdvice(data.advice);
        setInsights(data.insights || []);
        setUserSummary(data.user_summary);
        
        if (data.fallback_mode) {
          toast.warning('AI advisor is temporarily unavailable. Showing traditional insights.');
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to get financial advice');
      }
    } catch (error) {
      console.error('AI Advisor Error:', error);
      toast.error('Failed to connect to AI advisor');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!userQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      setAskingQuestion(true);
      
      // Add user question to conversation
      const userMessage = {
        type: 'user',
        content: userQuestion,
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, userMessage]);

      const response = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          action: 'ask_question',
          query: userQuestion
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response to conversation
        const aiMessage = {
          type: 'ai',
          content: data.advice,
          timestamp: new Date().toISOString(),
          session_id: data.session_id
        };
        setConversation(prev => [...prev, aiMessage]);
        
        setUserQuestion('');
        toast.success('AI advisor responded!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Question Error:', error);
      toast.error('Failed to ask question');
    } finally {
      setAskingQuestion(false);
    }
  };

  const acceptSuggestion = async (suggestionId) => {
    try {
      const response = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          action: 'accept_suggestion',
          suggestion_id: suggestionId
        })
      });

      if (response.ok) {
        toast.success('Suggestion accepted! Changes have been applied.');
        fetchFinancialAdvice(); // Refresh advice
      } else {
        toast.error('Failed to accept suggestion');
      }
    } catch (error) {
      console.error('Accept Suggestion Error:', error);
      toast.error('Failed to accept suggestion');
    }
  };

  const provideFeedback = async (rating) => {
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
      console.error('Feedback Error:', error);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'planning': return <Target className="h-4 w-4 text-purple-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'border-l-red-500 bg-red-50';
      case 'opportunity': return 'border-l-green-500 bg-green-50';
      case 'tip': return 'border-l-blue-500 bg-blue-50';
      case 'planning': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Advisor Header */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Financial Advisor
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by OpenAI o3
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Personalized financial coaching based on your complete profile
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchFinancialAdvice}
              disabled={loading}
              className="border-orange-300 hover:bg-orange-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* User Financial Summary */}
      {userSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="font-bold">${userSummary.total_payments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Rewards Earned</p>
                  <p className="font-bold">{userSummary.total_rewards || 0} pts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Bills</p>
                  <p className="font-bold">{userSummary.bills_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Payment Pattern</p>
                  <p className="font-bold text-xs capitalize">{userSummary.payment_frequency || 'New'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Advisor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advice">AI Recommendations</TabsTrigger>
          <TabsTrigger value="insights">Financial Insights</TabsTrigger>
          <TabsTrigger value="chat">Ask AI Coach</TabsTrigger>
        </TabsList>

        {/* AI Recommendations Tab */}
        <TabsContent value="advice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-orange-600" />
                Personalized Financial Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered advice based on your complete financial profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600 mr-3" />
                  <span className="text-gray-600">AI is analyzing your financial profile...</span>
                </div>
              ) : advice ? (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {advice}
                    </div>
                  </div>
                  
                  {/* Feedback Section */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">Was this advice helpful?</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => provideFeedback('positive')}
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Helpful
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => provideFeedback('negative')}
                        className="flex items-center gap-2"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click "Refresh Analysis" to get personalized financial advice</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Financial Insights & Quick Actions
              </CardTitle>
              <CardDescription>
                Automated analysis of your financial patterns and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getInsightIcon(insight.type)}
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              {insight.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                          <p className="text-xs text-gray-600 font-medium">
                            💡 {insight.action}
                          </p>
                        </div>
                        {insight.category === 'payment_habits' && (
                          <Button 
                            size="sm"
                            onClick={() => acceptSuggestion('autopay_setup')}
                            className="ml-4 bg-orange-600 hover:bg-orange-700"
                          >
                            Enable AutoPay
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {loading ? 'Analyzing your financial data...' : 'No insights available yet. Make some payments to get personalized insights!'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ask AI Coach Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Ask Your AI Financial Coach
              </CardTitle>
              <CardDescription>
                Get personalized answers to your financial questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation History */}
              {conversation.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
                  {conversation.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ask Question Interface */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Ask your AI coach any financial question... 
Examples:
• How can I improve my credit score?
• Should I pay off high-interest debt first?
• What's the best way to maximize my rewards?
• How can I optimize my bill payment schedule?"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Your AI coach has access to your complete financial profile for personalized advice
                  </p>
                  <Button 
                    onClick={askQuestion}
                    disabled={askingQuestion || !userQuestion.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {askingQuestion ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Ask AI Coach
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Question Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'How can I improve my credit score?',
                  'What bills should I prioritize?',
                  'How to maximize rewards?',
                  'Best payment schedule strategy?'
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setUserQuestion(question)}
                    className="text-left justify-start h-auto p-3 hover:bg-orange-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}