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
  QueryCategory,
  LrcSession,
  LrcActivity,
  BookStatus
} from './types';
import { processUserQuery } from './services/lrcEngine';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { QuickPromptCards } from './components/QuickPromptCards';
import { ChatView } from './components/ChatView';
import { SpecialistDashboard } from './components/SpecialistDashboard';
import { Footer } from './components/Footer';
import { FullBackupPayload } from './services/dataSync';

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

  // Sessions database
  const [sessions, setSessions] = useState<LrcSession[]>(() => {
    const saved = localStorage.getItem('lrc_sessions_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored sessions:', e);
      }
    }
    return LRC_SESSIONS;
  });

  // Activities database
  const [activities, setActivities] = useState<LrcActivity[]>(() => {
    const saved = localStorage.getItem('lrc_activities_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored activities:', e);
      }
    }
    return LRC_ACTIVITIES;
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

  // Track last saved timestamp
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return localStorage.getItem('lrc_last_saved_time') || 'محفوظ تلقائيًا';
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
    localStorage.setItem('lrc_sessions_db', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('lrc_activities_db', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('lrc_analytics_db', JSON.stringify(analytics));
  }, [analytics]);

  const recordSaveTimestamp = () => {
    const nowStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(nowStr);
    localStorage.setItem('lrc_last_saved_time', nowStr);
  };

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
      const result = processUserQuery(trimmed, books, sessions, activities);

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
        updatedCounts[category as keyof typeof updatedCounts] = (updatedCounts[category as keyof typeof updatedCounts] || 0) + 1;
      }

      // Check if frequent question
      const freqIndex = prev.frequentQuestions.findIndex(q => q.question === query);
      let updatedFreq = [...prev.frequentQuestions];
      if (freqIndex >= 0) {
        updatedFreq[freqIndex] = {
          ...updatedFreq[freqIndex],
          count: updatedFreq[freqIndex].count + 1
        };
      } else if (prev.frequentQuestions.length < 8) {
        updatedFreq.push({ question: query, count: 1 });
      }
      updatedFreq.sort((a, b) => b.count - a.count);

      // If category is book but nothing found, register question needing update
      let updatedNeeding = [...prev.questionsNeedingUpdate];
      if (category === 'book' && booksFound === 0) {
        const exists = updatedNeeding.some(q => q.query === query);
        if (!exists) {
          updatedNeeding.unshift({
            id: `q-${Date.now()}`,
            query: query,
            timestamp: new Date().toLocaleDateString('ar-EG') + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            reason: 'كتاب غير متوفر في قاعدة البيانات المعتمدة'
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

  const handleRateFeedback = (messageId: string, rating: 'helpful' | 'unhelpful', messageText?: string) => {
    setAnalytics((prev) => {
      let updatedNeeding = [...prev.questionsNeedingUpdate];
      if (rating === 'unhelpful' && messageText) {
        const queryClean = messageText.slice(0, 45);
        const exists = updatedNeeding.some(q => q.query.includes(queryClean));
        if (!exists) {
          updatedNeeding.unshift({
            id: `q-${Date.now()}`,
            query: `طلب مراجعة إجابة: ${queryClean}...`,
            timestamp: new Date().toLocaleDateString('ar-EG') + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            reason: 'الطالبة قيّمت الإجابة بأنها غير كافية أو غير دقيقة'
          });
        }
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

  // Book Handlers
  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    recordSaveTimestamp();
  };

  const handleUpdateBookStatus = (bookId: string, status: BookStatus) => {
    setBooks((prev) => prev.map(b => b.id === bookId ? { ...b, status } : b));
    recordSaveTimestamp();
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter(b => b.id !== bookId));
    recordSaveTimestamp();
  };

  // Session Handlers
  const handleAddSession = (newSession: LrcSession) => {
    setSessions((prev) => [newSession, ...prev]);
    recordSaveTimestamp();
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter(s => s.id !== sessionId));
    recordSaveTimestamp();
  };

  // Activity Handlers
  const handleAddActivity = (newActivity: LrcActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
    recordSaveTimestamp();
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter(a => a.id !== activityId));
    recordSaveTimestamp();
  };

  const handleUpdateActivityStatus = (activityId: string, status: LrcActivity['status']) => {
    setActivities((prev) => prev.map(a => a.id === activityId ? { ...a, status } : a));
    recordSaveTimestamp();
  };

  // Resolve question
  const handleResolveQuestion = (id: string) => {
    setAnalytics((prev) => ({
      ...prev,
      questionsNeedingUpdate: prev.questionsNeedingUpdate.filter((q) => q.id !== id)
    }));
  };

  // Full backup import & reset
  const handleImportBackup = (importedData: Partial<FullBackupPayload>) => {
    if (importedData.books && Array.isArray(importedData.books)) {
      setBooks(importedData.books);
    }
    if (importedData.sessions && Array.isArray(importedData.sessions)) {
      setSessions(importedData.sessions);
    }
    if (importedData.activities && Array.isArray(importedData.activities)) {
      setActivities(importedData.activities);
    }
    if (importedData.analytics) {
      setAnalytics(importedData.analytics);
    }
    recordSaveTimestamp();
  };

  const handleResetToDefault = () => {
    setBooks(INITIAL_BOOKS);
    setSessions(LRC_SESSIONS);
    setActivities(LRC_ACTIVITIES);
    setAnalytics(INITIAL_ANALYTICS);
    localStorage.removeItem('lrc_books_db');
    localStorage.removeItem('lrc_sessions_db');
    localStorage.removeItem('lrc_activities_db');
    localStorage.removeItem('lrc_analytics_db');
    recordSaveTimestamp();
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
        onUpdateBookStatus={handleUpdateBookStatus}
        onDeleteBook={handleDeleteBook}
        onResolveQuestionNeedingUpdate={handleResolveQuestion}
        sessions={sessions}
        onAddSession={handleAddSession}
        onDeleteSession={handleDeleteSession}
        activities={activities}
        onAddActivity={handleAddActivity}
        onDeleteActivity={handleDeleteActivity}
        onUpdateActivityStatus={handleUpdateActivityStatus}
        onImportBackup={handleImportBackup}
        onResetToDefault={handleResetToDefault}
        lastSavedTime={lastSavedTime}
      />

      {/* Application Footer */}
      <Footer />
    </div>
  );
}
