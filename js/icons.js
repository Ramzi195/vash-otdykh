/* ==========================================================================
   Ваш отдых — SVG-иконки (без эмодзи), тема: отдых на природе/гриль
   Использование: icon('name', size?) → строка <svg>…</svg>
   ========================================================================== */

const ICONS = {
  /* ---- UI ---- */
  search:
    `<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>`,

  bag:
    `<path d="M6.5 22h11a2 2 0 0 0 2-1.86l.82-9.14A1 1 0 0 0 19.34 10H4.66a1 1 0 0 0-1 1l.82 9.14A2 2 0 0 0 6.5 22Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M9 10V8a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  heart:
    `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  'heart-fill':
    `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/>`,

  menu:
    `<line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,

  close:
    `<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
     <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,

  'chevron-right':
    `<polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,

  'chevron-left':
    `<polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,

  plus:
    `<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
     <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,

  minus:
    `<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,

  trash:
    `<polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  'star-fill':
    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`,

  check:
    `<polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,

  phone:
    `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  chat:
    `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  'map-pin':
    `<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>`,

  clock:
    `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/>
     <path d="M12 7v5l4 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  'shield-check':
    `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <polyline points="9 12 11 14 15 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,

  truck:
    `<rect x="1" y="6" width="14" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M15 9h4l3 4v3h-7V9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="5.5" cy="18.5" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/>
     <circle cx="18.5" cy="18.5" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/>`,

  'badge-percent':
    `<path d="M12 2l2.4 1.1 2.6-.4 1.3 2.3 2.3 1.3-.4 2.6L21 11.5l-1.1 2.4.4 2.6-2.3 1.3-1.3 2.3-2.6-.4L12 21l-2.4-1.1-2.6.4-1.3-2.3-2.3-1.3.4-2.6L2 12l1.1-2.4-.4-2.6 2.3-1.3 1.3-2.3 2.6.4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="9" y1="15" x2="15" y2="9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="9.3" cy="9.3" r="1.3" fill="currentColor"/>
     <circle cx="14.7" cy="14.7" r="1.3" fill="currentColor"/>`,

  /* ---- Категории ---- */
  flame:
    `<path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.5-2-1-2.5.8 2.5-1 4-2.5 3 1-1.5 0-3-1-4 .3 2-1 2.5-1.5 4C11 8 9 6.5 9 4.5 7 7 6 10 6 13a6 6 0 0 0 12 0c0-5-3-7-6-11z" fill="currentColor" stroke="none"/>`,

  grill:
    `<rect x="3" y="9" width="18" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="1.6"/>
     <line x1="5" y1="12" x2="4" y2="19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
     <line x1="19" y1="12" x2="20" y2="19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M9 4c.6 1.6-1 2-1 3.6a2 2 0 0 0 4 0c0-.5-.2-1-.5-1.3.4 1.3-.5 2-1.3 1.5.5-.8 0-1.6-.5-2.1.1 1-.5 1.3-.7 2C8.5 6.8 7.6 5.9 7.6 4.7 6.6 6 6 7.5 6 9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>`,

  chair:
    `<path d="M6 4v9M18 4v9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
     <path d="M6 13h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
     <line x1="7" y1="18" x2="6" y2="22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
     <line x1="17" y1="18" x2="18" y2="22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
     <line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.4"/>`,

  samovar:
    `<ellipse cx="12" cy="21" rx="5" ry="1.3" fill="currentColor"/>
     <path d="M8 21v-3a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/>
     <path d="M7 18h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M7.5 13h9a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.6"/>
     <path d="M9 13c-1-2-1-4 0-5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
     <path d="M15 13c1-2 1-4 0-5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
     <rect x="9.3" y="4" width="5.4" height="3.2" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.5"/>
     <path d="M14.7 5.3h1.6a1 1 0 0 1 1 1v.2a1 1 0 0 1-1 1h-1.6" fill="none" stroke="currentColor" stroke-width="1.3"/>
     <line x1="11.5" y1="2.2" x2="11.5" y2="4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
     <line x1="4.5" y1="16" x2="6.2" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
     <path d="M3.6 14.6c.6.6.6 1.6 0 2.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>`,

  'gift-case':
    `<rect x="2.5" y="9" width="19" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/>
     <path d="M3 12h18" stroke="currentColor" stroke-width="1.4"/>
     <path d="M8 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
     <rect x="5" y="9.6" width="2.4" height="2.4" rx="0.4" fill="currentColor" opacity=".7"/>
     <rect x="16.6" y="9.6" width="2.4" height="2.4" rx="0.4" fill="currentColor" opacity=".7"/>`,

  bottle:
    `<path d="M10 2h4v3.2l1.5 2A3 3 0 0 1 16 9.2V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9.2a3 3 0 0 1 .5-2L10 5.2V2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
     <line x1="10" y1="2" x2="14" y2="2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
     <line x1="8.3" y1="13" x2="15.7" y2="13" stroke="currentColor" stroke-width="1.3"/>`,

  steak:
    `<path d="M5 9c1-3 4-5 8-5 4.5 0 7 3 6.5 6.5C19 13.5 16.5 16 13 16c-1.5 0-2 1-3.5 1.5-2 .7-4 0-4.8-1.8C3.8 13.7 4.3 11 5 9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
     <circle cx="14" cy="9.5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.4"/>
     <path d="M6.5 19.5l2-2.7M9 21l1.6-2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,

  skewer:
    `<line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
     <rect x="7.5" y="9.5" width="3.2" height="3.2" rx=".6" transform="rotate(45 9 11)" fill="currentColor" opacity=".85"/>
     <rect x="12.3" y="4.7" width="3.2" height="3.2" rx=".6" transform="rotate(45 14 6)" fill="currentColor" opacity=".85"/>
     <circle cx="20" cy="4" r="1.4" fill="currentColor"/>`,
};

/* ------------------------------------------------------------------ */
function icon(name, size = 20) {
  const inner = ICONS[name];
  if (!inner) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex-shrink:0">${inner}</svg>`;
}

/* Иконка категории по id */
const CAT_ICON_MAP = {
  all:        "bag",
  grills:     "grill",
  furniture:  "chair",
  samovars:   "samovar",
  giftsets:   "gift-case",
  drinks:     "bottle",
  steaks:     "steak",
};
