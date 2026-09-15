import React, { useState } from 'react';
import { 
  Book, 
  LrcSession, 
  LrcActivity, 
  AnalyticsRecord 
} from '../../types';
import { 
  downloadInitialDataTs, 
  downloadJsonBackup, 
  parseJsonBackup, 
  copyToClipboard, 
  generateInitialDataTsCode,
  FullBackupPayload
} from '../../services/dataSync';
import { 
  Download, 
  Upload, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  Calendar,
  Star,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface GitHubSyncTabProps {
  books: Book[];
  sessions: LrcSession[];
  activities: LrcActivity[];
  analytics: AnalyticsRecord;
  lastSavedTime?: string;
  onImportBackup: (data: Partial<FullBackupPayload>) => void;
  onResetToDefault?: () => void;
}

export const GitHubSyncTab: React.FC<GitHubSyncTabProps> = ({
  books,
  sessions,
  activities,
  analytics,
  lastSavedTime,
  onImportBackup,
  onResetToDefault
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);

  const handleDownloadTs = () => {
    downloadInitialDataTs(books, sessions, activities, analytics);
  };

  const handleDownloadJson = () => {
    downloadJsonBackup(books, sessions, activities, analytics);
  };

  const handleCopyCode = async () => {
    const code = generateInitialDataTsCode(books, sessions, activities, analytics);
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const handleCopyCommands = async () => {
    const cmds = `git add .\ngit commit -m "تحديث بيانات مركز المصادر وحفظ الصفحات"\ngit push origin main`;
    const success = await copyToClipboard(cmds);
    if (success) {
      setCopiedCommands(true);
      setTimeout(() => setCopiedCommands(false), 2500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseJsonBackup(text);
        onImportBackup(parsed);
        setImportStatus({
          type: 'success',
          message: `تم استيراد البيانات بنجاح! (${parsed.books?.length || 0} كتب، ${parsed.sessions?.length || 0} حصص، ${parsed.activities?.length || 0} فعاليات).`
        });
        setTimeout(() => setImportStatus(null), 5000);
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: `تعذر قراءة ملف النسخة الاحتياطية: ${err.message || 'الملف تالف'}`
        });
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* 1. Header Highlight Banner */}
      <div className="bg-gradient-to-r from-[#123B5D] to-[#1E5680] text-white p-5 sm:p-6 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-2xl bg-[#D5A84B]/20 text-[#D5A84B] flex items-center justify-center font-bold text-lg border border-[#D5A84B]/40">
                📦
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                حفظ التغييرات ونشر الموقع على GitHub (حفظ دائم)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>محفوظ تلقائيًا في المتصفح {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FAF8F2]/90 leading-relaxed max-w-3xl">
            كل كتاب جديد، حصة، أو نشاط تقومين بإضافته يُحفظ فوراً في المتصفح. 
            ولكي تظهر هذه التغييرات <strong className="text-[#D5A84B]">لكافة الطالبات والزائرات بشكل دائم عند فتح رابط GitHub Pages</strong>، 
            قومي بتنزيل ملف البيانات المُحدّث واستبداله في المستودع قبل رفع التعديلات.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#2F8F89]/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Live Current State Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] text-[#123B5D] flex items-center justify-center font-bold text-lg border border-gray-200">
            📚
          </div>
          <div>
            <div className="text-[11px] text-gray-400">الكتب المسجلة</div>
            <div className="text-lg font-bold text-[#123B5D]">{books.length} كتاب</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] text-[#2F8F89] flex items-center justify-center font-bold text-lg border border-gray-200">
            🖥️
          </div>
          <div>
            <div className="text-[11px] text-gray-400">الحصص المجدولة</div>
            <div className="text-lg font-bold text-[#2F8F89]">{sessions.length} حصة</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] text-[#D5A84B] flex items-center justify-center font-bold text-lg border border-gray-200">
            ⭐
          </div>
          <div>
            <div className="text-[11px] text-gray-400">الأنشطة والفعاليات</div>
            <div className="text-lg font-bold text-[#D5A84B]">{activities.length} فعالية</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] text-emerald-600 flex items-center justify-center font-bold text-lg border border-gray-200">
            ⚡
          </div>
          <div>
            <div className="text-[11px] text-gray-400">ملف البناء للـ Pages</div>
            <div className="text-xs font-bold text-emerald-700">جاهز ومتوافق ✓</div>
          </div>
        </div>
      </div>

      {/* Import / Feedback Banner */}
      {importStatus && (
        <div className={`p-4 rounded-2xl border flex items-center gap-2 text-xs sm:text-sm animate-fadeIn ${
          importStatus.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* 3. Primary Export Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Action 1: Download initialData.ts */}
        <div className="bg-white p-5 rounded-3xl border-2 border-[#2F8F89]/30 shadow-xs hover:border-[#2F8F89] transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#2F8F89]/10 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#EAF5FA] text-[#2F8F89] flex items-center justify-center mb-3">
              <FileCode className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm sm:text-base text-[#123B5D]">
                تنزيل ملف البيانات المُحدث
              </h4>
              <span className="text-[10px] bg-[#D5A84B]/20 text-[#123B5D] px-2 py-0.5 rounded-full font-bold">
                موصى به
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              يحمّل ملف <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">initialData.ts</code> كاملاً بجميع التعديلات، لتستبدلي به الملف في مشروعك على GitHub قبل الرفع.
            </p>
          </div>

          <button
            onClick={handleDownloadTs}
            className="w-full py-2.5 px-3 rounded-xl bg-[#2F8F89] hover:bg-[#257772] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>تحميل initialData.ts (جاهز للرفع)</span>
          </button>
        </div>

        {/* Action 2: Copy TypeScript Code */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs hover:border-[#123B5D]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <Copy className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-[#123B5D] mb-1">
              نسخ الكود بالكامل للحافظة
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              يمكنك نسخ الكود ولصقه مباشرة في ملف <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">src/data/initialData.ts</code> عبر محرر موقع GitHub.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
              copiedCode 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#123B5D] hover:bg-[#1a4f7c] text-white'
            }`}
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-[#D5A84B]" />
                <span>تم النسخ بنجاح! جاهز للصق</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D5A84B]" />
                <span>نسخ الكود البرمجي (TypeScript)</span>
              </>
            )}
          </button>
        </div>

        {/* Action 3: JSON Backup & Import */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs hover:border-[#D5A84B]/60 transition-all flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-[#123B5D] mb-1">
              نسخة احتياطية واستيراد (JSON)
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              حفظ جميع سجلات المركز كملف مستقل أو استيرادها على جهاز آخر لاسترجاع كل التعديلات فوراً.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadJson}
              className="py-2.5 px-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="تنزيل نسخة احتياطية بصيغة JSON"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>تنزيل JSON</span>
            </button>

            <label className="py-2.5 px-2 rounded-xl bg-[#FAF8F2] hover:bg-[#EAF5FA] text-[#123B5D] border border-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#2F8F89]" />
              <span>استيراد ملف</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

      </div>

      {/* 4. Step-by-Step GitHub Upload & Pages Guide */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h4 className="font-extrabold text-sm sm:text-base text-[#123B5D]">
              كيف ترفعين الموقع على GitHub مع حفظ كافة التغييرات على الصفحات؟
            </h4>
          </div>
          <span className="text-xs text-gray-400 font-medium">3 خطوات مبسطة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          
          {/* Step 1 */}
          <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-gray-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#2F8F89] text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h5 className="font-bold text-[#123B5D]">تحديث ملف البيانات</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              اضغطي على زر <strong className="text-[#2F8F89]">«تحميل initialData.ts»</strong> بالأعلى. 
              ضعي الملف المحمل داخل مجلد مشروعك في المسار:
              <br />
              <code className="inline-block mt-1 bg-white px-2 py-1 rounded border border-gray-200 font-mono text-[11px] text-[#123B5D] text-left" dir="ltr">
                src/data/initialData.ts
              </code>
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-gray-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#123B5D] text-[#D5A84B] font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h5 className="font-bold text-[#123B5D]">رفع التعديلات إلى GitHub</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              يمكنك الرفع بطريقتين:
              <br />
              <strong>أ) عبر المتصفح:</strong> ادخلي لمستودعك على GitHub، ثم ادخلي إلى <span dir="ltr">src/data</span> واضغطي <strong dir="ltr">Add file → Upload files</strong> واختاري الملف ثم اضغطي <strong dir="ltr">Commit changes</strong>.
              <br />
              <strong>ب) أو عبر سطر الأوامر (Git):</strong>
            </p>
            <div className="bg-[#123B5D] text-emerald-300 p-2 rounded-xl font-mono text-[11px] flex items-center justify-between" dir="ltr">
              <code>git add . && git commit -m "update" && git push</code>
              <button
                onClick={handleCopyCommands}
                className="text-white hover:text-[#D5A84B] cursor-pointer p-1"
                title="نسخ الأوامر"
              >
                {copiedCommands ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-gray-200/80 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#D5A84B] text-[#123B5D] font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h5 className="font-bold text-[#123B5D]">النشر على GitHub Pages بدون أخطاء</h5>
            <p className="text-gray-600 leading-relaxed text-xs">
              في إعدادات مستودعك على GitHub:
              <br />
              <strong dir="ltr">Settings → Pages → Source: GitHub Actions</strong>
              <br />
              وسيتم بناء ونشر الموقع تلقائيًا عبر ملف البناء المرفق <code className="font-mono bg-white px-1 py-0.5 rounded text-[10px]">deploy.yml</code>.
            </p>
          </div>

        </div>

        {/* White screen diagnostic helper */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>إذا ظهرت لكِ صفحة بيضاء بعد فتح رابط GitHub Pages:</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            السبب الأكثر شيوعاً هو اختيار <strong>Deploy from a branch</strong> بدلاً من <strong>GitHub Actions</strong> في إعدادات الصفحات:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-amber-900 pr-1">
            <li>
              ادخلي لمستودعك على موقع GitHub واضغطي على <strong>Settings</strong> أعلى الصفحة.
            </li>
            <li>
              من القائمة الجانبية اليسرى اختاري <strong>Pages</strong>.
            </li>
            <li>
              تحت خيار <strong>Build and deployment</strong>، عند خانة <strong>Source</strong>: بدّلي الاختيار من <span dir="ltr" className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">Deploy from a branch</span> إلى <strong dir="ltr" className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-[11px]">GitHub Actions</strong>.
            </li>
            <li>
              توجّهي إلى تبويب <strong>Actions</strong> بالأعلى وستجدين مسار البناء يعمل، وبمجرد انتهاء العلامة الخضراء (✓) افتحي الرابط وستعمل الصفحة بشكل كامل وسليم!
            </li>
          </ol>
        </div>

        {/* Code Preview Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowCodePreview(!showCodePreview)}
            className="text-xs text-[#2F8F89] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{showCodePreview ? 'إخفاء معاينة الكود البرمجي المحدث' : 'معاينة كود TypeScript المحدث قبل التحميل'}</span>
          </button>

          {showCodePreview && (
            <div className="mt-3 bg-[#123B5D] text-gray-200 p-4 rounded-2xl text-xs font-mono max-h-60 overflow-y-auto" dir="ltr">
              <pre>{generateInitialDataTsCode(books, sessions, activities, analytics).slice(0, 1500)}
              {'\n... (باقي البيانات مضمنة تلقائياً في الملف)'}</pre>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
