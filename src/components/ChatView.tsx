import React from 'react';
import { AssistantMessage } from '../types';
import { Bot, User, ThumbsUp, ThumbsDown, Sparkles, MessageCircleQuestion, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookResultsCard } from './cards/BookResultsCard';
import { BorrowStepsCard } from './cards/BorrowStepsCard';
import { ComputerRulesCard } from './cards/ComputerRulesCard';
import { BookPreservationCard } from './cards/BookPreservationCard';
import { DeweyCard } from './cards/DeweyCard';
import { SectionsCard } from './cards/SectionsCard';
import { SessionsCard } from './cards/SessionsCard';
import { ActivitiesCard } from './cards/ActivitiesCard';

interface ChatViewProps {
  messages: AssistantMessage[];
  isLoading?: boolean;
  onSelectSuggestion: (promptText: string) => void;
  onRateFeedback: (messageId: string, rating: 'helpful' | 'unhelpful') => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading = false,
  onSelectSuggestion,
  onRateFeedback
}) => {
  const handleFeedback = (msgId: string, rating: 'helpful' | 'unhelpful') => {
    onRateFeedback(msgId, rating);
    if (rating === 'helpful') {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#2F8F89', '#D5A84B', '#123B5D']
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-5 space-y-4 sm:space-y-6">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';

        if (isUser) {
          return (
            <div
              key={msg.id}
              className="flex items-start justify-end gap-3 text-right"
            >
              <div className="max-w-[85%] sm:max-w-[75%] bg-[#123B5D] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs border border-[#123B5D]">
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </p>
                <div className="text-[10px] text-[#EAF5FA]/60 mt-1 font-mono text-left">
                  {msg.timestamp}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#2F8F89] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            </div>
          );
        }

        // 7. Bot Answer Card: Bot icon, «إجابة دليلك الذكي», answer, follow-ups, feedback buttons
        return (
          <div
            key={msg.id}
            className="flex items-start justify-start gap-3 text-right"
          >
            {/* 🤖 Bot Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#2F8F89] to-[#123B5D] p-0.5 flex items-center justify-center shrink-0 shadow-sm border border-[#D5A84B]/30 mt-0.5">
              <div className="w-full h-full bg-[#123B5D] rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#D5A84B]" />
              </div>
            </div>

            {/* Answer Content Card */}
            <div className="flex-1 max-w-full sm:max-w-[92%] bg-white rounded-3xl rounded-tl-xs p-4 sm:p-6 border border-[#2F8F89]/25 shadow-sm text-right space-y-3.5">
              
              {/* Header: Title «إجابة مرشد المعرفة الذكي» */}
              <div className="flex items-center justify-between border-b border-[#2F8F89]/15 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#123B5D]">
                    «إجابة مرشد المعرفة الذكي»
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D5A84B]" />
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {/* Bot Text Response */}
              <div className="text-sm sm:text-base text-[#123B5D] leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              {/* Specific Visual Content Type Cards */}
              {msg.books && msg.books.length > 0 && (
                <BookResultsCard books={msg.books} />
              )}

              {msg.borrowSteps && (
                <BorrowStepsCard />
              )}

              {msg.bookPreservation && (
                <BookPreservationCard />
              )}

              {msg.computerRules && (
                <ComputerRulesCard />
              )}

              {msg.deweyInfo && (
                <DeweyCard deweyInfo={msg.deweyInfo} />
              )}

              {msg.sectionResults && msg.sectionResults.length > 0 && (
                <SectionsCard sections={msg.sectionResults} />
              )}

              {msg.sessionResults && msg.sessionResults.length > 0 && (
                <SessionsCard sessions={msg.sessionResults} />
              )}

              {msg.activityResults && msg.activityResults.length > 0 && (
                <ActivitiesCard activities={msg.activityResults} />
              )}

              {/* 9. Smart Follow-Up Suggestions Section: «قد يفيدك أيضًا» (2-3 questions) */}
              {msg.followUps && msg.followUps.length > 0 && (
                <div className="pt-2.5 border-t border-gray-100">
                  <div className="text-xs font-bold text-[#123B5D] mb-2 flex items-center gap-1.5">
                    <MessageCircleQuestion className="w-3.5 h-3.5 text-[#2F8F89]" />
                    <span>قد يفيدك أيضًا:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.followUps.slice(0, 3).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectSuggestion(suggestion)}
                        className="text-xs px-3.5 py-1.5 rounded-full bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#123B5D] border border-[#2F8F89]/25 hover:border-[#2F8F89] transition-all cursor-pointer text-right flex items-center gap-1.5 active:scale-95 font-medium shadow-2xs"
                      >
                        <span className="text-[#2F8F89]">✦</span>
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Bottom Evaluation: 👍 «أفادتني» / 👎 «لم أجد ما أبحث عنه» */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span className="text-[11px] text-[#123B5D]/65 font-medium">
                  هل أفادتكِ هذه الإجابة؟
                </span>

                {msg.feedback ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {msg.feedback === 'helpful' ? 'شكرًا لتقييمكِ الرائع 🌷' : 'تم تسجيل ملاحظتكِ لتحديث قاعدة البيانات 📝'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-helpful-${msg.id}`}
                      type="button"
                      onClick={() => handleFeedback(msg.id, 'helpful')}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F2] hover:bg-emerald-50 text-[#123B5D] hover:text-emerald-700 border border-[#2F8F89]/20 hover:border-emerald-300 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>أفادتني</span>
                    </button>

                    <button
                      id={`btn-unhelpful-${msg.id}`}
                      type="button"
                      onClick={() => handleFeedback(msg.id, 'unhelpful')}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F2] hover:bg-rose-50 text-[#123B5D] hover:text-rose-700 border border-[#2F8F89]/20 hover:border-rose-300 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                      <span>لم أجد ما أبحث عنه</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* 8. Dedicated Assistant Waiting State in Chat: «دليلك الذكي يبحث لك في مصادر المركز…» with animated dots */}
      {isLoading && (
        <div className="flex items-start justify-start gap-3 text-right animate-fadeIn">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#2F8F89] to-[#123B5D] p-0.5 flex items-center justify-center shrink-0 shadow-sm border border-[#D5A84B]/30 mt-0.5">
            <div className="w-full h-full bg-[#123B5D] rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#D5A84B] animate-pulse" />
            </div>
          </div>

          <div className="flex-1 max-w-full sm:max-w-[92%] bg-white rounded-3xl rounded-tl-xs p-4 sm:p-5 border border-[#2F8F89]/25 shadow-sm space-y-2.5">
            <div className="flex items-center gap-1.5 border-b border-[#2F8F89]/15 pb-2">
              <span className="font-bold text-xs sm:text-sm text-[#123B5D]">
                «إجابة مرشد المعرفة الذكي»
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#D5A84B]" />
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#123B5D] font-semibold py-2">
              <Sparkles className="w-4 h-4 text-[#D5A84B] animate-spin shrink-0" />
              <span>مرشد المعرفة الذكي يبحث لكِ في مصادر المركز</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F89] dot-pulse-3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
