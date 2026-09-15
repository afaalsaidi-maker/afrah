import React from 'react';
import { MousePointerClick, FileEdit, BookOpenCheck, Undo2, ArrowLeft } from 'lucide-react';

export const BorrowStepsCard: React.FC = () => {
  const steps = [
    {
      stepNumber: '1',
      title: 'أختار',
      desc: 'انتقاء الكتاب المناسب من رفوف المركز بمساعدة الفهرس أو الأخصائية.',
      icon: <MousePointerClick className="w-5 h-5 text-[#2F8F89]" />,
      bg: 'bg-[#EAF5FA]',
      border: 'border-[#2F8F89]/30'
    },
    {
      stepNumber: '2',
      title: 'أسجّل',
      desc: 'تسجيل الاستعارة رسميًا لدى الأخصائية بواسطة الرقم المكتبي أو البطاقة.',
      icon: <FileEdit className="w-5 h-5 text-[#D5A84B]" />,
      bg: 'bg-[#FEF7EC]',
      border: 'border-[#D5A84B]/30'
    },
    {
      stepNumber: '3',
      title: 'أقرأ',
      desc: 'الاستمتاع بالقراءة الواعية والمحافظة التامة على نظافة وسلامة الكتاب.',
      icon: <BookOpenCheck className="w-5 h-5 text-[#8B5CF6]" />,
      bg: 'bg-[#EEE9F8]',
      border: 'border-[#8B5CF6]/30'
    },
    {
      stepNumber: '4',
      title: 'أُعيد',
      desc: 'إرجاع الكتاب في الموعد المحدد (خلال أسبوعين) ليتسنى لغيرك قراءته.',
      icon: <Undo2 className="w-5 h-5 text-[#10B981]" />,
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#10B981]/30'
    }
  ];

  return (
    <div className="w-full mt-3 bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs text-right">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h4 className="text-sm font-bold text-[#123B5D] flex items-center gap-2">
          <span>📖</span>
          <span>مسار الاستعارة الذكية في 4 خطوات:</span>
        </h4>
        <span className="text-[11px] font-semibold text-[#2F8F89] bg-[#EAF5FA] px-2.5 py-0.5 rounded-full border border-[#2F8F89]/30">
          استعارة كتابين لمدة أسبوعين
        </span>
      </div>

      {/* 4 Steps Horizontal Flow */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 relative">
        {steps.map((item, idx) => (
          <div
            key={item.stepNumber}
            className={`p-3 rounded-xl ${item.bg} border ${item.border} flex flex-col items-center text-center relative group transition-transform hover:-translate-y-0.5`}
          >
            {/* Step badge */}
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mb-2">
              {item.icon}
            </div>

            <div className="font-bold text-sm text-[#123B5D] mb-1 flex items-center gap-1">
              <span>{item.stepNumber}.</span>
              <span>{item.title}</span>
            </div>

            <p className="text-[11px] text-[#123B5D]/75 leading-relaxed">
              {item.desc}
            </p>

            {/* Direction arrow on desktop between steps */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-[#2F8F89]/40 pointer-events-none">
                <ArrowLeft className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span>✨ المعاجم والموسوعات الكبرى مخصصة للمطالعة الداخلية فقط</span>
        <span className="text-[#2F8F89] font-medium">أخصائية المصادر في خدمتكِ دائمًا</span>
      </div>
    </div>
  );
};
