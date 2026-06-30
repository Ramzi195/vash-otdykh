/* ==========================================================================
   Ваш отдых — логика приложения
   Корзина = заявка на заказ (без онлайн-оплаты, оффлайн-магазин).
   Оформление уходит в WhatsApp готовым сообщением с составом заказа.
   ========================================================================== */

(() => {
  "use strict";

  /* ---- Используем SHOP_CONFIG из js/config.js ---- */
  const SHOP = {
    phone:        SHOP_CONFIG.phone,
    phoneDisplay: SHOP_CONFIG.phoneFmt,
    address:      SHOP_CONFIG.addresses[0],
    hours:        SHOP_CONFIG.hours,
    instagram:    SHOP_CONFIG.instagram,
  };
  const mapsUrl = "https://yandex.ru/maps/?text=" + encodeURIComponent(SHOP_CONFIG.addresses.join(", "));
  const waBase  = (text) => `https://wa.me/${SHOP.phone}?text=${encodeURIComponent(text)}`;

  /* ---------------------- Состояние ---------------------- */
  const LS = { cart: "vashotdih_cart", favs: "vashotdih_favs" };
  const state = {
    cart: JSON.parse(localStorage.getItem(LS.cart) || "{}"),
    favs: JSON.parse(localStorage.getItem(LS.favs) || "[]"),
    filter: "all",
    sort: "popular",
  };
  const save = () => {
    localStorage.setItem(LS.cart, JSON.stringify(state.cart));
    localStorage.setItem(LS.favs, JSON.stringify(state.favs));
  };

  /* ---------------------- Утилиты ---------------------- */
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const money = (n) => n.toLocaleString("ru-RU") + " ₽";
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || id;

  function priceHTML(p, big = false) {
    if (p.price == null) {
      return `<span class="${big ? "now" : "now"}" style="font-size:${big ? "22px" : "16px"}">${p.priceNote || "Узнать цену"}</span>`;
    }
    return `<span class="now">${money(p.price)}</span>${p.priceNote ? `<span class="note">${p.priceNote}</span>` : ""}`;
  }

  /* ---------------------- Карточка товара ---------------------- */
  function cardHTML(p) {
    const fav = state.favs.includes(p.id);
    const badgeHTML = p.badge ? `<span class="chip ${p.badge}">${
      p.badge === "hit" ? "Хит" : p.badge === "new" ? "Новинка" : "Скидка"
    }</span>` : "";
    const favInner = fav ? icon("heart-fill", 16) : icon("heart", 16);
    const askMode = p.price == null;

    return `
<article class="card reveal" data-id="${p.id}">
  <div class="card-badges">${badgeHTML}</div>
  <button class="fav-btn ${fav ? "on" : ""}" data-fav="${p.id}" aria-label="В избранное">${favInner}</button>
  <div class="card-media" data-open="${p.id}">
    <img src="${p.img}" alt="${p.name}" style="object-position:${p.pos || "center"}" loading="lazy" />
  </div>
  <div class="card-body">
    <div class="card-cat">${catName(p.cat)}</div>
    <div class="card-title" data-open="${p.id}">${p.name}</div>
    <div class="card-desc">${p.desc}</div>
    <div class="card-rating">${icon("star-fill", 13)}<span>${p.rating.toFixed(1)}</span></div>
    <div class="card-foot">
      <div class="price">${priceHTML(p)}</div>
      ${askMode
        ? `<button class="add-btn ask" data-ask="${p.id}" aria-label="Узнать цену">${icon("chat", 17)}</button>`
        : `<button class="add-btn" data-add="${p.id}" aria-label="В корзину">${icon("plus", 18)}</button>`}
    </div>
  </div>
</article>`;
  }

  const renderGrid = (el, list) => { el.innerHTML = list.map(cardHTML).join(""); observeReveals(el); };

  /* ---------------------- Главная ---------------------- */
  function renderHome() {
    $("#catStrip").innerHTML = CATEGORIES.filter((c) => c.id !== "all").map((c) => `
      <button class="cat-tile" data-cat="${c.id}">
        <div class="ic">${icon(CAT_ICON_MAP[c.id] || "bag", 20)}</div>
        <div class="nm">${c.name}</div>
      </button>`).join("");

    const BENS = [
      { el: "benIco1", ic: "shield-check" },
      { el: "benIco2", ic: "truck" },
      { el: "benIco3", ic: "chat" },
      { el: "benIco4", ic: "clock" },
    ];
    BENS.forEach(({ el, ic: ic_ }) => { const e = $("#" + el); if (e) e.innerHTML = icon(ic_, 22); });

    renderGrid($("#gridHits"), PRODUCTS.filter((p) => p.badge === "hit").slice(0, 8));
    const news = PRODUCTS.filter((p) => p.badge === "new")
      .concat(PRODUCTS.filter((p) => p.badge !== "new")).slice(0, 4);
    renderGrid($("#gridNew"), news);
  }

  /* ---------------------- Каталог ---------------------- */
  function renderCatalogBar() {
    $("#filterPills").innerHTML = CATEGORIES.map((c) => `
      <button class="pill ${state.filter === c.id ? "active" : ""}" data-cat="${c.id}">${c.name}</button>`).join("");
    const sel = $("#sortSelect");
    if (sel) sel.value = state.sort;
  }
  function renderCatalog() {
    renderCatalogBar();
    let list = PRODUCTS.filter((p) => state.filter === "all" || p.cat === state.filter);
    list = sortList(list, state.sort);
    const cnt = $("#catalogCount");
    if (cnt) cnt.textContent = "Найдено товаров: " + list.length;
    renderGrid($("#gridCatalog"), list);
  }
  function sortList(list, sort) {
    const a = [...list];
    if (sort === "cheap")      a.sort((x, y) => (x.price ?? 1e9) - (y.price ?? 1e9));
    else if (sort === "expensive") a.sort((x, y) => (y.price ?? -1) - (x.price ?? -1));
    else if (sort === "rating")    a.sort((x, y) => y.rating - x.rating);
    else a.sort((x, y) => (y.badge === "hit") - (x.badge === "hit") || y.rating - x.rating);
    return a;
  }

  /* ---------------------- Деталь товара ---------------------- */
  function renderProduct(id) {
    const p = byId(id);
    if (!p) { go("catalog"); return; }
    const fav = state.favs.includes(p.id);
    const inCart = !!state.cart[p.id];
    const askMode = p.price == null;

    const feats = [
      "Проверено лично перед продажей",
      "Можно посмотреть и забрать в магазине в Грозном",
      "Поможем с выбором по телефону или в WhatsApp",
    ];

    $("#pdContent").innerHTML = `
<div class="pd-media"><img src="${p.img}" alt="${p.name}" style="object-position:${p.pos || "center"}" /></div>
<div class="pd-info">
  <div class="crumbs">
    <a class="link-arrow" data-nav="catalog" style="font-size:13px">${icon("chevron-left", 14)} ${catName(p.cat)}</a>
  </div>
  <h1>${p.name}</h1>
  <p class="lead">${p.desc}</p>
  <div class="pd-price">${priceHTML(p, true)}</div>
  <div class="pd-actions">
    ${askMode
      ? `<a class="btn ember lg" href="${waBase(`Здравствуйте! Хочу узнать цену на «${p.name}» (Ваш отдых).`)}" target="_blank" rel="noopener">${icon("chat", 18)} Узнать цену в WhatsApp</a>`
      : `<button class="btn lg" data-add="${p.id}">${icon("bag", 18)} ${inCart ? "В корзине ✓" : "В корзину"}</button>
         <a class="btn ember lg" href="${waBase(`Здравствуйте! Хочу заказать «${p.name}» — ${money(p.price)} (Ваш отдых).`)}" target="_blank" rel="noopener">${icon("chat", 18)} Заказать в WhatsApp</a>`}
    <button class="btn outline lg" data-fav="${p.id}" style="padding:14px 18px">${fav ? icon("heart-fill", 18) : icon("heart", 18)}</button>
  </div>
  <div class="pd-feats">
    ${feats.map((f) => `<div class="pd-feat"><span class="dot">${icon("check", 16)}</span> ${f}</div>`).join("")}
  </div>
  <div style="margin-top:20px;display:flex;align-items:center;gap:6px;color:var(--label-2)">
    ${icon("star-fill", 13)} <span style="font-size:14px">${p.rating.toFixed(1)} рейтинг товара</span>
  </div>
</div>`;

    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const pool = related.length ? related : PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
    renderGrid($("#gridRelated"), pool);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------------- Избранное ---------------------- */
  function renderFav() {
    const list = state.favs.map(byId).filter(Boolean);
    const body = $("#favBody");
    if (!list.length) {
      body.innerHTML = emptyHTML(icon("heart", 32), "В избранном пусто", "Нажимайте на сердечко у товаров, чтобы сохранить их здесь", "Перейти в каталог", "catalog");
      return;
    }
    body.innerHTML = `<div class="grid">${list.map(cardHTML).join("")}</div>`;
    observeReveals(body);
  }

  /* ---------------------- Корзина ---------------------- */
  const cartEntries = () => Object.entries(state.cart).map(([id, qty]) => ({ p: byId(id), qty })).filter((e) => e.p);
  const cartTotal = () => cartEntries().reduce((s, e) => s + (e.p.price || 0) * e.qty, 0);
  const cartQty   = () => Object.values(state.cart).reduce((s, q) => s + q, 0);

  function renderCart() {
    const entries = cartEntries();
    const body = $("#cartBody");
    if (!entries.length) {
      body.innerHTML = emptyHTML(icon("bag", 32), "Корзина пуста", "Добавьте товары, чтобы оформить заявку на заказ", "Перейти в каталог", "catalog");
      return;
    }
    const total = cartTotal();

    body.innerHTML = `
<div class="cart-wrap">
  <div>
    ${entries.map(({ p, qty }) => `
<div class="cart-item">
  <div class="thumb"><img src="${p.img}" alt="${p.name}" style="object-position:${p.pos || "center"}" /></div>
  <div class="meta">
    <div class="t" data-open="${p.id}">${p.name}</div>
    <div class="c">${catName(p.cat)} · ${p.price != null ? money(p.price) : "цена уточняется"}</div>
    <div class="qty">
      <button data-dec="${p.id}">${icon("minus", 14)}</button>
      <span>${qty}</span>
      <button data-inc="${p.id}">${icon("plus", 14)}</button>
    </div>
  </div>
  <div class="right">
    <div class="sum">${p.price != null ? money(p.price * qty) : "—"}</div>
    <div class="rm" data-rm="${p.id}">${icon("trash", 13)} Удалить</div>
  </div>
</div>`).join("")}
    <p style="margin-top:16px">
      <a class="link-arrow" data-clear="1" style="cursor:pointer;color:var(--ember-2)">${icon("trash", 15)} Очистить корзину</a>
    </p>
  </div>

  <aside class="summary">
    <h3>Оформление заявки</h3>
    <div class="row"><span>Товаров</span><span>${cartQty()} шт.</span></div>
    <div class="row total"><span>Итого</span><span>${total > 0 ? money(total) : "уточняется"}</span></div>
    <div class="order-form">
      <label for="ofName">Ваше имя</label>
      <input type="text" id="ofName" placeholder="Как к вам обращаться" />
      <label for="ofPhone">Телефон</label>
      <input type="tel" id="ofPhone" placeholder="+7 (___) ___-__-__" />
      <label for="ofComment">Комментарий (необязательно)</label>
      <textarea id="ofComment" placeholder="Например: удобное время для звонка"></textarea>
    </div>
    <button class="btn ember block lg" style="margin-top:14px" data-checkout="1">${icon("chat", 18)} Отправить заявку в WhatsApp</button>
    <p style="font-size:12px;color:var(--label-2);margin-top:10px;text-align:center">
      Нажимая кнопку, вы перейдёте в WhatsApp с готовым сообщением о заказе
    </p>
  </aside>
</div>`;
  }

  /* ---------------------- О нас ---------------------- */
  function renderAbout() {
    const addrLinks = SHOP_CONFIG.addresses
      .map(a => `<a href="https://yandex.ru/maps/?text=${encodeURIComponent(a)}" target="_blank" rel="noopener">${a}</a>`)
      .join("<br>");

    $("#aboutContacts").innerHTML = `
<div class="contact-row">
  <div class="ic">${icon("map-pin", 18)}</div>
  <div><div class="t">Адреса</div><div class="v">${addrLinks}</div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("clock", 18)}</div>
  <div><div class="t">Часы работы</div><div class="v">${SHOP_CONFIG.hours}</div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("phone", 18)}</div>
  <div><div class="t">Телефон / WhatsApp</div><div class="v">
    <a href="tel:+${SHOP_CONFIG.phone}">${SHOP_CONFIG.phoneFmt}</a>
    &nbsp;·&nbsp;
    <a href="${SHOP_CONFIG.socials.whatsapp}?text=${encodeURIComponent(SHOP_CONFIG.whatsappMsg)}" target="_blank" rel="noopener">Написать в WhatsApp</a>
  </div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("chat", 18)}</div>
  <div><div class="t">E-mail</div><div class="v"><a href="mailto:${SHOP_CONFIG.email}">${SHOP_CONFIG.email}</a></div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("bag", 18)}</div>
  <div><div class="t">Instagram</div><div class="v"><a href="${SHOP_CONFIG.socials.instagram}" target="_blank" rel="noopener">@${SHOP_CONFIG.instagram}</a></div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("truck", 18)}</div>
  <div><div class="t">Доставка</div><div class="v">${SHOP_CONFIG.delivery}</div></div>
</div>`;
  }

  /* ---------------------- Сотрудничество ---------------------- */
  function renderCollab() {
    const el = $("#collabBody");
    if (!el) return;
    el.innerHTML = `
<div class="collab-intro">
  <p>Мы открыты для совместных проектов — будь то оптовые закупки, оформление мероприятий или партнёрство с другими магазинами. Пишите — отвечаем быстро.</p>
</div>
<div class="collab-cards">
  <a href="${SHOP_CONFIG.socials.whatsapp}?text=${encodeURIComponent("Здравствуйте! Хочу обсудить сотрудничество с «Ваш отдых».")}" target="_blank" rel="noopener" class="collab-card collab-wa">
    <div class="collab-card-ic">${icon("chat", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">WhatsApp</div>
      <div class="collab-card-sub">${SHOP_CONFIG.phoneFmt}</div>
      <div class="collab-card-cta">Написать нам</div>
    </div>
  </a>
  <a href="${SHOP_CONFIG.socials.instagram}" target="_blank" rel="noopener" class="collab-card collab-ig">
    <div class="collab-card-ic">${icon("ig", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">Instagram</div>
      <div class="collab-card-sub">@${SHOP_CONFIG.instagram}</div>
      <div class="collab-card-cta">Подписаться и написать</div>
    </div>
  </a>
  <a href="mailto:${SHOP_CONFIG.email}" class="collab-card collab-mail">
    <div class="collab-card-ic">${icon("mail", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">E-mail</div>
      <div class="collab-card-sub">${SHOP_CONFIG.email}</div>
      <div class="collab-card-cta">Отправить письмо</div>
    </div>
  </a>
</div>
<div class="collab-facts">
  <div class="collab-fact"><strong>${new Date().getFullYear() - SHOP_CONFIG.since}</strong><span>лет на рынке</span></div>
  <div class="collab-fact"><strong>2</strong><span>магазина в Грозном</span></div>
  <div class="collab-fact"><strong>∞</strong><span>доставка по России</span></div>
</div>`;
  }

  /* ---------------------- Пустые состояния ---------------------- */
  function emptyHTML(icHTML, title, text, btn, nav) {
    return `<div class="empty"><div class="em">${icHTML}</div><h3>${title}</h3><p>${text}</p><a class="btn lg" data-nav="${nav}">${btn}</a></div>`;
  }

  /* ---------------------- Действия корзины/избранного ---------------------- */
  function addToCart(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    save(); updateBadges(); bumpCartBtn();
    toast("Добавлено в корзину", "bag");
    const v = currentView();
    if (v === "cart") renderCart();
    if (v === "product") renderProduct(id);
  }
  function incCart(id) { state.cart[id] = (state.cart[id] || 0) + 1; save(); updateBadges(); renderCart(); }
  function decCart(id) {
    state.cart[id] = (state.cart[id] || 0) - 1;
    if (state.cart[id] <= 0) delete state.cart[id];
    save(); updateBadges(); renderCart();
  }
  function rmCart(id)  { delete state.cart[id]; save(); updateBadges(); toast("Удалено из корзины", "trash"); renderCart(); }
  function clearCart()  { state.cart = {}; save(); updateBadges(); toast("Корзина очищена", "trash"); renderCart(); }

  function toggleFav(id) {
    const i = state.favs.indexOf(id);
    if (i >= 0) { state.favs.splice(i, 1); toast("Убрано из избранного", "heart"); }
    else        { state.favs.push(id);     toast("Добавлено в избранное", "heart-fill"); }
    save(); updateBadges(); refreshCurrent();
  }

  function checkout() {
    const entries = cartEntries();
    if (!entries.length) return;
    const name = $("#ofName").value.trim();
    const phone = $("#ofPhone").value.trim();
    const comment = $("#ofComment").value.trim();

    if (!name || !phone) {
      toast("Укажите имя и телефон", "chat");
      return;
    }

    let lines = ["Здравствуйте! Хочу сделать заказ в «Ваш отдых»:", ""];
    entries.forEach(({ p, qty }, i) => {
      const priceStr = p.price != null ? money(p.price * qty) : "цена уточняется";
      lines.push(`${i + 1}. ${p.name} — ${qty} шт. (${priceStr})`);
    });
    const total = cartTotal();
    lines.push("");
    lines.push(`Итого: ${total > 0 ? money(total) : "уточняется"}`);
    lines.push("");
    lines.push(`Имя: ${name}`);
    lines.push(`Телефон: ${phone}`);
    if (comment) lines.push(`Комментарий: ${comment}`);

    window.open(waBase(lines.join("\n")), "_blank", "noopener");

    state.cart = {}; save(); updateBadges();
    toast("Заявка сформирована — продолжите в WhatsApp", "check");
    renderCart();
  }

  function askPrice(id) {
    const p = byId(id);
    if (!p) return;
    window.open(waBase(`Здравствуйте! Хочу узнать цену на «${p.name}» (Ваш отдых).`), "_blank", "noopener");
  }

  /* ---------------------- Бейджи ---------------------- */
  function updateBadges() {
    const cc = $("#cartCount"), fc = $("#favCount");
    const cq = cartQty(), fq = state.favs.length;
    cc.textContent = cq; fc.textContent = fq;
    cc.classList.toggle("show", cq > 0);
    fc.classList.toggle("show", fq > 0);
  }
  function bumpCartBtn() {
    const btn = $("#cartBtn");
    btn.style.transform = "scale(1.3)";
    btn.style.transition = "transform .18s var(--spring)";
    setTimeout(() => { btn.style.transform = ""; }, 200);
  }

  /* ---------------------- Тосты ---------------------- */
  function toast(msg, icName) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `${icName ? `<span class="t-ic">${icon(icName, 16)}</span>` : ""} ${msg}`;
    $("#toastWrap").appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .28s, transform .28s";
      el.style.opacity = "0"; el.style.transform = "translateY(10px) scale(.94)";
      setTimeout(() => el.remove(), 300);
    }, 2400);
  }

  /* ---------------------- Маршрутизация ---------------------- */
  const VIEWS = ["home", "catalog", "product", "fav", "cart", "about", "collab"];
  let _view = "home";
  const currentView = () => _view;

  function go(view, param) {
    const hash = param ? `#${view}/${param}` : `#${view}`;
    if (location.hash !== hash) { location.hash = hash; return; }
    route();
  }
  function route() {
    const raw = location.hash.replace(/^#/, "") || "home";
    const [view, param] = raw.split("/");
    const v = VIEWS.includes(view) ? view : "home";
    _view = v;

    $$(".view").forEach((s) => s.classList.remove("active"));
    const sec = $("#view-" + v);
    if (sec) sec.classList.add("active");
    $$(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.nav === v));

    if (v === "home") renderHome();
    else if (v === "catalog") renderCatalog();
    else if (v === "product") renderProduct(param);
    else if (v === "fav") renderFav();
    else if (v === "cart") renderCart();
    else if (v === "about")  renderAbout();
    else if (v === "collab") renderCollab();

    if (v !== "product") window.scrollTo({ top: 0, behavior: "auto" });
    closeMenu();
  }
  function refreshCurrent() {
    const v = currentView(); const param = location.hash.split("/")[1];
    if (v === "home") renderHome();
    else if (v === "catalog") renderCatalog();
    else if (v === "product") renderProduct(param);
    else if (v === "fav") renderFav();
    else if (v === "cart") renderCart();
    else if (v === "about")  renderAbout();
    else if (v === "collab") renderCollab();
  }

  /* ---------------------- Поиск ---------------------- */
  function openSearch()  { $("#searchOverlay").classList.add("open"); setTimeout(() => $("#searchInput").focus(), 60); renderSearch(""); }
  function closeSearch() { $("#searchOverlay").classList.remove("open"); $("#searchInput").value = ""; }
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const res = $("#searchResults");
    if (!q) { res.innerHTML = `<p style="color:var(--label-2);padding:14px 4px;font-size:14px">Начните вводить название товара</p>`; return; }
    const list = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || catName(p.cat).toLowerCase().includes(q));
    if (!list.length) { res.innerHTML = `<p style="color:var(--label-2);padding:14px 4px;font-size:14px">Ничего не найдено</p>`; return; }
    res.innerHTML = list.map((p) => `
<div class="search-row" data-open="${p.id}">
  <div class="thumb"><img src="${p.img}" alt="" style="object-position:${p.pos || "center"}" /></div>
  <div><div class="nm">${p.name}</div><div class="cat">${catName(p.cat)}</div></div>
  <span class="pr">${p.price != null ? money(p.price) : "Узнать цену"}</span>
</div>`).join("");
  }

  /* ---------------------- Мобильное меню ---------------------- */
  function openMenu()  { $("#mmenu").classList.add("open"); }
  function closeMenu() { $("#mmenu").classList.remove("open"); }

  /* ---------------------- Scroll-reveal ---------------------- */
  let observer;
  function initObserver() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); } });
    }, { threshold: 0.06 });
  }
  function observeReveals(scope = document) { $$(".reveal:not(.in)", scope).forEach((el) => observer.observe(el)); }

  /* ---------------------- Заставка + "вау"-эффект ---------------------- */
  function playIntro() {
    const intro = $("#intro");
    const logo  = $("#introLogo");
    let burst = false;

    function doHide() { intro.classList.add("hidden"); }

    function doBurst(e) {
      if (burst) return; burst = true;
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // вспышка экрана
      const flash = document.createElement("div");
      flash.className = "flash go";
      intro.appendChild(flash);

      // ударные кольца
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement("div");
        ring.className = "shock-ring";
        ring.style.left = cx + "px"; ring.style.top = cy + "px";
        intro.appendChild(ring);
        setTimeout(() => ring.classList.add("go"), i * 120);
      }

      // искры в стороны
      for (let i = 0; i < 24; i++) {
        const spark = document.createElement("span");
        spark.className = "ember-spark";
        const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.3;
        const dist = 120 + Math.random() * 220;
        spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        spark.style.left = cx + "px"; spark.style.top = cy + "px";
        intro.appendChild(spark);
        setTimeout(() => spark.classList.add("go"), 10);
      }

      logo.style.transition = "transform .5s var(--spring)";
      logo.style.transform = "scale(1.15)";

      setTimeout(doHide, 750);
    }

    intro.addEventListener("click", doBurst);
    setTimeout(() => { if (!burst) doHide(); }, 4200);
  }

  /* ---------------------- Делегирование событий ---------------------- */
  function wireEvents() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest(
        "[data-add],[data-fav],[data-open],[data-cat],[data-nav],[data-inc],[data-dec],[data-rm],[data-clear],[data-checkout],[data-ask]"
      );
      if (!el) return;
      if (el.dataset.add)      { e.preventDefault(); addToCart(el.dataset.add); return; }
      if (el.dataset.ask)      { e.preventDefault(); askPrice(el.dataset.ask);  return; }
      if (el.dataset.fav)      { e.preventDefault(); toggleFav(el.dataset.fav); return; }
      if (el.dataset.inc)      { e.preventDefault(); incCart(el.dataset.inc);   return; }
      if (el.dataset.dec)      { e.preventDefault(); decCart(el.dataset.dec);   return; }
      if (el.dataset.rm)       { e.preventDefault(); rmCart(el.dataset.rm);     return; }
      if (el.dataset.clear)    { e.preventDefault(); clearCart();                return; }
      if (el.dataset.checkout) { e.preventDefault(); checkout();                 return; }
      if (el.dataset.open) { e.preventDefault(); closeSearch(); go("product", el.dataset.open); return; }
      if (el.dataset.cat != null) { e.preventDefault(); state.filter = el.dataset.cat; state.sort = "popular"; go("catalog"); return; }
      if (el.dataset.nav) { e.preventDefault(); go(el.dataset.nav); return; }
    });

    $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderCatalog(); });
    $("#searchBtn").addEventListener("click", openSearch);
    $("#searchClose").addEventListener("click", closeSearch);
    $("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSearch(); });
    $("#cartBtn").addEventListener("click", () => go("cart"));
    $("#favBtn").addEventListener("click",  () => go("fav"));
    $("#burgerBtn").addEventListener("click", openMenu);
    $("#mmenuClose").addEventListener("click", closeMenu);
    window.addEventListener("hashchange", route);
  }

  /* ---------------------- Инициализация ---------------------- */
  function init() {
    initObserver();
    wireEvents();
    updateBadges();
    route();
    observeReveals(document);
    playIntro();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
