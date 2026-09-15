import React from 'react';
import { LrcActivity } from '../../types';
import { Star, Calendar, Users, MapPin, CheckCircle, Clock, Award } from 'lucide-react';

interface ActivitiesCardProps {
  activities: LrcActivity[];
}

export const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ activities }) => {
  const getStatusBadge = (status: LrcActivity['status']) => {
    switch (status) {
      case 'جاري':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            نشاط جارٍ حاليًا
          </span>
        );
      case 'قادم':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            فعالية قادمة
          </span>
        );
      case 'مكتمل':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
            <Award className="w-3 h-3" />
            مكتمل
          </span>
        );
    }
  };

  return (
    <div className="w-full mt-3 space-y-3 text-right">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-2xl p-4 border border-[#2F8F89]/20 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold text-sm border border-[#D97706]/25 shrink-0">
                    ⭐
                  </span>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#123B5D]">
                      {act.title}
                    </h4>
                    <span className="text-[11px] text-gray-500">
                      إشراف: {act.coordinator}
                    </span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(act.status)}
                </div>
              </div>

              <p className="text-xs text-[#123B5D]/80 mt-2.5 leading-relaxed bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-100">
                {act.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-[#123B5D]">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Users className="w-3.5 h-3.5 text-[#2F8F89] shrink-0" />
                <span className="truncate">الفئة: {act.targetGroup}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#D5A84B] shrink-0" />
                <span className="truncate">{act.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
