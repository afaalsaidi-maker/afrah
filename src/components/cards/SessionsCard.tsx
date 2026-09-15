import React from 'react';
import { LrcSession } from '../../types';
import { Calendar, Clock, School, BookMarked, UserCheck, Presentation, Wrench, Sparkles } from 'lucide-react';

interface SessionsCardProps {
  sessions: LrcSession[];
}

export const SessionsCard: React.FC<SessionsCardProps> = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="w-full mt-3 space-y-3 text-right">
      <div className="grid grid-cols-1 gap-3">
        {sessions.map((ses) => (
          <div
            key={ses.id}
            className="bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#EAF5FA] text-[#123B5D] flex items-center justify-center font-bold text-sm border border-[#2F8F89]/30">
                  🖥️
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#123B5D]">
                    {ses.lessonTitle}
                  </h4>
                  <div className="text-xs text-[#2F8F89] font-medium flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 inline" />
                    <span>المعلمة: {ses.teacher}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#123B5D] text-white">
                  {ses.grade}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D5A84B]/20 text-[#123B5D] border border-[#D5A84B]/30">
                  {ses.subject}
                </span>
              </div>
            </div>

            {/* Session Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs text-[#123B5D]/85">
              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-gray-100">
                <div className="text-gray-400 text-[10px] flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3 text-[#2F8F89]" />
                  <span>التاريخ</span>
                </div>
                <div className="font-semibold text-[11px] truncate">{ses.date}</div>
              </div>

              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-gray-100">
                <div className="text-gray-400 text-[10px] flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-[#D5A84B]" />
                  <span>الحصة</span>
                </div>
                <div className="font-semibold text-[11px] truncate">{ses.period}</div>
              </div>

              <div className="bg-[#FAF8F2] p-2 rounded-xl border border-gray-100 col-span-2 sm:col-span-2">
                <div className="text-gray-400 text-[10px] flex items-center gap-1 mb-0.5">
                  <Presentation className="w-3 h-3 text-[#8B5CF6]" />
                  <span>نوع التنفيذ</span>
                </div>
                <div className="font-semibold text-[11px] truncate">{ses.executionType}</div>
              </div>
            </div>

            {/* Tools and Activity */}
            <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#2F8F89] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-500 ml-1">الأدوات المستخدمة:</span>
                  <span className="text-[#123B5D]">{ses.tools.join('، ')}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 bg-[#FAF8F2] p-2 rounded-xl border border-gray-100">
                <Sparkles className="w-3.5 h-3.5 text-[#D5A84B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#123B5D] ml-1">النشاط المنفذ:</span>
                  <span className="text-[#123B5D]/80">{ses.activity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
