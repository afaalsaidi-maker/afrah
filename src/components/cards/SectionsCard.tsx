import React from 'react';
import { LrcSection } from '../../types';
import { Presentation, BookOpen, Laptop, QrCode, Sparkles, GraduationCap, MapPin, Users, Check } from 'lucide-react';

interface SectionsCardProps {
  sections: LrcSection[];
}

export const SectionsCard: React.FC<SectionsCardProps> = ({ sections }) => {
  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-[#2F8F89]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#123B5D]" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-[#3B82F6]" />;
      case 'QrCode':
        return <QrCode className="w-5 h-5 text-[#D5A84B]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#8B5CF6]" />;
      case 'GraduationCap':
      default:
        return <GraduationCap className="w-5 h-5 text-[#10B981]" />;
    }
  };

  return (
    <div className="w-full mt-3 space-y-2.5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs hover:shadow-md transition-all text-right flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <span className="w-9 h-9 rounded-xl bg-[#EAF5FA] flex items-center justify-center border border-[#2F8F89]/25 shrink-0">
                  {getSectionIcon(sec.iconName)}
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#123B5D]">
                    {sec.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <MapPin className="w-3 h-3 text-rose-500 inline" />
                    <span>{sec.locationHint}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#123B5D]/85 mt-2.5 leading-relaxed bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-100">
                {sec.description}
              </p>

              {sec.equipment && sec.equipment.length > 0 && (
                <div className="mt-2.5 space-y-1">
                  <div className="text-[11px] font-semibold text-gray-500">التجهيزات المتوفرة:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#123B5D] flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-[#2F8F89]" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#2F8F89]">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {sec.capacity}
              </span>
              <span className="text-[10px] text-gray-400">مدرسة فاطمة بنت عتبة</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
