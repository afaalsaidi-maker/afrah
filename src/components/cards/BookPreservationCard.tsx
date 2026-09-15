import React from 'react';
import { Heart, Sparkles, BookCheck, ShieldCheck } from 'lucide-react';

export const BookPreservationCard: React.FC = () => {
  const guidelines = [
    {
      emoji: '✍️',
      title: 'لا كتابة على الصفحات',
      desc: 'تجنب استخدام الأقلام أو التظليل أو وضع أي خطوط داخل الكتاب.'
    },
    {
      emoji: '📄',
      title: 'لا طي لأطراف الصفحات',
      desc: 'استخدمي فواصل الكتب الورقية الأنيقة بدلاً من طي زوايا الصفحات.'
    },
    {
      emoji: '🚫',
      title: 'لا تمزيق',
      desc: 'التعامل برفق مع الغلاف والصفحات وحمايتها من السوائل والأطعمة.'
    },
    {
      emoji: '📖',
      title: 'أُعيد الكتاب كما استلمته',
      desc: 'تسليم الكتاب بحالته الأصلية النظيفة ليبقى جاهزًا لزميلتك التالية.'
    }
  ];

  return (
    <div className="w-full mt-3 bg-white rounded-2xl p-4 sm:p-5 border border-[#2F8F89]/25 shadow-xs text-right space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#2F8F89]/15">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <h4 className="text-sm sm:text-base font-extrabold text-[#123B5D]">
            كتابي أمانة • إرشادات المحافظة على الكتب
          </h4>
        </div>
        <span className="text-[11px] font-semibold text-[#D5A84B] bg-[#FAF8F2] px-2.5 py-0.5 rounded-full border border-[#D5A84B]/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          ثقافة القراءة الواعية
        </span>
      </div>

      {/* 4 Guidelines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {guidelines.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#FAF8F2] border border-gray-100 flex items-start gap-2.5 hover:border-[#2F8F89]/30 transition-all"
          >
            <span className="text-xl shrink-0 select-none">{item.emoji}</span>
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-[#123B5D]">
                {item.title}
              </h5>
              <p className="text-[11px] text-[#123B5D]/75 mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Principle Quote */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#EAF5FA] via-[#FAF8F2] to-[#EEE9F8] border border-[#2F8F89]/20 text-center">
        <p className="text-xs sm:text-sm font-bold text-[#123B5D] leading-relaxed">
          «الكتاب ملك للجميع، والمحافظة عليه احترام للمعرفة وحق للقارئة التالية.» 🌷
        </p>
      </div>
    </div>
  );
};
