import React from 'react';
import { Search, Monitor, Shield, LogOut, Clock } from 'lucide-react';

export const ComputerRulesCard: React.FC = () => {
  const rules = [
    {
      emoji: '🔎',
      title: 'للبحث والتعلم',
      detail: 'استخدام الجهاز للمشاريع التعليمية والبحوث والواجبات المدرسية المعتمدة.',
      icon: <Search className="w-4 h-4 text-[#2F8F89]" />,
      bg: 'bg-[#EAF5FA]'
    },
    {
      emoji: '🖥️',
      title: 'المحافظة على الجهاز',
      detail: 'التعامل برفق مع الشاشة ولوحة المفاتيح والفأرة وعدم تحريك الأسلاك.',
      icon: <Monitor className="w-4 h-4 text-[#123B5D]" />,
      bg: 'bg-[#FAF8F2]'
    },
    {
      emoji: '🔐',
      title: 'حماية الخصوصية',
      detail: 'عدم حفظ كلمات المرور أو فتح الحسابات الشخصية غير المدرسية.',
      icon: <Shield className="w-4 h-4 text-[#D5A84B]" />,
      bg: 'bg-[#FEF7EC]'
    },
    {
      emoji: '🚪',
      title: 'تسجيل الخروج',
      detail: 'إغلاق كافة النوافذ والبرامج وتسجيل الخروج عند الانتهاء.',
      icon: <LogOut className="w-4 h-4 text-[#8B5CF6]" />,
      bg: 'bg-[#EEE9F8]'
    },
    {
      emoji: '⏱️',
      title: 'احترام وقت الآخرين',
      detail: 'الالتزام بالوقت المخصص (30 دقيقة عند الازدحام) لإفساح المجال لزميلاتك.',
      icon: <Clock className="w-4 h-4 text-[#EF4444]" />,
      bg: 'bg-[#FEE2E2]/60'
    }
  ];

  return (
    <div className="w-full mt-3 bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs text-right">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h4 className="text-sm font-bold text-[#123B5D] flex items-center gap-2">
          <span>💻</span>
          <span>قواعد استخدام أجهزة الحاسوب في المركز (5 قواعد أساسية):</span>
        </h4>
        <span className="text-[11px] font-semibold text-[#123B5D] bg-[#FAF8F2] px-2.5 py-0.5 rounded-full border border-gray-200">
          ركن البحث الرقمي
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3">
        {rules.map((rule, idx) => (
          <div
            key={rule.title}
            className={`p-3 rounded-xl ${rule.bg} border border-black/5 flex items-start gap-2.5 transition-all hover:shadow-xs`}
          >
            <span className="text-xl shrink-0 select-none">{rule.emoji}</span>
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-[#123B5D]">
                {rule.title}
              </h5>
              <p className="text-[11px] text-[#123B5D]/75 mt-0.5 leading-snug">
                {rule.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
