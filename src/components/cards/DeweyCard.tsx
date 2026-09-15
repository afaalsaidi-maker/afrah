import React, { useState } from 'react';
import { DeweyMainCategory } from '../../types';
import { DEWEY_CATEGORIES } from '../../data/initialData';
import { Binary, MapPin, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface DeweyCardProps {
  deweyInfo?: {
    mainCategory?: string;
    mainCode?: string;
    specificCode?: string;
    shelf?: string;
    advice?: string;
    list?: DeweyMainCategory[];
  };
}

export const DeweyCard: React.FC<DeweyCardProps> = ({ deweyInfo }) => {
  const [showFullSystem, setShowFullSystem] = useState(Boolean(deweyInfo?.list));
  const categories = deweyInfo?.list || DEWEY_CATEGORIES;

  return (
    <div className="w-full mt-3 bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs text-right">
      
      {/* Specific Target Location Box (if queried for specific topic like space or science) */}
      {deweyInfo?.mainCode && (
        <div className="mb-3 p-3.5 rounded-xl bg-gradient-to-r from-[#EAF5FA] to-[#FAF8F2] border border-[#2F8F89]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-[#123B5D] text-[#D5A84B] flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              {deweyInfo.mainCode}
            </span>
            <div>
              <div className="text-xs text-[#2F8F89] font-bold">
                {deweyInfo.mainCategory}
              </div>
              <div className="text-sm font-bold text-[#123B5D]">
                التصنيف التفصيلي: {deweyInfo.specificCode}
              </div>
              {deweyInfo.shelf && (
                <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 inline shrink-0" />
                  <span>موقع الرف بالمركز: <strong className="text-[#123B5D]">{deweyInfo.shelf}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-[#2F8F89] bg-white px-3 py-1.5 rounded-lg border border-[#2F8F89]/20 font-medium self-end sm:self-center">
            {deweyInfo.advice || 'اتبعي لوحة الأرقام الإرشادية'}
          </div>
        </div>
      )}

      {/* Main 10 Classes Table / Cards */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
        <h4 className="text-sm font-bold text-[#123B5D] flex items-center gap-2">
          <Binary className="w-4 h-4 text-[#2F8F89]" />
          <span>الأصول العشرة لتصنيف ديوي العشري (000 - 900):</span>
        </h4>
        <button
          type="button"
          onClick={() => setShowFullSystem(!showFullSystem)}
          className="text-xs font-semibold text-[#2F8F89] hover:text-[#123B5D] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{showFullSystem ? 'إخفاء الأقسام العشرة' : 'عرض جدول التصنيف كاملاً'}</span>
          {showFullSystem ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2F8F89]" />}
        </button>
      </div>

      {showFullSystem && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3">
          {categories.map((cat) => (
            <div
              key={cat.code}
              className="p-2.5 rounded-xl bg-[#FAF8F2] border border-gray-100 hover:border-[#2F8F89]/40 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-white text-[#123B5D] border border-gray-200">
                    {cat.code}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
                <h5 className="font-bold text-xs text-[#123B5D] leading-snug">
                  {cat.name}
                </h5>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-gray-200/50 text-[10px] text-[#2F8F89] font-medium flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{cat.shelfLocation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
