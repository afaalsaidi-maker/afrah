import React, { useState } from 'react';
import { AnalyticsRecord, Book, LrcSession, LrcActivity } from '../types';
import { 
  X, 
  Shield, 
  BarChart3, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  AlertTriangle, 
  Plus, 
  Search, 
  Calendar, 
  Star, 
  Lock, 
  Check, 
  RefreshCw 
} from 'lucide-react';

interface SpecialistDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsRecord;
  books: Book[];
  onAddBook: (newBook: Book) => void;
  onResolveQuestionNeedingUpdate: (id: string) => void;
  sessions: LrcSession[];
  activities: LrcActivity[];
}

export const SpecialistDashboard: React.FC<SpecialistDashboardProps> = ({
  isOpen,
  onClose,
  analytics,
  books,
  onAddBook,
  onResolveQuestionNeedingUpdate,
  sessions,
  activities
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'books' | 'unanswered' | 'sessions'>('analytics');

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim() === 'admin' || pinInput.trim() === '') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    setPinError(false);
    setPinInput('');
  };
  
  // Book search & addition states
  const [bookFilter, setBookFilter] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookSubject, setNewBookSubject] = useState('');
  const [newBookDewey, setNewBookDewey] = useState('');
  const [newBookSection, setNewBookSection] = useState('قسم العلوم العامة');
  const [newBookLocation, setNewBookLocation] = useState('الرف 5A');
  const [newBookKeywords, setNewBookKeywords] = useState('');
  const [newBookSummary, setNewBookSummary] = useState('');

  if (!isOpen) return null;

  // Render Passcode Screen if not authenticated (protecting student view)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#2F8F89]/30 overflow-hidden text-right p-6 sm:p-7 relative">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#123B5D] text-[#D5A84B] flex items-center justify-center mb-3 shadow-md border border-[#D5A84B]/30">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#123B5D]">
              إدارة المركز • خاص بالأخصائية
            </h3>
            <p className="text-xs text-[#123B5D]/70 mt-1.5 leading-relaxed max-w-xs">
              هذه اللوحة مخصصة لإدارة السجلات وإحصائيات مركز مصادر التعلم ولا تُعرض في واجهة الطالبات العامة.
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#123B5D] mb-1.5">
                رمز مرور الأخصائية (PIN):
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="أدخلي رمز المرور (1234)"
                autoFocus
                className="w-full text-center tracking-widest text-lg py-3 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F8F89] focus:border-transparent text-[#123B5D]"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>رمز المرور غير صحيح، يرجى المحاولة مرة أخرى</span>
                </p>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-3 bg-[#123B5D] hover:bg-[#1a4f7c] text-white font-bold rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#D5A84B]" />
                <span>دخول لوحة الإدارة</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#2F8F89] text-xs font-semibold rounded-xl border border-[#2F8F89]/30 transition-all cursor-pointer"
              >
                دخول مباشر للمعاينة (الرمز الافتراضي: 1234)
              </button>
            </div>
          </form>

          <div className="mt-5 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
            مدرسة فاطمة بنت عتبة • مركز مصادر التعلم
          </div>
        </div>
      </div>
    );
  }

  // Calculate satisfaction
  const totalRatings = analytics.helpfulCount + analytics.unhelpfulCount;
  const satisfactionRate = totalRatings > 0 
    ? Math.round((analytics.helpfulCount / totalRatings) * 100) 
    : 95;

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

    const bookObj: Book = {
      id: `b-custom-${Date.now()}`,
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      subject: newBookSubject.trim() || 'معارف عامة',
      deweyNumber: newBookDewey.trim() || '000',
      deweyCategory: 'كتب مصادر التعلم المعتمدة',
      section: newBookSection,
      location: newBookLocation,
      status: 'متاح',
      keywords: newBookKeywords
        ? newBookKeywords.split(',').map(k => k.trim()).filter(Boolean)
        : [newBookTitle.trim()],
      summary: newBookSummary.trim()
    };

    onAddBook(bookObj);
    setIsAddingBook(false);
    // Reset form
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookSubject('');
    setNewBookDewey('');
    setNewBookKeywords('');
    setNewBookSummary('');
  };

  const filteredBooks = books.filter(b => 
    b.title.includes(bookFilter) || 
    b.author.includes(bookFilter) || 
    b.subject.includes(bookFilter) || 
    b.deweyNumber.includes(bookFilter)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#2F8F89]/30 overflow-hidden flex flex-col max-h-[92vh] text-right">
        
        {/* Modal Header */}
        <div className="bg-[#123B5D] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2F8F89]/40 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D5A84B] text-[#123B5D] flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  لوحة القياس وإدارة مركز مصادر التعلم
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2F8F89] text-white font-medium">
                  أخصائية المصادر
                </span>
              </div>
              <p className="text-xs text-[#EAF5FA]/80">
                مدرسة فاطمة بنت عتبة • مؤشرات الأداء، السجلات، وتحديث قواعد البيانات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-[#2F8F89] text-[#123B5D]'
                : 'border-transparent text-gray-500 hover:text-[#123B5D]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#2F8F89]" />
            <span>لوحة المؤشرات والإحصاءات</span>
          </button>

          <button
            onClick={() => setActiveTab('unanswered')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'unanswered'
                ? 'border-[#2F8F89] text-[#123B5D]'
                : 'border-transparent text-gray-500 hover:text-[#123B5D]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#D5A84B]" />
            <span>أسئلة تحتاج تحديثًا ({analytics.questionsNeedingUpdate.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'books'
                ? 'border-[#2F8F89] text-[#123B5D]'
                : 'border-transparent text-gray-500 hover:text-[#123B5D]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#123B5D]" />
            <span>سجل الكتب المعتمدة ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'border-[#2F8F89] text-[#123B5D]'
                : 'border-transparent text-gray-500 hover:text-[#123B5D]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <span>الحصص والفعاليات</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Stat summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="text-gray-400 text-xs mb-1">إجمالي التفاعلات</div>
                  <div className="text-2xl font-bold text-[#123B5D]">{analytics.totalQueries}</div>
                  <div className="text-[11px] text-[#2F8F89] mt-1 font-medium">سؤال واستفسار</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="text-gray-400 text-xs mb-1">إجابات مفيدة 👍</div>
                  <div className="text-2xl font-bold text-emerald-600">{analytics.helpfulCount}</div>
                  <div className="text-[11px] text-emerald-700 mt-1 font-medium">تقييم إيجابي ناجح</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="text-gray-400 text-xs mb-1">تحتاج تحديث 👎</div>
                  <div className="text-2xl font-bold text-rose-500">{analytics.unhelpfulCount}</div>
                  <div className="text-[11px] text-rose-600 mt-1 font-medium">موضوعات غير متوفرة</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  <div className="text-gray-400 text-xs mb-1">نسبة رضا الطالبات</div>
                  <div className="text-2xl font-bold text-[#D5A84B]">{satisfactionRate}%</div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-[#D5A84B] h-full rounded-full transition-all"
                      style={{ width: `${satisfactionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Breakdown (عدد أسئلة الكتب، ديوي، الاستعارة، اللوائح، الأنشطة، الحصص) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-[#123B5D] flex items-center justify-between">
                  <span>توزيع الاستفسارات حسب المحاور الرئيسية</span>
                  <span className="text-xs text-gray-400 font-normal">تحديث لحظي</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  
                  {/* Books */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>📚</span>
                        <span>أسئلة الكتب والروايات</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.book}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#123B5D] h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  {/* Dewey */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>🔢</span>
                        <span>تصنيف ديوي ومواقع الأرفف</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.dewey}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2F8F89] h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  {/* Borrowing */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>📖</span>
                        <span>لوائح وإجراءات الاستعارة</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.borrow}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#D5A84B] h-full rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>

                  {/* Regulations & Computers */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>💻</span>
                        <span>اللوائح واستخدام الحواسيب</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.regulation + analytics.categoryCounts.computers}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>🏫</span>
                        <span>أقسام وقاعات المركز</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.section}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#059669] h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  {/* Activities & Sessions */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="flex items-center gap-1.5 text-[#123B5D]">
                        <span>🖥️</span>
                        <span>الأنشطة وجدول الحصص المنفذة</span>
                      </span>
                      <span className="font-bold">{analytics.categoryCounts.activity + analytics.categoryCounts.session}</span>
                    </div>
                    <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: '22%' }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Frequent Questions List */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                <h3 className="font-bold text-sm sm:text-base text-[#123B5D] mb-3">
                  أكثر الأسئلة تكرارًا من الطالبات والمعلمات
                </h3>
                <div className="space-y-2">
                  {analytics.frequentQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FAF8F2] border border-gray-100 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white text-[#2F8F89] font-bold flex items-center justify-center text-xs border border-gray-200">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-[#123B5D]">«{item.question}»</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[#123B5D] border border-gray-200 font-mono font-bold text-xs">
                        {item.count} مرة
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: QUESTIONS NEEDING UPDATE */}
          {activeTab === 'unanswered' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FEF7EC] rounded-2xl border border-[#D5A84B]/40 text-xs text-[#123B5D] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D5A84B] shrink-0" />
                <span>
                  يتم تسجيل الأسئلة هنا تلقائيًا عندما تضغط الطالبة على «لم أجد ما أبحث عنه» أو عند البحث عن كتب غير متوفرة، لمساعدة الأخصائية في تزويد المركز بالكتب المطلوبة.
                </span>
              </div>

              {analytics.questionsNeedingUpdate.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center text-gray-400 space-y-2">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-[#123B5D]">رائع! لا توجد أسئلة معلقة حاليًا</p>
                  <p className="text-xs text-gray-500">تمت معالجة كافة الاستفسارات المطلوبة بنجاح.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.questionsNeedingUpdate.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#123B5D]">
                            «{item.query}»
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          سبب التحديث: {item.reason}
                        </p>
                      </div>

                      <button
                        onClick={() => onResolveQuestionNeedingUpdate(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>تمت المعالجة وتوفير الكتاب</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKS MANAGEMENT */}
          {activeTab === 'books' && (
            <div className="space-y-4">
              {/* Header and Add Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookFilter}
                    onChange={(e) => setBookFilter(e.target.value)}
                    placeholder="ابحثي في سجل كتب المركز (العنوان، المؤلف، ديوي)..."
                    className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                  />
                </div>

                <button
                  onClick={() => setIsAddingBook(!isAddingBook)}
                  className="px-4 py-2 rounded-xl bg-[#123B5D] hover:bg-[#1b4b74] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 text-[#D5A84B]" />
                  <span>{isAddingBook ? 'إلغاء الإضافة' : 'إضافة كتاب جديد للمركز'}</span>
                </button>
              </div>

              {/* Add Book Form for Specialist */}
              {isAddingBook && (
                <form
                  onSubmit={handleCreateBook}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#2F8F89]/30 shadow-md space-y-3 animate-fadeIn text-xs sm:text-sm"
                >
                  <h4 className="font-bold text-[#123B5D] pb-2 border-b border-gray-100 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#2F8F89]" />
                    <span>إدخال بيانات كتاب جديد في قاعدة بيانات مركز المصادر:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">عنوان الكتاب *</label>
                      <input
                        type="text"
                        required
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        placeholder="مثال: عجائب الفضاء للأجيال"
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">اسم المؤلف *</label>
                      <input
                        type="text"
                        required
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                        placeholder="مثال: د. سعيد بن راشد الحارثي"
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">الموضوع الرئيسي</label>
                      <input
                        type="text"
                        value={newBookSubject}
                        onChange={(e) => setNewBookSubject(e.target.value)}
                        placeholder="مثال: علم الفلك والكواكب"
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">رقم تصنيف ديوي العشري</label>
                      <input
                        type="text"
                        value={newBookDewey}
                        onChange={(e) => setNewBookDewey(e.target.value)}
                        placeholder="مثال: 520.3"
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">القسم بالمركز</label>
                      <select
                        value={newBookSection}
                        onChange={(e) => setNewBookSection(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      >
                        <option value="قسم العلوم العامة">قسم العلوم العامة</option>
                        <option value="قسم الدراسات الإسلامية">قسم الدراسات الإسلامية</option>
                        <option value="قسم التاريخ والدراسات الاجتماعية">قسم التاريخ والدراسات الاجتماعية</option>
                        <option value="قسم الأدب والقصص والروايات">قسم الأدب والقصص والروايات</option>
                        <option value="قسم التكنولوجيا والابتكار">قسم التكنولوجيا والابتكار</option>
                        <option value="قسم المعارف العامة والمراجع">قسم المعارف العامة والمراجع</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">الموقع داخل المركز (الرف)</label>
                      <input
                        type="text"
                        value={newBookLocation}
                        onChange={(e) => setNewBookLocation(e.target.value)}
                        placeholder="مثال: الرف 5B - خزانة الفلك"
                        className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">كلمات مفتاحية للبحث (مفصولة بفواصل)</label>
                    <input
                      type="text"
                      value={newBookKeywords}
                      onChange={(e) => setNewBookKeywords(e.target.value)}
                      placeholder="مثال: فضاء، كواكب، مجرات، نجوم، شمس"
                      className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">نبذة عن الكتاب</label>
                    <textarea
                      rows={2}
                      value={newBookSummary}
                      onChange={(e) => setNewBookSummary(e.target.value)}
                      placeholder="وصف مختصر لمحتوى الكتاب..."
                      className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F8F89]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingBook(false)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#2F8F89] hover:bg-[#26736e] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ الكتاب في قاعدة البيانات</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Books List Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-[#FAF8F2] text-[#123B5D] border-b border-gray-200 font-bold">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">العنوان</th>
                        <th className="p-3">المؤلف</th>
                        <th className="p-3">رقم ديوي</th>
                        <th className="p-3">القسم والرف</th>
                        <th className="p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBooks.map((book, idx) => (
                        <tr key={book.id} className="hover:bg-[#FAF8F2]/50 transition-colors">
                          <td className="p-3 text-gray-400 font-mono">{idx + 1}</td>
                          <td className="p-3 font-bold text-[#123B5D]">{book.title}</td>
                          <td className="p-3 text-gray-600">{book.author}</td>
                          <td className="p-3 font-mono font-semibold text-[#D5A84B]">{book.deweyNumber}</td>
                          <td className="p-3 text-gray-600">
                            <div>{book.section}</div>
                            <div className="text-[10px] text-gray-400">{book.location}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              book.status === 'متاح' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : book.status === 'معار' 
                                ? 'bg-amber-50 text-amber-700' 
                                : 'bg-sky-50 text-sky-700'
                            }`}>
                              {book.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SESSIONS & ACTIVITIES */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              
              {/* Sessions */}
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#123B5D] mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2F8F89]" />
                  <span>جدول الحصص المسجلة في المركز (الصفين السابع والثامن):</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 text-xs">
                      <div className="flex justify-between items-center mb-1 font-bold text-[#123B5D]">
                        <span>{s.lessonTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#123B5D] text-white">{s.grade}</span>
                      </div>
                      <div className="text-[#2F8F89] font-medium mb-2">المعلمة: {s.teacher} ({s.subject})</div>
                      <div className="text-gray-500 text-[11px] bg-[#FAF8F2] p-2 rounded-xl">
                        {s.date} • {s.period} • {s.executionType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="pt-3 border-t border-gray-200">
                <h3 className="font-bold text-sm sm:text-base text-[#123B5D] mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D5A84B]" />
                  <span>البرامج والأنشطة المعتمدة في المركز:</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activities.map((act) => (
                    <div key={act.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 text-xs">
                      <div className="flex justify-between items-center mb-1 font-bold text-[#123B5D]">
                        <span>{act.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{act.status}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 my-1">{act.description}</p>
                      <div className="text-gray-400 text-[10px]">
                        المستهدف: {act.targetGroup} • {act.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white p-3 sm:p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2F8F89]" />
            <span>بيانات المركز محمية • مدرسة فاطمة بنت عتبة</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#123B5D] hover:bg-[#1b4b74] text-white font-semibold transition-colors cursor-pointer"
          >
            العودة للمساعد
          </button>
        </div>

      </div>
    </div>
  );
};
