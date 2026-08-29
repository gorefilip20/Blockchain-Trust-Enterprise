'use client';

import { useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'es' | 'zh' | 'ar';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav items
    'nav.overview': 'Overview',
    'nav.portfolio': 'Portfolio',
    'nav.markets': 'Markets',
    'nav.trade': 'Trade',
    'nav.research': 'Research',
    'nav.copy_trading': 'Copy Trading',
    'nav.balances': 'Balances',
    'nav.reports': 'Reports',
    'nav.security_center': 'Security center',
    'nav.settings': 'Settings',
    'nav.help_center': 'Help center',
    // Sections
    'section.workspace': 'Workspace',
    'section.account': 'Account',
    'section.watchlist': 'Your watchlist',
    'section.portfolio_allocation': 'Portfolio allocation',
    'section.recent_orders': 'Recent orders',
    'section.market_intelligence': 'Market intelligence',
    'section.account_activity': 'Account activity',
    'section.bte_signal': 'BTE signal',
    'section.bte_advantage': 'BTE advantage layer',
    // Hero
    'hero.headline': 'Institutional clarity. Human control.',
    'hero.subtitle': 'A transparent command center for global markets, intelligent risk, and responsible execution.',
    // Buttons
    'btn.create_order': 'Create order',
    'btn.export_view': 'Export view',
    'btn.new_order': 'New order',
    'btn.view_all': 'View all',
    'btn.mark_all_read': 'Mark all read',
    'btn.sign_in': 'Sign in',
    'btn.sign_out': 'Sign out',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    // Common phrases
    'common.today': 'Today',
    'common.buying_power': 'Buying power',
    'common.since_inception': 'Since inception',
    'common.all_systems_operational': 'All systems operational',
    'common.paper_account': 'Paper account',
    'common.search_placeholder': 'Search markets, symbols...',
    'common.notifications': 'Notifications',
    'common.no_notifications': 'No new notifications',
    'common.total_value': 'Total account value',
    'common.available_invest': 'Available to invest',
    'common.unrealized_pnl': 'Unrealized P&L',
    'common.risk_posture': 'Risk posture',
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.portfolio_overview': 'Portfolio overview',
    'dashboard.active_subscriptions': 'Active subscriptions',
    'dashboard.document_vault': 'Document vault',
    'dashboard.payment_history': 'Payment history',
  },
  es: {
    'nav.overview': 'Resumen',
    'nav.portfolio': 'Portafolio',
    'nav.markets': 'Mercados',
    'nav.trade': 'Operar',
    'nav.research': 'Investigacion',
    'nav.copy_trading': 'Copy Trading',
    'nav.balances': 'Saldos',
    'nav.reports': 'Informes',
    'nav.security_center': 'Centro de seguridad',
    'nav.settings': 'Configuracion',
    'nav.help_center': 'Centro de ayuda',
    'section.workspace': 'Espacio de trabajo',
    'section.account': 'Cuenta',
    'section.watchlist': 'Tu lista de seguimiento',
    'section.portfolio_allocation': 'Asignacion de portafolio',
    'section.recent_orders': 'Ordenes recientes',
    'section.market_intelligence': 'Inteligencia de mercado',
    'section.account_activity': 'Actividad de la cuenta',
    'section.bte_signal': 'Senal BTE',
    'section.bte_advantage': 'Capa de ventaja BTE',
    'hero.headline': 'Claridad institucional. Control humano.',
    'hero.subtitle': 'Un centro de mando transparente para mercados globales, riesgo inteligente y ejecucion responsable.',
    'btn.create_order': 'Crear orden',
    'btn.export_view': 'Exportar vista',
    'btn.new_order': 'Nueva orden',
    'btn.view_all': 'Ver todo',
    'btn.mark_all_read': 'Marcar todo leido',
    'btn.sign_in': 'Iniciar sesion',
    'btn.sign_out': 'Cerrar sesion',
    'btn.save': 'Guardar',
    'btn.cancel': 'Cancelar',
    'common.today': 'Hoy',
    'common.buying_power': 'Poder de compra',
    'common.since_inception': 'Desde el inicio',
    'common.all_systems_operational': 'Todos los sistemas operativos',
    'common.paper_account': 'Cuenta de papel',
    'common.search_placeholder': 'Buscar mercados, simbolos...',
    'common.notifications': 'Notificaciones',
    'common.no_notifications': 'Sin notificaciones nuevas',
    'common.total_value': 'Valor total de la cuenta',
    'common.available_invest': 'Disponible para invertir',
    'common.unrealized_pnl': 'P&L no realizado',
    'common.risk_posture': 'Postura de riesgo',
    'dashboard.title': 'Panel de control',
    'dashboard.portfolio_overview': 'Resumen del portafolio',
    'dashboard.active_subscriptions': 'Suscripciones activas',
    'dashboard.document_vault': 'Boveda de documentos',
    'dashboard.payment_history': 'Historial de pagos',
  },
  zh: {
    'nav.overview': '概览',
    'nav.portfolio': '投资组合',
    'nav.markets': '市场',
    'nav.trade': '交易',
    'nav.research': '研究',
    'nav.copy_trading': '跟单交易',
    'nav.balances': '余额',
    'nav.reports': '报告',
    'nav.security_center': '安全中心',
    'nav.settings': '设置',
    'nav.help_center': '帮助中心',
    'section.workspace': '工作区',
    'section.account': '账户',
    'section.watchlist': '您的自选列表',
    'section.portfolio_allocation': '投资组合配置',
    'section.recent_orders': '近期订单',
    'section.market_intelligence': '市场情报',
    'section.account_activity': '账户活动',
    'section.bte_signal': 'BTE 信号',
    'section.bte_advantage': 'BTE 优势层',
    'hero.headline': '机构级透明度，人性化掌控。',
    'hero.subtitle': '全球市场、智能风控和负责任执行的透明指挥中心。',
    'btn.create_order': '创建订单',
    'btn.export_view': '导出视图',
    'btn.new_order': '新建订单',
    'btn.view_all': '查看全部',
    'btn.mark_all_read': '全部标记已读',
    'btn.sign_in': '登录',
    'btn.sign_out': '退出',
    'btn.save': '保存',
    'btn.cancel': '取消',
    'common.today': '今日',
    'common.buying_power': '购买力',
    'common.since_inception': '自创建以来',
    'common.all_systems_operational': '所有系统正常运行',
    'common.paper_account': '模拟账户',
    'common.search_placeholder': '搜索市场、代码...',
    'common.notifications': '通知',
    'common.no_notifications': '暂无新通知',
    'common.total_value': '账户总价值',
    'common.available_invest': '可投资金额',
    'common.unrealized_pnl': '未实现损益',
    'common.risk_posture': '风险状态',
    'dashboard.title': '仪表盘',
    'dashboard.portfolio_overview': '投资组合概览',
    'dashboard.active_subscriptions': '活跃订阅',
    'dashboard.document_vault': '文档保险箱',
    'dashboard.payment_history': '支付历史',
  },
  ar: {
    'nav.overview': 'نظرة عامة',
    'nav.portfolio': 'المحفظة',
    'nav.markets': 'الاسواق',
    'nav.trade': 'تداول',
    'nav.research': 'ابحاث',
    'nav.copy_trading': 'نسخ التداول',
    'nav.balances': 'الارصدة',
    'nav.reports': 'التقارير',
    'nav.security_center': 'مركز الامان',
    'nav.settings': 'الاعدادات',
    'nav.help_center': 'مركز المساعدة',
    'section.workspace': 'مساحة العمل',
    'section.account': 'الحساب',
    'section.watchlist': 'قائمة المراقبة',
    'section.portfolio_allocation': 'توزيع المحفظة',
    'section.recent_orders': 'الطلبات الاخيرة',
    'section.market_intelligence': 'ذكاء السوق',
    'section.account_activity': 'نشاط الحساب',
    'section.bte_signal': 'اشارة BTE',
    'section.bte_advantage': 'طبقة ميزة BTE',
    'hero.headline': 'وضوح مؤسسي. تحكم بشري.',
    'hero.subtitle': 'مركز قيادة شفاف للاسواق العالمية والمخاطر الذكية والتنفيذ المسؤول.',
    'btn.create_order': 'انشاء طلب',
    'btn.export_view': 'تصدير العرض',
    'btn.new_order': 'طلب جديد',
    'btn.view_all': 'عرض الكل',
    'btn.mark_all_read': 'تعليم الكل كمقروء',
    'btn.sign_in': 'تسجيل الدخول',
    'btn.sign_out': 'تسجيل الخروج',
    'btn.save': 'حفظ',
    'btn.cancel': 'الغاء',
    'common.today': 'اليوم',
    'common.buying_power': 'القوة الشرائية',
    'common.since_inception': 'منذ البداية',
    'common.all_systems_operational': 'جميع الانظمة تعمل',
    'common.paper_account': 'حساب تجريبي',
    'common.search_placeholder': 'بحث في الاسواق والرموز...',
    'common.notifications': 'الاشعارات',
    'common.no_notifications': 'لا توجد اشعارات جديدة',
    'common.total_value': 'القيمة الاجمالية للحساب',
    'common.available_invest': 'متاح للاستثمار',
    'common.unrealized_pnl': 'الربح/الخسارة غير المحققة',
    'common.risk_posture': 'وضع المخاطر',
    'dashboard.title': 'لوحة القيادة',
    'dashboard.portfolio_overview': 'نظرة عامة على المحفظة',
    'dashboard.active_subscriptions': 'الاشتراكات النشطة',
    'dashboard.document_vault': 'خزنة الوثائق',
    'dashboard.payment_history': 'سجل المدفوعات',
  },
};

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Espanol',
  zh: '中文',
  ar: 'العربية',
};

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bte-lang') as Locale | null;
      if (stored && translations[stored]) {
        setLocaleState(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('bte-lang', newLocale);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || translations.en[key] || key;
    },
    [locale]
  );

  return { t, locale, setLocale, locales: Object.keys(translations) as Locale[], localeNames };
}

export function LanguageSwitcher({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <select
      className="lang-switcher"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Language"
    >
      {(Object.keys(localeNames) as Locale[]).map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
