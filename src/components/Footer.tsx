import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 py-8 bg-[#123B5D] text-white text-center border-t border-[#2F8F89]/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D5A84B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-white tracking-wide">
          <BookOpen className="w-4 h-4 text-[#D5A84B]" />
          <span>مركز مصادر التعلم | مدرسة فاطمة بنت عتبة</span>
          <Sparkles className="w-3.5 h-3.5 text-[#2F8F89]" />
        </div>

        <p className="text-xs sm:text-sm text-[#EAF5FA]/80 tracking-widest font-medium">
          «اسألي • ابحثي • اكتشفي • تعلمي»
        </p>

        <div className="pt-2 text-[11px] text-[#EAF5FA]/50 flex items-center justify-center gap-1">
          <span>دليلك الذكي في المصادر • لخدمة طالبات الصفين السابع والثامن والمعلمات</span>
        </div>
      </div>
    </footer>
  );
};
