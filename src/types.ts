export type BookStatus = 'متاح' | 'معار' | 'للقراءة الداخلية فقط';

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  deweyNumber: string;
  deweyCategory: string;
  section: string;
  location: string;
  status: BookStatus;
  summary?: string;
  pages?: number;
  year?: string;
}

export interface DeweySubCategory {
  code: string;
  name: string;
  shelf: string;
}

export interface DeweyMainCategory {
  code: string;
  name: string;
  description: string;
  shelfLocation: string;
  color: string;
  subCategories: DeweySubCategory[];
}

export interface LrcSection {
  id: string;
  name: string;
  iconName: string;
  description: string;
  equipment: string[];
  capacity: string;
  locationHint: string;
}

export interface LrcRegulation {
  id: string;
  category: 'كتب' | 'حواسيب' | 'استعارة' | 'سلوك عام';
  title: string;
  icon: string;
  summary: string;
  rules: string[];
}

export interface LrcActivity {
  id: string;
  title: string;
  description: string;
  targetGroup: string;
  date: string;
  status: 'قادم' | 'جاري' | 'مكتمل';
  coordinator: string;
  location: string;
}

export interface LrcSession {
  id: string;
  date: string;
  day: string;
  period: string; // e.g. "الحصة الأولى"
  grade: string; // e.g. "الصف السابع 1"
  subject: string; // e.g. "علوم"
  teacher: string;
  lessonTitle: string;
  executionType: string; // e.g. "عرض تفاعلي وشاشة ذكية"
  tools: string[];
  activity: string;
}

export type QueryCategory = 
  | 'book' 
  | 'dewey' 
  | 'borrow' 
  | 'section' 
  | 'regulation' 
  | 'computers'
  | 'activity' 
  | 'session' 
  | 'out_of_scope'
  | 'welcome';

export interface MessageAction {
  label: string;
  query: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  category?: QueryCategory;
  books?: Book[];
  totalBooksFound?: number;
  deweyInfo?: {
    mainCategory?: string;
    mainCode?: string;
    specificCode?: string;
    shelf?: string;
    advice?: string;
    list?: DeweyMainCategory[];
  };
  borrowSteps?: boolean;
  bookPreservation?: boolean;
  sectionResults?: LrcSection[];
  regulationResults?: LrcRegulation[];
  computerRules?: boolean;
  activityResults?: LrcActivity[];
  sessionResults?: LrcSession[];
  followUps?: string[];
  feedback?: 'helpful' | 'unhelpful';
}

export interface AnalyticsRecord {
  totalQueries: number;
  helpfulCount: number;
  unhelpfulCount: number;
  categoryCounts: Record<QueryCategory, number>;
  frequentQuestions: { question: string; count: number; category: QueryCategory }[];
  questionsNeedingUpdate: { id: string; query: string; timestamp: string; reason: string }[];
}
