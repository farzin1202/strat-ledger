export const translations = {
  en: {
    // Onboarding
    welcomeTitle: "Hello! Welcome to your",
    welcomeHighlight: "Pro Trading Hub",
    welcomeSubtitle: "Your journey to trading mastery begins here",
    trackTitle: "Track, Analyze, and",
    trackHighlight: "Master",
    trackSubtitle: "your Strategies",
    trackDescription: "Log every trade, visualize your equity curve, and discover patterns that lead to consistent profits.",
    getStarted: "Get Started",
    next: "Next",

    // Navigation
    dashboard: "Dashboard",
    strategies: "Strategies",
    settings: "Settings",
    back: "Back",

    // Dashboard
    yourStrategies: "Your Strategies",
    addStrategy: "Add Strategy",
    noStrategies: "No strategies yet",
    createFirst: "Create your first trading strategy to get started",
    strategyName: "Strategy Name",
    create: "Create",
    cancel: "Cancel",
    rename: "Rename",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this?",

    // Months
    months: "Months",
    addMonth: "Add Month",
    noMonths: "No months added yet",
    addFirstMonth: "Add your first month to start tracking trades",
    monthName: "Month Name",
    year: "Year",
    winRate: "Win Rate",
    netProfit: "Net Profit",
    trades: "Trades",

    // Trades Grid
    date: "Date",
    pair: "Pair",
    direction: "Direction",
    long: "Long",
    short: "Short",
    entryPrice: "Entry",
    exitPrice: "Exit",
    riskReward: "R:R",
    result: "Result",
    win: "Win",
    loss: "Loss",
    mixed: "Mixed",
    tradeCount: "Count",
    profitLossDollar: "P/L ($)",
    profitLossPercent: "P/L (%)",
    maxPercent: "Max %",
    addTrade: "Add Trade",
    noTrades: "No trades logged",
    startLogging: "Start logging your trades",

    // Analytics
    analytics: "Analytics",
    totalProfit: "Total Profit",
    totalLoss: "Total Loss",
    equityCurve: "Equity Curve",
    totalTrades: "Total Trades",

    // Settings
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    english: "English",
    persian: "فارسی",
  },
  fa: {
    // Onboarding
    welcomeTitle: "سلام! به",
    welcomeHighlight: "هاب معاملاتی حرفه‌ای",
    welcomeSubtitle: "سفر شما به سمت تسلط بر معاملات از اینجا شروع می‌شود",
    trackTitle: "ردیابی، تحلیل و",
    trackHighlight: "تسلط",
    trackSubtitle: "بر استراتژی‌های شما",
    trackDescription: "هر معامله را ثبت کنید، منحنی سرمایه خود را مشاهده کنید و الگوهایی را کشف کنید که به سودآوری پایدار منجر می‌شوند.",
    getStarted: "شروع کنید",
    next: "بعدی",

    // Navigation
    dashboard: "داشبورد",
    strategies: "استراتژی‌ها",
    settings: "تنظیمات",
    back: "بازگشت",

    // Dashboard
    yourStrategies: "استراتژی‌های شما",
    addStrategy: "افزودن استراتژی",
    noStrategies: "هنوز استراتژی‌ای وجود ندارد",
    createFirst: "اولین استراتژی معاملاتی خود را ایجاد کنید",
    strategyName: "نام استراتژی",
    create: "ایجاد",
    cancel: "انصراف",
    rename: "تغییر نام",
    delete: "حذف",
    deleteConfirm: "آیا از حذف این مورد مطمئن هستید؟",

    // Months
    months: "ماه‌ها",
    addMonth: "افزودن ماه",
    noMonths: "هنوز ماهی اضافه نشده",
    addFirstMonth: "اولین ماه را اضافه کنید تا ردیابی معاملات شروع شود",
    monthName: "نام ماه",
    year: "سال",
    winRate: "نرخ برد",
    netProfit: "سود خالص",
    trades: "معاملات",

    // Trades Grid
    date: "تاریخ",
    pair: "جفت ارز",
    direction: "جهت",
    long: "خرید",
    short: "فروش",
    entryPrice: "ورود",
    exitPrice: "خروج",
    riskReward: "R:R",
    result: "نتیجه",
    win: "برد",
    loss: "باخت",
    mixed: "ترکیبی",
    tradeCount: "تعداد",
    profitLossDollar: "سود/زیان ($)",
    profitLossPercent: "سود/زیان (%)",
    maxPercent: "حداکثر %",
    addTrade: "افزودن معامله",
    noTrades: "معامله‌ای ثبت نشده",
    startLogging: "شروع به ثبت معاملات کنید",

    // Analytics
    analytics: "تحلیل‌ها",
    totalProfit: "کل سود",
    totalLoss: "کل زیان",
    equityCurve: "منحنی سرمایه",
    totalTrades: "کل معاملات",

    // Settings
    theme: "تم",
    light: "روشن",
    dark: "تاریک",
    language: "زبان",
    english: "English",
    persian: "فارسی",
  },
};

export type TranslationKey = keyof typeof translations.en;
