/* ==========================================================================
   Ваш отдых — интернационализация (RU / EN)
   Использование: t('key') → строка на текущем языке
   Статические элементы: атрибут data-i18n="key" (или data-i18n-ph для placeholder)
   ========================================================================== */

const I18N = {
  ru: {
    /* --- Навигация --- */
    "nav.home": "Главная",
    "nav.catalog": "Каталог",
    "nav.collab": "Сотрудничество",
    "nav.about": "О нас",
    "nav.fav": "Избранное",
    "nav.cart": "Корзина",
    "brand.city": "Грозный",

    /* --- Заставка --- */
    "intro.hint": "Нажмите на лого",

    /* --- Главный экран --- */
    "hero.motto": "Ваш отдых — наша забота",
    "hero.title": 'Всё для <span class="accent">отдыха и жизни</span> с удовольствием',
    "hero.desc": "Мангалы и грили, казаны, чугунная посуда, ножи и клинки, самовары, садовая мебель, подарочные наборы — и многое другое в одном магазине в Грозном.",
    "hero.btnCatalog": "Смотреть каталог",
    "hero.btnAbout": "О магазине",
    "hero.tagAddr": "Грозный — два магазина",

    /* --- Адреса --- */
    "addr.petropavlovskoye": "г. Грозный, ул. Петропавловское шоссе, 10б",
    "addr.saikhanova": "г. Грозный, ул. Сайханова, 69",

    /* --- Секции главной --- */
    "home.categories": "Категории",
    "home.hits": "Хиты продаж",
    "home.hitsSub": "Чаще всего выбирают",
    "home.allProducts": "Все товары",
    "home.new": "Новинки",
    "home.newSub": "Недавно в магазине",
    "home.why": "Почему «Ваш отдых»",
    "home.related": "Похожие товары",
    "ben1.h": "Проверено лично",
    "ben1.p": "Подбираем товар сами, продаём то, что не стыдно поставить у себя на даче",
    "ben2.h": "Самовывоз и доставка",
    "ben2.p": "Заберите в магазине в Грозном или согласуем доставку по городу",
    "ben3.h": "Поможем с выбором",
    "ben3.p": "Ответим на вопросы и подскажем подходящий вариант в WhatsApp",
    "ben4.h": "Открыты ежедневно",
    "ben4.p": "Заходите в удобное время — мы почти всегда на месте",

    /* --- Каталог --- */
    "catalog.title": "Каталог",
    "catalog.found": "Найдено товаров: ",
    "sort.popular": "Популярные",
    "sort.cheap": "Сначала дешёвые",
    "sort.expensive": "Сначала дорогие",
    "sort.rating": "По рейтингу",

    /* --- Карточка / бейджи --- */
    "badge.hit": "Хит",
    "badge.new": "Новинка",
    "badge.sale": "Скидка",
    "price.ask": "Узнать цену",

    /* --- Товар --- */
    "pd.feat1": "Проверено лично перед продажей",
    "pd.feat2": "Можно посмотреть и забрать в магазине в Грозном",
    "pd.feat3": "Поможем с выбором по телефону или в WhatsApp",
    "pd.askWa": "Узнать цену в WhatsApp",
    "pd.orderWa": "Заказать в WhatsApp",
    "pd.toCart": "В корзину",
    "pd.inCart": "В корзине ✓",
    "pd.rating": "рейтинг товара",

    /* --- Избранное --- */
    "fav.emptyT": "В избранном пусто",
    "fav.emptyP": "Нажимайте на сердечко у товаров, чтобы сохранить их здесь",
    "fav.emptyBtn": "Перейти в каталог",

    /* --- Корзина --- */
    "cart.title": "Корзина",
    "cart.emptyT": "Корзина пуста",
    "cart.emptyP": "Добавьте товары, чтобы оформить заявку на заказ",
    "cart.emptyBtn": "Перейти в каталог",
    "cart.clear": "Очистить корзину",
    "cart.remove": "Удалить",
    "cart.priceTBD": "цена уточняется",
    "cart.checkoutTitle": "Оформление заявки",
    "cart.count": "Товаров",
    "cart.total": "Итого",
    "cart.tbd": "уточняется",
    "cart.pcs": "шт.",
    "cart.name": "Ваше имя",
    "cart.namePh": "Как к вам обращаться",
    "cart.phone": "Телефон",
    "cart.comment": "Комментарий (необязательно)",
    "cart.commentPh": "Например: удобное время для звонка",
    "cart.submit": "Отправить заявку в WhatsApp",
    "cart.disclaimer": "Нажимая кнопку, вы перейдёте в WhatsApp с готовым сообщением о заказе",

    /* --- О нас --- */
    "about.title": "О магазине",
    "about.p1": '<strong>«Ваш отдых»</strong> — магазин для тех, кто любит готовить, принимать гостей, охотиться, рыбачить и просто жить в своё удовольствие. Мы работаем с <strong>2013 года</strong> и за это время помогли тысячам семей по всей России найти нужные товары.',
    "about.p2": "В нашем ассортименте — мангалы и грили, казаны и чугунная посуда, ножи и клинки кизлярских мастеров, самовары от классических дровяных до больших турецких, садовая мебель из ротанга, фирменные подарочные наборы для шашлыка и стейки из мраморной говядины.",
    "about.whyH": "Почему выбирают нас",
    "about.p3": "Каждый товар мы проверяем лично. Если сомневаетесь с выбором — звоните или пишите в WhatsApp, подскажем лучший вариант под ваши задачи. <strong>Доставляем по всей России.</strong>",
    "about.p4": "Два магазина в Грозном — можно посмотреть и забрать лично в любой день с 9:00 до 19:00.",
    "about.motto": '"Ваш отдых — наша забота"',
    "about.addresses": "Адреса",
    "about.hoursLbl": "Часы работы",
    "about.phoneLbl": "Телефон / WhatsApp",
    "about.waLink": "Написать в WhatsApp",
    "about.emailLbl": "E-mail",
    "about.deliveryLbl": "Доставка",
    "info.hours": "Ежедневно 9:00–19:00, без выходных",
    "info.delivery": "Доставка по всей России",

    /* --- Сотрудничество --- */
    "collab.title": "Сотрудничество",
    "collab.sub": "Открыты для партнёрства и оптовых заказов",
    "collab.intro": "Мы открыты для совместных проектов — будь то оптовые закупки, оформление мероприятий или партнёрство с другими магазинами. Пишите — отвечаем быстро.",
    "collab.waCta": "Написать нам",
    "collab.igCta": "Подписаться и написать",
    "collab.mailCta": "Отправить письмо",
    "collab.f1t": "С 2013 года",
    "collab.f1s": "более 10 лет на рынке",
    "collab.f2t": "Два магазина",
    "collab.f2s": "в самом центре Грозного",
    "collab.f3t": "Доставка по России",
    "collab.f3s": "быстро и надёжно",
    "collab.f4t": "Опт и партнёрство",
    "collab.f4s": "работаем с бизнесом",

    /* --- Поиск --- */
    "search.ph": "Поиск товаров…",
    "search.start": "Начните вводить название товара",
    "search.none": "Ничего не найдено",

    /* --- Футер --- */
    "footer.brandDesc": "Мангалы, казаны, ножи, самовары, садовая мебель и многое другое. Грозный.",
    "footer.shop": "Магазин",
    "footer.info": "Информация",
    "footer.contacts": "Контакты",
    "footer.about": "О нас",
    "footer.copyright": "© 2026 Ваш отдых, Грозный",
    "footer.made": "Сделано с заботой о деталях",

    /* --- Мобильное меню --- */
    "menu.lang": "Язык",
    "menu.theme": "Тема",

    /* --- Тосты --- */
    "toast.addCart": "Добавлено в корзину",
    "toast.rmCart": "Удалено из корзины",
    "toast.clearCart": "Корзина очищена",
    "toast.rmFav": "Убрано из избранного",
    "toast.addFav": "Добавлено в избранное",
    "toast.needNamePhone": "Укажите имя и телефон",
    "toast.orderReady": "Заявка сформирована — продолжите в WhatsApp",

    /* --- Прочее --- */
    "wa.orderHello": "Здравствуйте! Хочу сделать заказ в «Ваш отдых»:",
    "wa.total": "Итого:",
    "wa.name": "Имя:",
    "wa.phone": "Телефон:",
    "wa.comment": "Комментарий:",
  },

  en: {
    /* --- Navigation --- */
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.collab": "Partnership",
    "nav.about": "About",
    "nav.fav": "Wishlist",
    "nav.cart": "Cart",
    "brand.city": "Grozny",

    /* --- Intro --- */
    "intro.hint": "Tap the logo",

    /* --- Hero --- */
    "hero.motto": "Your leisure is our care",
    "hero.title": 'Everything for <span class="accent">leisure &amp; living</span> with pleasure',
    "hero.desc": "Grills and barbecues, cauldrons (kazans), cast-iron cookware, knives and blades, samovars, garden furniture, gift sets — and much more in one store in Grozny.",
    "hero.btnCatalog": "Browse catalog",
    "hero.btnAbout": "About us",
    "hero.tagAddr": "Grozny — two stores",

    /* --- Addresses --- */
    "addr.petropavlovskoye": "Grozny, Petropavlovskoye Hwy, 10b",
    "addr.saikhanova": "Grozny, Saikhanova St, 69",

    /* --- Home sections --- */
    "home.categories": "Categories",
    "home.hits": "Bestsellers",
    "home.hitsSub": "Most popular choices",
    "home.allProducts": "All products",
    "home.new": "New arrivals",
    "home.newSub": "Recently added",
    "home.why": "Why «Vash Otdykh»",
    "home.related": "Related products",
    "ben1.h": "Personally vetted",
    "ben1.p": "We pick the products ourselves and sell only what we'd proudly use at our own home",
    "ben2.h": "Pickup & delivery",
    "ben2.p": "Collect at our store in Grozny or arrange delivery around the city",
    "ben3.h": "We help you choose",
    "ben3.p": "Ask us anything — we'll suggest the right option over WhatsApp",
    "ben4.h": "Open every day",
    "ben4.p": "Drop by any time — we're almost always here",

    /* --- Catalog --- */
    "catalog.title": "Catalog",
    "catalog.found": "Products found: ",
    "sort.popular": "Popular",
    "sort.cheap": "Cheapest first",
    "sort.expensive": "Most expensive first",
    "sort.rating": "By rating",

    /* --- Card / badges --- */
    "badge.hit": "Hit",
    "badge.new": "New",
    "badge.sale": "Sale",
    "price.ask": "Ask price",

    /* --- Product --- */
    "pd.feat1": "Personally checked before sale",
    "pd.feat2": "View and pick up at our store in Grozny",
    "pd.feat3": "We'll help you choose by phone or WhatsApp",
    "pd.askWa": "Ask price on WhatsApp",
    "pd.orderWa": "Order on WhatsApp",
    "pd.toCart": "Add to cart",
    "pd.inCart": "In cart ✓",
    "pd.rating": "product rating",

    /* --- Wishlist --- */
    "fav.emptyT": "Your wishlist is empty",
    "fav.emptyP": "Tap the heart on products to save them here",
    "fav.emptyBtn": "Go to catalog",

    /* --- Cart --- */
    "cart.title": "Cart",
    "cart.emptyT": "Your cart is empty",
    "cart.emptyP": "Add products to place an order request",
    "cart.emptyBtn": "Go to catalog",
    "cart.clear": "Clear cart",
    "cart.remove": "Remove",
    "cart.priceTBD": "price on request",
    "cart.checkoutTitle": "Order request",
    "cart.count": "Items",
    "cart.total": "Total",
    "cart.tbd": "on request",
    "cart.pcs": "pcs",
    "cart.name": "Your name",
    "cart.namePh": "How should we address you",
    "cart.phone": "Phone",
    "cart.comment": "Comment (optional)",
    "cart.commentPh": "E.g. a convenient time to call",
    "cart.submit": "Send request on WhatsApp",
    "cart.disclaimer": "By clicking the button you'll open WhatsApp with a ready order message",

    /* --- About --- */
    "about.title": "About the store",
    "about.p1": '<strong>«Vash Otdykh»</strong> is a store for those who love to cook, host guests, hunt, fish and simply live for pleasure. We\'ve been working since <strong>2013</strong> and have helped thousands of families across Russia find just what they needed.',
    "about.p2": "Our range includes grills and barbecues, cauldrons and cast-iron cookware, knives and blades by Kizlyar masters, samovars from classic wood-fired to large Turkish ones, rattan garden furniture, signature barbecue gift sets and marbled-beef steaks.",
    "about.whyH": "Why customers choose us",
    "about.p3": "We personally check every product. Not sure what to pick? Call or message us on WhatsApp and we'll suggest the best option for your needs. <strong>We deliver across Russia.</strong>",
    "about.p4": "Two stores in Grozny — come see and pick up in person any day from 9:00 to 19:00.",
    "about.motto": '"Your leisure is our care"',
    "about.addresses": "Addresses",
    "about.hoursLbl": "Opening hours",
    "about.phoneLbl": "Phone / WhatsApp",
    "about.waLink": "Message on WhatsApp",
    "about.emailLbl": "E-mail",
    "about.deliveryLbl": "Delivery",
    "info.hours": "Daily 9:00–19:00, no days off",
    "info.delivery": "Delivery across Russia",

    /* --- Partnership --- */
    "collab.title": "Partnership",
    "collab.sub": "Open to partnership and wholesale orders",
    "collab.intro": "We're open to joint projects — whether wholesale purchases, event catering or partnership with other stores. Message us — we reply fast.",
    "collab.waCta": "Message us",
    "collab.igCta": "Follow & message",
    "collab.mailCta": "Send an email",
    "collab.f1t": "Since 2013",
    "collab.f1s": "over 10 years in business",
    "collab.f2t": "Two stores",
    "collab.f2s": "right in the center of Grozny",
    "collab.f3t": "Delivery across Russia",
    "collab.f3s": "fast and reliable",
    "collab.f4t": "Wholesale & partnership",
    "collab.f4s": "we work with businesses",

    /* --- Search --- */
    "search.ph": "Search products…",
    "search.start": "Start typing a product name",
    "search.none": "Nothing found",

    /* --- Footer --- */
    "footer.brandDesc": "Grills, cauldrons, knives, samovars, garden furniture and much more. Grozny.",
    "footer.shop": "Store",
    "footer.info": "Information",
    "footer.contacts": "Contacts",
    "footer.about": "About",
    "footer.copyright": "© 2026 Vash Otdykh, Grozny",
    "footer.made": "Made with care for detail",

    /* --- Mobile menu --- */
    "menu.lang": "Language",
    "menu.theme": "Theme",

    /* --- Toasts --- */
    "toast.addCart": "Added to cart",
    "toast.rmCart": "Removed from cart",
    "toast.clearCart": "Cart cleared",
    "toast.rmFav": "Removed from wishlist",
    "toast.addFav": "Added to wishlist",
    "toast.needNamePhone": "Please enter your name and phone",
    "toast.orderReady": "Request prepared — continue in WhatsApp",

    /* --- Misc --- */
    "wa.orderHello": "Hello! I'd like to place an order at «Vash Otdykh»:",
    "wa.total": "Total:",
    "wa.name": "Name:",
    "wa.phone": "Phone:",
    "wa.comment": "Comment:",
  },
};

let _lang = localStorage.getItem("vo_lang") || "ru";

function getLang() { return _lang; }

function setLang(l) {
  _lang = l === "en" ? "en" : "ru";
  localStorage.setItem("vo_lang", _lang);
  document.documentElement.lang = _lang;
}

function t(key) {
  const dict = I18N[_lang] || I18N.ru;
  if (key in dict) return dict[key];
  return key in I18N.ru ? I18N.ru[key] : key;
}

/* Перевод названия/описания товара (с откатом на русский) */
function tp(p, field) {
  if (_lang === "en") {
    const enKey = field + "En";
    if (p[enKey]) return p[enKey];
  }
  return p[field];
}

/* Применить перевод к статическим элементам с data-i18n */
function applyStaticI18n(scope) {
  const root = scope || document;
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
}

/* Инициализация языка на старте (до отрисовки) */
document.documentElement.lang = _lang;
