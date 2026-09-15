import React, { useState, useRef } from 'react';
import { Send, Sparkles, Search, Loader2 } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading, inputRef }) => {
  const [inputValue, setInputValue] = useState('');
  const localRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || localRef;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (exampleText: string) => {
    setInputValue(exampleText);
    if (isLoading) return;
    onSearch(exampleText);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pt-5 sm:pt-7 pb-2">
      {/* 3. Large, clear question box with white bg, subtle turquoise border, soft shadow */}
      <div className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-[#2F8F89]/35 p-4 sm:p-6 transition-all duration-300 relative overflow-hidden">
        
        {/* Subtle decorative top accent */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#123B5D] via-[#2F8F89] to-[#D5A84B]" />

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            
            {/* Input field */}
            <div className="relative flex-1">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2F8F89] pointer-events-none">
                <Search className="w-5 h-5 text-[#2F8F89]" />
              </div>
              <input
                id="main-assistant-search-input"
                ref={activeInputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ماذا تريدين أن تعرفي اليوم؟"
                disabled={isLoading}
                className="w-full pr-12 pl-4 py-3.5 sm:py-4 text-base sm:text-lg rounded-2xl bg-white border border-[#2F8F89]/30 text-[#123B5D] placeholder:text-[#123B5D]/45 focus:outline-none focus:ring-2 focus:ring-[#2F8F89]/30 focus:border-[#2F8F89] transition-all"
              />
            </div>

            {/* 3. Prominent, clear 'Ask Assistant' Button with elegant hover movement */}
            <button
              id="btn-ask-assistant"
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-7 py-3.5 sm:py-4 bg-[#123B5D] hover:bg-[#1a4f7c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-98 whitespace-nowrap min-h-[50px] cursor-pointer group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#D5A84B]">يبحث لكِ</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5A84B] dot-pulse-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5A84B] dot-pulse-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5A84B] dot-pulse-3" />
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-sm sm:text-base tracking-wide">اسألي المرشد</span>
                  <Send className="w-4 h-4 text-[#D5A84B] rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* 4. Three small clickable examples under the question box */}
          <div className="pt-1 px-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#123B5D]/80">
              <span className="text-[#2F8F89] font-bold shrink-0">أمثلة مقترحة:</span>
              
              <button
                type="button"
                id="example-prompt-prayer"
                onClick={() => handleExampleClick('هل يوجد كتاب عن الصلاة؟')}
                className="px-3 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#123B5D] border border-[#2F8F89]/25 hover:border-[#2F8F89] transition-all cursor-pointer font-medium hover:text-[#2F8F89] active:scale-95 shadow-2xs"
              >
                «هل يوجد كتاب عن الصلاة؟»
              </button>

              <button
                type="button"
                id="example-prompt-planets"
                onClick={() => handleExampleClick('أين أجد كتب الكواكب؟')}
                className="px-3 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#123B5D] border border-[#2F8F89]/25 hover:border-[#2F8F89] transition-all cursor-pointer font-medium hover:text-[#2F8F89] active:scale-95 shadow-2xs"
              >
                «أين أجد كتب الكواكب؟»
              </button>

              <button
                type="button"
                id="example-prompt-borrow"
                onClick={() => handleExampleClick('كيف أستعير كتابًا؟')}
                className="px-3 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#123B5D] border border-[#2F8F89]/25 hover:border-[#2F8F89] transition-all cursor-pointer font-medium hover:text-[#2F8F89] active:scale-95 shadow-2xs"
              >
                «كيف أستعير كتابًا؟»
              </button>
            </div>
          </div>
        </form>

        {/* 8. Custom waiting state: «مرشد المعرفة الذكي يبحث لكِ في مصادر المركز…» with animated dots */}
        {isLoading && (
          <div className="mt-3.5 py-2.5 px-4 bg-[#EAF5FA] rounded-2xl border border-[#2F8F89]/30 flex items-center justify-center gap-3 text-xs sm:text-sm text-[#123B5D]">
            <Sparkles className="w-4 h-4 text-[#D5A84B] animate-spin" />
            <span className="font-bold">مرشد المعرفة الذكي يبحث لكِ في مصادر المركز</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-3" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
