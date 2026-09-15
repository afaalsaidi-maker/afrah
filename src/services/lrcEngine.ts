import { 
  Book, 
  DeweyMainCategory, 
  LrcSection, 
  LrcRegulation, 
  LrcActivity, 
  LrcSession,
  AssistantMessage,
  QueryCategory 
} from '../types';
import { 
  DEWEY_CATEGORIES, 
  LRC_SECTIONS, 
  LRC_REGULATIONS, 
  LRC_ACTIVITIES, 
  LRC_SESSIONS 
} from '../data/initialData';

// Normalized Arabic text cleaner for accurate matching
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove harakat (tashkeel)
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[؟?.,!]/g, '')
    .replace(/\s+/g, ' ');
}

// Synonyms map to empower conceptual search without hallucination
const SYNONYMS_MAP: Record<string, string[]> = {
  كواكب: ['فضاء', 'فلك', 'نجوم', 'نظام شمسي', 'مجرة', 'كون', 'قمر', 'شمس'],
  فضاء: ['كواكب', 'فلك', 'نجوم', 'نظام شمسي', 'مجرة', 'سماء'],
  فلك: ['كواكب', 'فضاء', 'نجوم', 'مجرة', 'رصد'],
  نجوم: ['فضاء', 'كواكب', 'فلك', 'نظام شمسي'],
  صلاة: ['صلاه', 'وضوء', 'فقه', 'عبادات', 'اركان', 'طهارة', 'سنن', 'مسافر'],
  قران: ['ايات', 'قصص', 'تفسير', 'انبياء', 'مصحف'],
  تاريخ: ['حضارة', 'عمان', 'ماضي', 'قلاع', 'حصون', 'ملاحة', 'سلاطين'],
  عمان: ['سلطنة', 'تراث', 'بهلاء', 'تاريخ', 'افلاج', 'بحرية', 'عمانيات'],
  شعر: ['قصائد', 'شعراء', 'قصيده', 'ديوان', 'بلاغة', 'ادب'],
  قصص: ['روايات', 'حكايات', 'اساطير', 'مغامرة', 'مغامرات', 'قصة'],
  رواية: ['روايات', 'قصص', 'حكايات', 'مغامرة', 'ادب'],
  علوم: ['احياء', 'فيزياء', 'كيمياء', 'تجارب', 'فلك', 'طبيعة', 'طبيعية'],
  حاسوب: ['كمبيوتر', 'برمجة', 'ذكاء اصطناعي', 'روبوت', 'تقنية', 'رقمي', 'انترنت', 'سيبراني'],
  روبوت: ['ذكاء اصطناعي', 'تقنية', 'برمجة', 'حاسوب', 'اتمتة'],
  ذكاء: ['ذكاء اصطناعي', 'روبوت', 'تقنية', 'حاسوب', 'برمجة']
};

export interface ProcessQueryResult {
  replyText: string;
  category: QueryCategory;
  books?: Book[];
  totalBooksFound?: number;
  deweyInfo?: {
    mainCategory?: string;
    mainCode?: string;
    specificCode?: string;
    shelf?: string;
    advice?: string;
    list?: DeweyMainCategory[];
  };
  borrowSteps?: boolean;
  bookPreservation?: boolean;
  sectionResults?: LrcSection[];
  regulationResults?: LrcRegulation[];
  computerRules?: boolean;
  activityResults?: LrcActivity[];
  sessionResults?: LrcSession[];
  followUps: string[];
}

export function processUserQuery(
  rawQuery: string, 
  booksDatabase: Book[], 
  sessionsDatabase: LrcSession[] = LRC_SESSIONS, 
  activitiesDatabase: LrcActivity[] = LRC_ACTIVITIES
): ProcessQueryResult {
  const norm = normalizeArabic(rawQuery);
  const currentSessions = sessionsDatabase && sessionsDatabase.length > 0 ? sessionsDatabase : LRC_SESSIONS;
  const currentActivities = activitiesDatabase && activitiesDatabase.length > 0 ? activitiesDatabase : LRC_ACTIVITIES;

  // 1. Check for Out-of-Scope (Non-LRC matters: cooking, football matches, politics, external games, weather outside school, etc.)
  const outOfScopePatterns = [
    'طبخ', 'اكلات', 'حلويات', 'كرة قدم', 'مباراة', 'ريال مدريد', 'برشلونة', 
    'سياسة', 'حرب', 'اغاني', 'مكياج', 'تسوق', 'سعر الدولار', 'طقس اليوم في مسقط',
    'نكتة', 'لعبة فيديو', 'ببجي', 'ماين كرافت'
  ];
  if (outOfScopePatterns.some(p => norm.includes(p))) {
    return {
      replyText: 'أنا مرشد المعرفة الذكي 📚\nومتخصص في خدمات مركز مصادر التعلم.\n\nيمكنني مساعدتك في الكتب والتصنيف والاستعارة والأقسام واللوائح والأنشطة والحصص.',
      category: 'out_of_scope',
      followUps: [
        'هل يوجد كتاب عن الصلاة؟',
        'أين أجد كتب العلوم؟',
        'كيف أستعير كتابًا؟'
      ]
    };
  }

  // 2. Borrowing (الاستعارة)
  if (
    norm.includes('استعير') || 
    norm.includes('استعاره') || 
    norm.includes('اعير') || 
    norm.includes('ارجاع كتاب') || 
    norm.includes('شروط الاستعاره') ||
    norm.includes('كيف استعير') ||
    norm.includes('طريقة الاستعاره')
  ) {
    return {
      replyText: 'بكل سرور 🌷 إليكِ خطوات الاستعارة في مركز مصادر التعلم:\n\nأختار ← أسجّل ← أقرأ ← أُعيد\n\nنتبع أربع خطوات أساسية وبسيطة لتستمتعي بالقراءة النافعة:',
      category: 'borrow',
      borrowSteps: true,
      followUps: [
        'كيف أحافظ على الكتاب؟',
        'هل يوجد كتاب عن الصلاة؟',
        'أين أجد كتب الكواكب؟'
      ]
    };
  }

  // 3. Computers usage rules (استخدام الحواسيب)
  if (
    norm.includes('حاسوب') || 
    norm.includes('حواسيب') || 
    norm.includes('كمبيوتر') || 
    norm.includes('اجهزة') || 
    norm.includes('انترنت المركز') ||
    norm.includes('قواعد الحاسوب')
  ) {
    return {
      replyText: 'أرشدك إليها بكل سهولة ✨ إليكِ إرشادات استخدام الحاسوب في المركز:\n\n🔎 للبحث والتعلم.\n🖥️ المحافظة على الجهاز.\n🔐 حماية الخصوصية.\n🚪 تسجيل الخروج.\n⏱️ احترام وقت الآخرين.',
      category: 'computers',
      computerRules: true,
      followUps: [
        'أين يقع ركن البحث الرقمي؟',
        'أين توجد قاعة التعلم التفاعلي؟',
        'كيف أحافظ على الكتاب؟'
      ]
    };
  }

  // 4. Book Preservation (المحافظة على الكتب - كتابي أمانة)
  if (
    norm.includes('احافظ') || 
    norm.includes('المحافظه') || 
    norm.includes('كتابي امانه') || 
    norm.includes('حمايه الكتاب') ||
    norm.includes('العناية بالكتب')
  ) {
    return {
      replyText: 'بكل سرور 🌷 إليكِ إرشادات المحافظة على الكتب:\n\n📚 كتابي أمانة\n\n✍️ لا كتابة على الصفحات.\n📄 لا طي لأطراف الصفحات.\n🚫 لا تمزيق.\n📖 أُعيد الكتاب كما استلمته.\n\n«الكتاب ملك للجميع، والمحافظة عليه احترام للمعرفة وحق للقارئة التالية.»',
      category: 'regulation',
      bookPreservation: true,
      followUps: [
        'كيف أستعير كتابًا؟',
        'ما قواعد استخدام الحاسوب؟',
        'هل يوجد كتاب عن الصلاة؟'
      ]
    };
  }

  // 4b. Other Regulations and Guidelines (اللوائح والإرشادات العامة)
  if (
    norm.includes('لائحة') || 
    norm.includes('لوائح') || 
    norm.includes('ارشادات') || 
    norm.includes('قوانين المركز') || 
    norm.includes('اداب المركز')
  ) {
    const bookCareReg = LRC_REGULATIONS.find(r => r.id === 'reg-book-care');
    return {
      replyText: 'بكل سرور 🌷 إليكِ إرشادات المحافظة على الكتب داخل وخارج المركز:\n\n📚 كتابي أمانة\n\n✍️ لا كتابة على الصفحات.\n📄 لا طي لأطراف الصفحات.\n🚫 لا تمزيق.\n📖 أُعيد الكتاب كما استلمته.\n\n«الكتاب ملك للجميع، والمحافظة عليه احترام للمعرفة وحق للقارئة التالية.»',
      category: 'regulation',
      bookPreservation: true,
      regulationResults: bookCareReg ? [bookCareReg] : undefined,
      followUps: [
        'ما قواعد استخدام أجهزة الحاسوب؟',
        'كيف أستعير كتابًا؟',
        'ما هي آداب وسلوكيات المركز؟'
      ]
    };
  }

  // 5. Classes & Sessions (الحصص المنفذة أو المسجلة)
  if (
    norm.includes('حصة') || 
    norm.includes('حصص') || 
    norm.includes('جدول المركز') || 
    norm.includes('حصه اليوم') || 
    norm.includes('حصص اليوم') || 
    norm.includes('الصف السابع') || 
    norm.includes('الصف الثامن') || 
    norm.includes('معلمة') || 
    norm.includes('معلمات') ||
    norm.includes('المنفذة') ||
    norm.includes('المنفذه') ||
    norm.includes('المسجلة')
  ) {
    let filteredSessions = [...currentSessions];

    if (norm.includes('اليوم')) {
      filteredSessions = filteredSessions.filter(s => s.day === 'الأحد' || s.date.includes('اليوم'));
    }
    if (norm.includes('غدا') || norm.includes('غدا')) {
      filteredSessions = filteredSessions.filter(s => s.day === 'الإثنين' || s.date.includes('غدًا'));
    }
    if (norm.includes('علوم')) {
      filteredSessions = filteredSessions.filter(s => s.subject.includes('علوم'));
    } else if (norm.includes('عربي') || norm.includes('لغة عربية')) {
      filteredSessions = filteredSessions.filter(s => s.subject.includes('عربية'));
    } else if (norm.includes('اسلامية') || norm.includes('دين')) {
      filteredSessions = filteredSessions.filter(s => s.subject.includes('إسلامية'));
    } else if (norm.includes('دراسات') || norm.includes('اجتماعية')) {
      filteredSessions = filteredSessions.filter(s => s.subject.includes('دراسات'));
    } else if (norm.includes('رياضيات')) {
      filteredSessions = filteredSessions.filter(s => s.subject.includes('رياضيات'));
    }

    if (norm.includes('السابع')) {
      filteredSessions = filteredSessions.filter(s => s.grade.includes('السابع'));
    } else if (norm.includes('الثامن')) {
      filteredSessions = filteredSessions.filter(s => s.grade.includes('الثامن'));
    }

    if (filteredSessions.length > 0) {
      return {
        replyText: `وجدت لكِ تفاصيل الحصص المسجلة في مركز مصادر التعلم (${filteredSessions.length} حصة) 🖥️:`,
        category: 'session',
        sessionResults: filteredSessions,
        followUps: [
          'ما الحصص المنفذة اليوم؟',
          'هل توجد حصة للصف الثامن؟',
          'أين تقع قاعة التعلم التفاعلي؟'
        ]
      };
    } else {
      return {
        replyText: 'لم أجد حاليًا حصصًا مسجلة تطابق طلبك بدقة في جدول المركز 🌷\nيمكنك الاطلاع على الحصص المجدولة لبقية الأيام أو مراجعة أخصائية المصادر.',
        category: 'session',
        sessionResults: currentSessions.slice(0, 3),
        followUps: [
          'ما الحصص المنفذة اليوم؟',
          'ما حصص العلوم المنفذة في المركز؟',
          'أين توجد قاعة التعلم التفاعلي؟'
        ]
      };
    }
  }

  // 6. Programs & Activities (البرامج والأنشطة)
  if (
    norm.includes('نشاط') || 
    norm.includes('انشطة') || 
    norm.includes('برنامج') || 
    norm.includes('برامج') || 
    norm.includes('فعالية') || 
    norm.includes('فعاليات') || 
    norm.includes('مسابقة') || 
    norm.includes('مسابقات') || 
    norm.includes('تحدي القراءة')
  ) {
    return {
      replyText: 'بكل سرور 🌷 إليكِ البرامج والأنشطة المعتمدة في مركز مصادر التعلم بمدرسة فاطمة بنت عتبة:',
      category: 'activity',
      activityResults: currentActivities,
      followUps: [
        'كيف أشارك في تحدي القراءة العربي؟',
        'متى تقام ورشة البحث السريع؟',
        'ما هي شروط الاستعارة؟'
      ]
    };
  }

  // 7. Center Sections (أقسام المركز)
  if (
    norm.includes('قسم') || 
    norm.includes('اقسام') || 
    norm.includes('قاعة') || 
    norm.includes('قاعه') || 
    norm.includes('ركن') || 
    norm.includes('مكان') || 
    norm.includes('موقع المركز') || 
    norm.includes('التعلم التفاعلي') || 
    norm.includes('اين توجد قاعة')
  ) {
    // Specific section check
    const matchedSection = LRC_SECTIONS.find(s => {
      const sNorm = normalizeArabic(s.name);
      return norm.includes(sNorm) || sNorm.split(' ').some(w => w.length > 3 && norm.includes(w));
    });

    if (matchedSection) {
      return {
        replyText: `أرشدك إليها بكل سهولة ✨ تفضلي تفاصيل قسم «${matchedSection.name}» داخل المركز:`,
        category: 'section',
        sectionResults: [matchedSection],
        followUps: [
          'ما الأجهزة المتوفرة في هذا القسم؟',
          'أين يقع ركن البحث الرقمي؟',
          'ما الحصص المنفذة في القاعة التفاعلية؟'
        ]
      };
    } else {
      return {
        replyText: 'بكل سرور 🌷 يضم مركز مصادر التعلم بمدرسة فاطمة بنت عتبة 6 أقسام تعليمية متكاملة لخدمتك:',
        category: 'section',
        sectionResults: LRC_SECTIONS,
        followUps: [
          'أين توجد قاعة التعلم التفاعلي؟',
          'أين أجد ركن القراءة والمطالعة؟',
          'ما قواعد استخدام الحواسيب؟'
        ]
      };
    }
  }

  // 8. Dewey Classification (تصنيف ديوي ومواقع الكتب)
  if (
    norm.includes('ديوي') || 
    norm.includes('تصنيف') || 
    norm.includes('ارقام الكتب') || 
    norm.includes('اين اجد كتب') || 
    norm.includes('موقع كتب') ||
    norm.includes('فئات الكتب') ||
    /\b(000|100|200|300|400|500|600|700|800|900)\b/.test(norm)
  ) {
    // Check for specific subjects
    if (norm.includes('فضاء') || norm.includes('كواكب') || norm.includes('فلك') || norm.includes('نجوم')) {
      return {
        replyText: 'ستجدين كتب الفضاء ضمن قسم العلوم 📚\nالتصنيف الرئيسي: 500\nوتوجد كتب الفلك غالبًا ضمن الرقم 520.\nاتبعي لوحة التصنيف على الأرفف (الجهة الغربية - رف 5B) للوصول إليها.',
        category: 'dewey',
        deweyInfo: {
          mainCategory: 'العلوم الطبيعية والدقيقة',
          mainCode: '500',
          specificCode: '520 (الفلك والأجرام السماوية)',
          shelf: 'الجهة الغربية - رف 5B',
          advice: 'اتبعي لوحة التصنيف على الأرفف للوصول إليها مباشرة.'
        },
        followUps: [
          'اعرضي لي الكتب المتوفرة عن الفضاء',
          'أين أجد كتب التاريخ العماني؟',
          'كيف أستعير كتابًا؟'
        ]
      };
    }

    if (norm.includes('علوم') || norm.includes('احياء') || norm.includes('كيمياء') || norm.includes('فيزياء')) {
      return {
        replyText: 'ستجدين كتب العلوم العامة ضمن التصنيف الرئيسي 500 🔬\nوتتوزع كالتالي:\n• 510 الرياضيات\n• 520 الفلك والفضاء\n• 530 الفيزياء\n• 540 الكيمياء\n• 570 الأحياء والبيئة\nموقعها: الجهة الغربية - الأرفف (5A إلى 5D).',
        category: 'dewey',
        deweyInfo: {
          mainCategory: 'العلوم الطبيعية والدقيقة',
          mainCode: '500',
          specificCode: '500 - 599',
          shelf: 'الجهة الغربية - الأرفف (5A إلى 5D)',
          advice: 'راجعي بطاقات الأرفف الملونة باللون الأزرق المائي.'
        },
        followUps: [
          'ما هي الكتب المتوفرة في العلوم؟',
          'أين أجد كتب الروبوت والذكاء الاصطناعي؟',
          'كيف أستعير كتابًا؟'
        ]
      };
    }

    if (norm.includes('دين') || norm.includes('صلاة') || norm.includes('اسلامية') || norm.includes('قران')) {
      return {
        replyText: 'ستجدين كتب الدراسات الإسلامية ضمن التصنيف الرئيسي 200 🕌\n• 211 علوم القرآن والتفاسير\n• 213 فقه العبادات والصلاة\n• 219 السيرة النبوية وتراجم الصحابة\nموقعها: الجهة الشرقية - الأرفف (2A إلى 2D).',
        category: 'dewey',
        deweyInfo: {
          mainCategory: 'الديانات والعلوم الشرعية',
          mainCode: '200',
          specificCode: '213 (فقه العبادات)',
          shelf: 'الجهة الشرقية - الأرفف (2A إلى 2D)',
          advice: 'ارفف القسم الإسلامي مميزة باللون الأخضر الزمردي.'
        },
        followUps: [
          'هل يوجد كتاب عن الصلاة؟',
          'هل يوجد كتاب عن قصص القرآن؟',
          'كيف أستعير كتابًا؟'
        ]
      };
    }

    if (norm.includes('تاريخ') || norm.includes('جغرافيا') || norm.includes('عمان') || norm.includes('اطلس')) {
      return {
        replyText: 'ستجدين كتب التاريخ والجغرافيا ضمن التصنيف الرئيسي 900 🗺️\n• 910 الجغرافيا والأطالس\n• 920 التراجم والشخصيات\n• 953 تاريخ سلطنة عمان والجزيرة العربية\nموقعها: الجهة الجنوبية الشرقية - الأرفف (9A إلى 9D).',
        category: 'dewey',
        deweyInfo: {
          mainCategory: 'التاريخ والجغرافيا والتراجم',
          mainCode: '900',
          specificCode: '953 (تاريخ سلطنة عمان)',
          shelf: 'الجهة الجنوبية الشرقية - الأرفف (9A إلى 9D)'
        },
        followUps: [
          'هل يوجد كتاب عن تاريخ عمان؟',
          'أين أجد كتب الأدب والروايات؟',
          'كيف أستعير كتابًا؟'
        ]
      };
    }

    // Default Dewey full overview
    return {
      replyText: 'أرشدك إليها بكل سرور 🌷 يعتمد مركز مصادر التعلم تصنيف ديوي العشري لتنظيم المعرفة البشرية في 10 أصول رئيسية:',
      category: 'dewey',
      deweyInfo: {
        list: DEWEY_CATEGORIES,
        advice: 'لكل تصنيف رقم مكون من 3 خانات ولون دلالي يسهل عليكِ الوصول السريع للأرفف.'
      },
      followUps: [
        'أين أجد كتب العلوم والفضاء؟',
        'أين أجد كتب التاريخ والقصص؟',
        'هل يوجد كتاب عن الصلاة؟'
      ]
    };
  }

  // 9. Book Search (البحث عن الكتب - أهم وظيفة)
  if (norm.includes('موضوع معين')) {
    return {
      replyText: 'بكل سرور 🌷 يمكنكِ البحث عن أي كتاب بكتابة موضوعه في مربع البحث، مثل:\n• الصلاة والعبادات\n• الفضاء والكواكب\n• تاريخ عمان وحضارتها\n• الذكاء الاصطناعي والروبوتات\n• الروايات والقصص الأدبية\n\nإليكِ نماذج من الكتب المتوفرة في المركز، ويمكنكِ أيضًا الضغط على أي سؤال مقترح أدناه:',
      category: 'book',
      books: booksDatabase.slice(0, 3),
      totalBooksFound: booksDatabase.length,
      followUps: [
        'هل يوجد كتاب عن الصلاة؟',
        'أين أجد كتب الكواكب؟',
        'هل يوجد كتاب عن تاريخ عمان؟'
      ]
    };
  }

  // Search priority:
  // 1. عنوان الكتاب (Title)
  // 2. المؤلف (Author)
  // 3. الموضوع الرئيسي (Subject)
  // 4. الكلمات المفتاحية (Keywords & synonyms)
  // 5. رقم ديوي (Dewey number)
  // 6. القسم (Section)
  const matchedBooks = searchBooks(norm, booksDatabase);

  if (matchedBooks.length > 0) {
    const starterPhrases = [
      'وجدت لكِ هذه النتيجة 📚',
      'بكل سرور 🌷 إليكِ الكتب المتوفرة في مركز المصادر:',
      'أرشدك إليها بكل سهولة ✨ تفضلي نتائج البحث في قاعدة بيانات المركز:'
    ];
    const starter = starterPhrases[Math.floor(Math.random() * starterPhrases.length)];

    return {
      replyText: `${starter}\nعرضت لكِ أفضل النتائج المطابقة من قاعدة بيانات مركز مصادر التعلم:`,
      category: 'book',
      books: matchedBooks,
      totalBooksFound: matchedBooks.length,
      followUps: [
        'هل تريدين معرفة موقع الرف بدقة؟',
        'هل تبحثين عن كتاب آخر في نفس الموضوع؟',
        'هل تريدين معرفة طريقة الاستعارة؟'
      ]
    };
  }

  // 10. Book Not Found - STRICT NO HALLUCINATION RULE
  // If no match was found, must output:
  // «لم أجد حاليًا كتابًا مطابقًا في قاعدة بيانات مركز مصادر التعلم 🌷
  // يمكنني مساعدتك في البحث عن كتاب قريب من الموضوع.»
  // Then suggest alternative searches based only on available data.
  const sampleAvailableSubjects = ['الصلاة والعبادات', 'الفضاء والنظام الشمسي', 'تاريخ عمان', 'الذكاء الاصطناعي', 'الأدب والروايات', 'الموسوعات العلمية'];
  return {
    replyText: 'لم أجد حاليًا كتابًا مطابقًا في قاعدة بيانات مركز مصادر التعلم 🌷\nيمكنني مساعدتك في البحث عن كتاب قريب من الموضوع.\n\nيمكنك البحث بأحد الموضوعات المتوفرة في المركز مثل: ' + sampleAvailableSubjects.slice(0, 4).join('، ') + '.',
    category: 'book',
    books: [],
    totalBooksFound: 0,
    followUps: [
      'هل يوجد كتاب عن الصلاة؟',
      'أريد كتابًا عن الكواكب والفضاء',
      'هل يوجد كتاب عن تاريخ عمان؟'
    ]
  };
}

// Search algorithm following the exact priority specified by the user
export function searchBooks(normalizedQuery: string, database: Book[]): Book[] {
  if (!normalizedQuery || normalizedQuery.trim() === '') return [];

  const tokens = normalizedQuery.split(/\s+/).filter(t => t.length > 1);

  // Expand tokens with synonyms
  const expandedTokens = new Set<string>(tokens);
  tokens.forEach(tok => {
    Object.entries(SYNONYMS_MAP).forEach(([key, syns]) => {
      if (tok.includes(key) || key.includes(tok)) {
        syns.forEach(s => expandedTokens.add(normalizeArabic(s)));
      }
    });
  });

  const queryTerms = Array.from(expandedTokens);

  // Helper score calculator
  interface ScoredBook {
    book: Book;
    score: number;
    matchPriority: number; // 1: Title, 2: Author, 3: Subject, 4: Keywords, 5: Dewey, 6: Section
  }

  const scoredBooks: ScoredBook[] = [];

  for (const book of database) {
    const normTitle = normalizeArabic(book.title);
    const normAuthor = normalizeArabic(book.author);
    const normSubject = normalizeArabic(book.subject);
    const normSection = normalizeArabic(book.section);
    const normDewey = normalizeArabic(book.deweyNumber);
    const normKeywords = book.keywords.map(k => normalizeArabic(k));

    let score = 0;
    let highestPriority = 99;

    // 1. Title match (Highest Priority)
    if (queryTerms.some(term => normTitle.includes(term))) {
      score += 100;
      highestPriority = Math.min(highestPriority, 1);
    }

    // Exact whole query inside title
    if (normTitle.includes(normalizedQuery)) {
      score += 150;
      highestPriority = 1;
    }

    // 2. Author match
    if (queryTerms.some(term => normAuthor.includes(term))) {
      score += 70;
      highestPriority = Math.min(highestPriority, 2);
    }

    // 3. Subject match
    if (queryTerms.some(term => normSubject.includes(term))) {
      score += 50;
      highestPriority = Math.min(highestPriority, 3);
    }

    // 4. Keywords match (and expanded synonyms)
    const matchedKwCount = normKeywords.filter(kw => 
      queryTerms.some(term => kw.includes(term) || term.includes(kw))
    ).length;
    if (matchedKwCount > 0) {
      score += matchedKwCount * 40;
      highestPriority = Math.min(highestPriority, 4);
    }

    // 5. Dewey match
    if (normDewey.includes(normalizedQuery) || queryTerms.some(term => normDewey.includes(term))) {
      score += 30;
      highestPriority = Math.min(highestPriority, 5);
    }

    // 6. Section match
    if (queryTerms.some(term => normSection.includes(term))) {
      score += 20;
      highestPriority = Math.min(highestPriority, 6);
    }

    if (score > 0) {
      scoredBooks.push({
        book,
        score,
        matchPriority: highestPriority
      });
    }
  }

  // Sort by matchPriority ascending (1 first, then 2, etc.), then by score descending
  scoredBooks.sort((a, b) => {
    if (a.matchPriority !== b.matchPriority) {
      return a.matchPriority - b.matchPriority;
    }
    return b.score - a.score;
  });

  return scoredBooks.map(sb => sb.book);
}
