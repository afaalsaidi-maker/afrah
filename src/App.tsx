import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_BOOKS, 
  INITIAL_ANALYTICS, 
  LRC_SESSIONS, 
  LRC_ACTIVITIES 
} from './data/initialData';
import { 
  Book, 
  AssistantMessage, 
  AnalyticsRecord, 
  QueryCategory 
} from './types';
import { processUserQuery } from './services/lrcEngine';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { QuickPromptCards } from './components/QuickPromptCards';
import { ChatView } from './components/ChatView';
import { SpecialistDashboard } from './components/SpecialistDashboard';
import { Footer } from './components/Footer';

const WELCOME_MESSAGE: AssistantMessage = {
  id: 'welcome-msg',
  sender: 'bot',
  text: `مرحبًا بكِ 🌷

أنا مرشد المعرفة الذكي،
دليلك إلى الكتب والمصادر والخدمات في مركز مصادر التعلم.

يمكنني مساعدتك في العثور على الكتب، ومعرفة تصنيفها ومكانها، والتعرف على أقسام المركز ولوائحه وأنشطته وحصصه.

ماذا تريدين أن تعرفي اليوم؟`,
  timestamp: 'الآن',
  category: 'welcome',
  followUps: [
    'هل يوجد كتاب عن الصلاة؟',
    'أين أجد كتب الكواكب؟',
    'كيف أستعير كتابًا؟'
  ]
};

export default function App() {
  // Books database - can be updated manually by the specialist
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lrc_books_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored books:', e);
      }
    }
    return INITIAL_BOOKS;
  });

  // Analytics database
  const [analytics, setAnalytics] = useState<AnalyticsRecord>(() => {
    const saved = localStorage.getItem('lrc_analytics_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored analytics:', e);
      }
    }
    return INITIAL_ANALYTICS;
  });

  // Conversation history
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('lrc_books_db', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lrc_analytics_db', JSON.stringify(analytics));
  }, [analytics]);

  // Auto-scroll to bottom of chat smoothly when new message appears
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  const handleSearch = (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed || isLoading) return;

    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;

    // 1. Add User Message
    const userMsg: AssistantMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: timeNow
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Realistic brief deliberation (350ms) to show search animation
    setTimeout(() => {
      const result = processUserQuery(trimmed, books);

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: AssistantMessage = {
        id: botMsgId,
        sender: 'bot',
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        category: result.category,
        books: result.books,
        totalBooksFound: result.totalBooksFound,
        deweyInfo: result.deweyInfo,
        borrowSteps: result.borrowSteps,
        sectionResults: result.sectionResults,
        regulationResults: result.regulationResults,
        computerRules: result.computerRules,
        activityResults: result.activityResults,
        sessionResults: result.sessionResults,
        followUps: result.followUps
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);

      // 2. Track Analytics
      updateAnalyticsOnQuery(trimmed, result.category, result.books?.length || 0);
    }, 400);
  };

  const updateAnalyticsOnQuery = (query: string, category: QueryCategory, booksFound: number) => {
    setAnalytics((prev) => {
      const updatedCounts = { ...prev.categoryCounts };
      if (category in updatedCounts) {
        updatedCounts[category] = (updatedCounts[category] || 0) + 1;
      }

      // Check frequent questions
      const existingFreqIndex = prev.frequentQuestions.findIndex(
        (f) => f.question.includes(query) || query.includes(f.question)
      );

      let updatedFreq = [...prev.frequentQuestions];
      if (existingFreqIndex >= 0) {
        updatedFreq[existingFreqIndex] = {
          ...updatedFreq[existingFreqIndex],
          count: updatedFreq[existingFreqIndex].count + 1
        };
      } else {
        updatedFreq.push({
          question: query,
          count: 1,
          category
        });
      }
      updatedFreq.sort((a, b) => b.count - a.count);
      updatedFreq = updatedFreq.slice(0, 10);

      // Check if book query had 0 results - log into questions needing update
      let updatedNeeding = [...prev.questionsNeedingUpdate];
      if (category === 'book' && booksFound === 0) {
        const alreadyLogged = updatedNeeding.some((q) => q.query === query);
        if (!alreadyLogged) {
          updatedNeeding.unshift({
            id: `need-${Date.now()}`,
            query,
            timestamp: new Date().toLocaleDateString('ar-EG'),
            reason: 'لم يتم العثور على نتائج في قاعدة البيانات الحالية'
          });
        }
      }

      return {
        ...prev,
        totalQueries: prev.totalQueries + 1,
        categoryCounts: updatedCounts,
        frequentQuestions: updatedFreq,
        questionsNeedingUpdate: updatedNeeding
      };
    });
  };

  const handleRateFeedback = (messageId: string, rating: 'helpful' | 'unhelpful') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: rating } : msg))
    );

    const targetMsg = messages.find((m) => m.id === messageId);

    setAnalytics((prev) => {
      let updatedNeeding = [...prev.questionsNeedingUpdate];

      if (rating === 'unhelpful') {
        // Find previous user message
        const targetIndex = messages.findIndex((m) => m.id === messageId);
        const previousUserMsg = targetIndex > 0 ? messages[targetIndex - 1] : null;
        const queryText = previousUserMsg?.text || 'استفسار غير محدد';

        updatedNeeding.unshift({
          id: `unhelpful-${Date.now()}`,
          query: queryText,
          timestamp: new Date().toLocaleDateString('ar-EG'),
          reason: 'تم تقييم الإجابة بـ «لم أجد ما أبحث عنه» من قبل الطالبة'
        });
      }

      return {
        ...prev,
        helpfulCount: rating === 'helpful' ? prev.helpfulCount + 1 : prev.helpfulCount,
        unhelpfulCount: rating === 'unhelpful' ? prev.unhelpfulCount + 1 : prev.unhelpfulCount,
        questionsNeedingUpdate: updatedNeeding
      };
    });
  };

  const handleResetChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleResolveQuestion = (id: string) => {
    setAnalytics((prev) => ({
      ...prev,
      questionsNeedingUpdate: prev.questionsNeedingUpdate.filter((q) => q.id !== id)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#123B5D] antialiased" dir="rtl">
      
      {/* Top Application Header */}
      <Header
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onResetChat={handleResetChat}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        
        {/* Central Search Box */}
        <SearchHero
          onSearch={handleSearch}
          isLoading={isLoading}
          inputRef={searchInputRef}
        />

        {/* 7 Quick Prompt Cards */}
        <QuickPromptCards onSelectPrompt={handleSearch} />

        {/* Conversation and Answers Stream */}
        <ChatView
          messages={messages}
          isLoading={isLoading}
          onSelectSuggestion={handleSearch}
          onRateFeedback={handleRateFeedback}
        />

        <div ref={messagesEndRef} />
      </main>

      {/* Specialist Management & Analytics Dashboard */}
      <SpecialistDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        analytics={analytics}
        books={books}
        onAddBook={handleAddBook}
        onResolveQuestionNeedingUpdate={handleResolveQuestion}
        sessions={LRC_SESSIONS}
        activities={LRC_ACTIVITIES}
      />

      {/* Application Footer */}
      <Footer />
    </div>
  );
}
