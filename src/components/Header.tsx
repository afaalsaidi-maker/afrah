import React from 'react';
import { Bot, Sparkles, BookOpen, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenDashboard: () => void;
  onResetChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDashboard, onResetChat }) => {
  return (
    <header className="w-full bg-[#123B5D] text-white shadow-md relative overflow-hidden border-b border-[#2F8F89]/30">
      {/* Subtle decorative geometric overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D5A84B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
          
          {/* Main School & Assistant Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            
            {/* Assistant glowing icon with gentle float animation */}
            <div className="relative group shrink-0 bot-float">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#2F8F89] via-[#D5A84B] to-[#123B5D] p-[2px] bot-glow flex items-center justify-center shadow-xl border border-[#D5A84B]/40 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#123B5D] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F8F89]/20 to-transparent pointer-events-none" />
                  <Bot className="w-9 h-9 sm:w-11 sm:h-11 text-[#D5A84B] drop-shadow-md" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F8F89] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2F8F89] border-2 border-[#123B5D]"></span>
              </span>
            </div>

            {/* Titles and Subtitles */}
            <div>
              {/* School & LRC Badges */}
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2F8F89]/25 text-[#EAF5FA] border border-[#2F8F89]/40 inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D5A84B]" />
                  <span>مدرسة فاطمة بنت عتبة</span>
                </span>
                <span className="text-[11px] font-medium text-[#D5A84B] px-2.5 py-0.5 rounded-full bg-[#D5A84B]/15 border border-[#D5A84B]/30">
                  مركز مصادر التعلم
                </span>
              </div>
              
              {/* 2. Main Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center md:justify-start gap-2.5 drop-shadow-xs">
                <span>«مرشد المعرفة الذكي»</span>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D5A84B] shrink-0" />
              </h1>

              {/* Slogan */}
              <p className="text-sm sm:text-base text-[#D5A84B] font-bold mt-1">
                «دليلك إلى الكتب والمصادر والخدمات»
              </p>

              {/* Subtitle 1 */}
              <p className="text-xs sm:text-sm text-[#EAF5FA] font-medium mt-1">
                «لديك سؤال؟ أنا هنا لأساعدك في الوصول إلى المعرفة داخل مركز مصادر التعلم»
              </p>

              {/* Subtitle 2 */}
              <p className="text-[11px] sm:text-xs text-[#EAF5FA]/80 mt-0.5 font-normal">
                اسألي عن كتاب، تصنيف، استعارة، قسم، لائحة، نشاط أو حصة
              </p>
            </div>
          </div>

          {/* Action buttons (New Chat & Discreet Administration Mode) */}
          <div className="flex items-center gap-2.5 shrink-0 self-center md:self-end">
            <button
              id="btn-reset-chat"
              onClick={onResetChat}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-[#EAF5FA] border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              title="بدء محادثة جديدة"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D5A84B]" />
              <span>محادثة جديدة</span>
            </button>

            {/* 10. Discreet Specialist Admin Button */}
            <button
              id="btn-open-dashboard"
              onClick={onOpenDashboard}
              className="px-3 py-2 text-[11px] font-semibold rounded-xl bg-[#123B5D] hover:bg-[#194b75] text-[#EAF5FA]/80 hover:text-white border border-[#2F8F89]/40 hover:border-[#2F8F89] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              title="إدارة المركز (خاص بالأخصائية)"
            >
              <span className="text-xs">⚙️</span>
              <span>إدارة المركز</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
