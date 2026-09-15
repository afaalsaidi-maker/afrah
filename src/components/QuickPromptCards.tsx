import React from 'react';
import { 
  BookOpen, 
  Binary, 
  BookmarkCheck, 
  Building2, 
  Laptop, 
  Star, 
  MonitorPlay 
} from 'lucide-react';

interface QuickCardItem {
  id: string;
  title: string;
  emoji: string;
  question: string;
  icon: React.ReactNode;
  bgClass: string;
  hoverBgClass: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

interface QuickPromptCardsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const QuickPromptCards: React.FC<QuickPromptCardsProps> = ({ onSelectPrompt }) => {
  const cards: QuickCardItem[] = [
    {
      id: 'card-books',
      title: 'البحث عن الكتب',
      emoji: '📚',
      question: 'هل يوجد كتاب عن موضوع معين؟',
      icon: <BookOpen className="w-5 h-5 text-[#123B5D]" />,
      bgClass: 'bg-[#EAF5FA]',
      hoverBgClass: 'hover:bg-[#dcedf9]',
      borderColor: 'border-[#2F8F89]/30',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#123B5D]'
    },
    {
      id: 'card-dewey',
      title: 'تصنيف ديوي',
      emoji: '🔢',
      question: 'أين أجد كتب العلوم؟',
      icon: <Binary className="w-5 h-5 text-[#8B5CF6]" />,
      bgClass: 'bg-[#F5F0FF]',
      hoverBgClass: 'hover:bg-[#ebe0ff]',
      borderColor: 'border-[#8B5CF6]/25',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#8B5CF6]'
    },
    {
      id: 'card-borrow',
      title: 'الاستعارة',
      emoji: '📖',
      question: 'كيف أستعير كتابًا؟',
      icon: <BookmarkCheck className="w-5 h-5 text-[#D5A84B]" />,
      bgClass: 'bg-[#FEF8ED]',
      hoverBgClass: 'hover:bg-[#fdeece]',
      borderColor: 'border-[#D5A84B]/35',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#D5A84B]'
    },
    {
      id: 'card-sections',
      title: 'أقسام المركز',
      emoji: '🏫',
      question: 'أين توجد قاعة التعلم التفاعلي؟',
      icon: <Building2 className="w-5 h-5 text-[#059669]" />,
      bgClass: 'bg-[#ECFDF5]',
      hoverBgClass: 'hover:bg-[#d8faea]',
      borderColor: 'border-[#059669]/25',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#059669]'
    },
    {
      id: 'card-regulations',
      title: 'اللوائح',
      emoji: '💻',
      question: 'ما قواعد استخدام الحاسوب؟',
      icon: <Laptop className="w-5 h-5 text-[#2563EB]" />,
      bgClass: 'bg-[#EFF6FF]',
      hoverBgClass: 'hover:bg-[#dbeafe]',
      borderColor: 'border-[#2563EB]/25',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#2563EB]'
    },
    {
      id: 'card-activities',
      title: 'البرامج والأنشطة',
      emoji: '⭐',
      question: 'ما نشاط هذا الأسبوع؟',
      icon: <Star className="w-5 h-5 text-[#D97706]" />,
      bgClass: 'bg-[#FFFBEB]',
      hoverBgClass: 'hover:bg-[#fef3c7]',
      borderColor: 'border-[#D97706]/30',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#D97706]'
    },
    {
      id: 'card-sessions',
      title: 'الحصص',
      emoji: '🖥️',
      question: 'ما الحصص المنفذة في المركز؟',
      icon: <MonitorPlay className="w-5 h-5 text-[#7C3AED]" />,
      bgClass: 'bg-[#F5F3FF]',
      hoverBgClass: 'hover:bg-[#ede9fe]',
      borderColor: 'border-[#7C3AED]/25',
      iconBg: 'bg-white shadow-xs',
      iconColor: 'text-[#7C3AED]'
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-[#123B5D] flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span>أسئلة سريعة شائعة</span>
        </h3>
        <span className="text-xs text-[#2F8F89] font-medium hidden sm:inline">
          اضغطي على أي بطاقة للإرسال المباشر
        </span>
      </div>

      {/* Responsive Grid: On mobile: 1 or 2 columns with large touch targets. On desktop: clean 7-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            id={`quick-card-${card.id}`}
            onClick={() => onSelectPrompt(card.question)}
            type="button"
            className={`group text-right p-3.5 sm:p-4 rounded-2xl ${card.bgClass} ${card.hoverBgClass} border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-97 flex flex-col justify-between cursor-pointer min-h-[110px] sm:min-h-[120px]`}
          >
            {/* Top row: Icon and Emoji */}
            <div className="flex items-center justify-between w-full mb-2.5">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                {card.icon}
              </div>
              <span className="text-base sm:text-lg" title={card.title}>
                {card.emoji}
              </span>
            </div>

            {/* Bottom: Title & Question */}
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#123B5D] leading-snug group-hover:text-[#2F8F89] transition-colors">
                {card.title}
              </div>
              <p className="text-[11px] sm:text-xs text-[#123B5D]/75 line-clamp-2 mt-1 leading-relaxed font-normal">
                «{card.question}»
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
