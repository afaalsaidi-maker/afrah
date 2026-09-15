import React, { useState } from 'react';
import { Book } from '../../types';
import { BookOpen, MapPin, Tag, Binary, CheckCircle2, AlertCircle, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';

interface BookResultsCardProps {
  books: Book[];
}

export const BookResultsCard: React.FC<BookResultsCardProps> = ({ books }) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  if (!books || books.length === 0) return null;

  const displayBooks = showAll ? books : books.slice(0, 3);
  const hasMore = books.length > 3;

  const getStatusBadge = (status: Book['status']) => {
    switch (status) {
      case 'متاح':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            متاح للاستعارة
          </span>
        );
      case 'معار':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            معار حاليًا
          </span>
        );
      case 'للقراءة الداخلية فقط':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            <Bookmark className="w-3 h-3" />
            للقراءة الداخلية فقط
          </span>
        );
    }
  };

  return (
    <div className="w-full mt-3 space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {displayBooks.map((book) => {
          const isSummaryOpen = expandedSummaryId === book.id;

          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs hover:shadow-md transition-all text-right relative overflow-hidden"
            >
              {/* Top Accent Strip with Dewey category */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#EAF5FA] text-[#123B5D] flex items-center justify-center font-bold text-xs border border-[#2F8F89]/30">
                    📖
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#123B5D]">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#123B5D]/75">
                      ✍️ المؤلف: <span className="font-medium text-[#123B5D]">{book.author}</span>
                      {book.year && <span className="text-gray-400 mr-2 font-normal">({book.year})</span>}
                    </p>
                  </div>
                </div>

                <div>
                  {getStatusBadge(book.status)}
                </div>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 text-xs text-[#123B5D]/85">
                <div className="flex items-center gap-2 bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-gray-100">
                  <Tag className="w-3.5 h-3.5 text-[#2F8F89] shrink-0" />
                  <span className="font-semibold text-gray-500">الموضوع:</span>
                  <span className="truncate">{book.subject}</span>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-gray-100">
                  <Binary className="w-3.5 h-3.5 text-[#D5A84B] shrink-0" />
                  <span className="font-semibold text-gray-500">رقم ديوي:</span>
                  <span className="font-mono font-bold text-[#123B5D] px-1.5 py-0.5 rounded bg-white border border-[#D5A84B]/40">
                    {book.deweyNumber}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate">({book.deweyCategory.split('-')[0]})</span>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-gray-100">
                  <BookOpen className="w-3.5 h-3.5 text-[#123B5D] shrink-0" />
                  <span className="font-semibold text-gray-500">القسم:</span>
                  <span className="truncate">{book.section}</span>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF8F2] px-3 py-1.5 rounded-xl border border-gray-100 text-[#123B5D]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-semibold text-gray-500">الموقع بالمركز:</span>
                  <span className="font-bold text-[#123B5D] truncate">{book.location}</span>
                </div>
              </div>

              {/* Summary expander */}
              {book.summary && (
                <div className="mt-2.5 pt-2 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setExpandedSummaryId(isSummaryOpen ? null : book.id)}
                    className="text-[11px] font-medium text-[#2F8F89] hover:text-[#123B5D] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{isSummaryOpen ? 'إخفاء نبذة الكتاب' : 'عرض نبذة عن الكتاب'}</span>
                    {isSummaryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isSummaryOpen && (
                    <p className="text-xs text-[#123B5D]/80 mt-1.5 p-2.5 rounded-xl bg-[#EAF5FA]/60 border border-[#2F8F89]/15 leading-relaxed">
                      {book.summary}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more button if > 3 */}
      {hasMore && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 rounded-xl bg-[#EAF5FA] hover:bg-[#d8edf7] text-[#123B5D] font-semibold text-xs border border-[#2F8F89]/30 transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#2F8F89]" />
                <span>عرض أقل (إظهار أول 3 نتائج)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#2F8F89]" />
                <span>عرض المزيد ({books.length - 3} كتب إضافية)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
