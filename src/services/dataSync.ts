import { 
  Book, 
  LrcSession, 
  LrcActivity, 
  AnalyticsRecord 
} from '../types';
import { 
  DEWEY_CATEGORIES, 
  LRC_SECTIONS, 
  LRC_REGULATIONS 
} from '../data/initialData';

export interface FullBackupPayload {
  version: string;
  exportDate: string;
  schoolName: string;
  centerName: string;
  books: Book[];
  sessions: LrcSession[];
  activities: LrcActivity[];
  analytics: AnalyticsRecord;
}

/**
 * Generates ready-to-use TypeScript code for src/data/initialData.ts
 * containing the current active books, sessions, activities, and analytics.
 */
export function generateInitialDataTsCode(
  books: Book[],
  sessions: LrcSession[],
  activities: LrcActivity[],
  analytics: AnalyticsRecord
): string {
  const booksJson = JSON.stringify(books, null, 2);
  const sessionsJson = JSON.stringify(sessions, null, 2);
  const activitiesJson = JSON.stringify(activities, null, 2);
  const analyticsJson = JSON.stringify(analytics, null, 2);
  const deweyJson = JSON.stringify(DEWEY_CATEGORIES, null, 2);
  const sectionsJson = JSON.stringify(LRC_SECTIONS, null, 2);
  const regulationsJson = JSON.stringify(LRC_REGULATIONS, null, 2);

  return `// =========================================================================
// قاعدة بيانات مركز مصادر التعلم - مدرسة فاطمة بنت عتبة
// تم تحديث هذا الملف وحفظه للنشر على GitHub
// تاريخ الحفظ: ${new Date().toLocaleString('ar-EG')}
// =========================================================================

import { 
  Book, 
  DeweyMainCategory, 
  LrcSection, 
  LrcRegulation, 
  LrcActivity, 
  LrcSession,
  AnalyticsRecord 
} from '../types';

export const INITIAL_BOOKS: Book[] = ${booksJson};

export const DEWEY_CATEGORIES: DeweyMainCategory[] = ${deweyJson};

export const LRC_SECTIONS: LrcSection[] = ${sectionsJson};

export const LRC_REGULATIONS: LrcRegulation[] = ${regulationsJson};

export const LRC_ACTIVITIES: LrcActivity[] = ${activitiesJson};

export const LRC_SESSIONS: LrcSession[] = ${sessionsJson};

export const INITIAL_ANALYTICS: AnalyticsRecord = ${analyticsJson};
`;
}

/**
 * Triggers browser download for any text content
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads initialData.ts file ready to replace in the project repository
 */
export function downloadInitialDataTs(
  books: Book[],
  sessions: LrcSession[],
  activities: LrcActivity[],
  analytics: AnalyticsRecord
) {
  const tsCode = generateInitialDataTsCode(books, sessions, activities, analytics);
  downloadFile('initialData.ts', tsCode, 'application/typescript;charset=utf-8');
}

/**
 * Downloads complete JSON backup
 */
export function downloadJsonBackup(
  books: Book[],
  sessions: LrcSession[],
  activities: LrcActivity[],
  analytics: AnalyticsRecord
) {
  const payload: FullBackupPayload = {
    version: '1.2.0',
    exportDate: new Date().toISOString(),
    schoolName: 'مدرسة فاطمة بنت عتبة',
    centerName: 'مركز مصادر التعلم',
    books,
    sessions,
    activities,
    analytics
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  downloadFile(`lrc_data_backup_${new Date().toISOString().slice(0, 10)}.json`, jsonStr, 'application/json;charset=utf-8');
}

/**
 * Parses and validates an uploaded JSON backup file
 */
export function parseJsonBackup(jsonString: string): Partial<FullBackupPayload> {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('ملف النسخة الاحتياطية غير صالح.');
  }
  return {
    books: Array.isArray(parsed.books) ? parsed.books : undefined,
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : undefined,
    activities: Array.isArray(parsed.activities) ? parsed.activities : undefined,
    analytics: parsed.analytics && typeof parsed.analytics === 'object' ? parsed.analytics : undefined
  };
}

/**
 * Copies text safely to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
