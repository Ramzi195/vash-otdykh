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
  const catName = (id) => {
    const c = CATEGORIES.find((c) => c.id === id);
    if (!c) return id;
    return getLang() === "en" && c.nameEn ? c.nameEn : c.name;
  };

  /* Перевод подписи к цене (priceNote) на текущий язык */
  function noteText(p) {
    const n = p.priceNote;
    if (!n) return t("price.ask");
    if (getLang() === "en") {
      const map = {
        "узнать цену": t("price.ask"),
        "цена за кг — уточняйте": "price per kg — on request",
      };
      return map[n.toLowerCase()] || n;
    }
    return n;
  }

  function priceHTML(p, big = false) {
    if (p.price == null) {
      return `<span class="now" style="font-size:${big ? "22px" : "16px"}">${noteText(p)}</span>`;
    }
    return `<span class="now">${money(p.price)}</span>${p.priceNote ? `<span class="note">${noteText(p)}</span>` : ""}`;
  }

  /* ---------------------- Карточка товара ---------------------- */
  function cardHTML(p) {
    const fav = state.favs.includes(p.id);
    const badgeHTML = p.badge ? `<span class="chip ${p.badge}">${
      p.badge === "hit" ? t("badge.hit") : p.badge === "new" ? t("badge.new") : t("badge.sale")
    }</span>` : "";
    const favInner = fav ? icon("heart-fill", 16) : icon("heart", 16);
    const askMode = p.price == null;

    return `
<article class="card reveal" data-id="${p.id}">
  <div class="card-badges">${badgeHTML}</div>
  <button class="fav-btn ${fav ? "on" : ""}" data-fav="${p.id}" aria-label="В избранное">${favInner}</button>
  <div class="card-media" data-open="${p.id}">
    <img src="${p.img}" alt="${tp(p, "name")}" style="object-position:${p.pos || "center"}" loading="lazy" />
  </div>
  <div class="card-body">
    <div class="card-cat">${catName(p.cat)}</div>
    <div class="card-title" data-open="${p.id}">${tp(p, "name")}</div>
    <div class="card-desc">${tp(p, "desc")}</div>
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
        <div class="nm">${catName(c.id)}</div>
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
      <button class="pill ${state.filter === c.id ? "active" : ""}" data-cat="${c.id}">${catName(c.id)}</button>`).join("");
    const sel = $("#sortSelect");
    if (sel) sel.value = state.sort;
  }
  function renderCatalog() {
    renderCatalogBar();
    let list = PRODUCTS.filter((p) => state.filter === "all" || p.cat === state.filter);
    list = sortList(list, state.sort);
    const cnt = $("#catalogCount");
    if (cnt) cnt.textContent = t("catalog.found") + list.length;
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

    const feats = [t("pd.feat1"), t("pd.feat2"), t("pd.feat3")];
    const pName = tp(p, "name");

    $("#pdContent").innerHTML = `
<div class="pd-media"><img src="${p.img}" alt="${pName}" style="object-position:${p.pos || "center"}" /></div>
<div class="pd-info">
  <div class="crumbs">
    <a class="link-arrow" data-nav="catalog" style="font-size:13px">${icon("chevron-left", 14)} ${catName(p.cat)}</a>
  </div>
  <h1>${pName}</h1>
  <p class="lead">${tp(p, "desc")}</p>
  <div class="pd-price">${priceHTML(p, true)}</div>
  <div class="pd-actions">
    ${askMode
      ? `<a class="btn ember lg" href="${waBase(`${t("wa.orderHello").replace(":", "")} ${pName}`)}" target="_blank" rel="noopener">${icon("chat", 18)} ${t("pd.askWa")}</a>`
      : `<button class="btn lg" data-add="${p.id}">${icon("bag", 18)} ${inCart ? t("pd.inCart") : t("pd.toCart")}</button>
         <a class="btn ember lg" href="${waBase(`${t("wa.orderHello").replace(":", "")} ${pName} — ${money(p.price)}`)}" target="_blank" rel="noopener">${icon("chat", 18)} ${t("pd.orderWa")}</a>`}
    <button class="btn outline lg" data-fav="${p.id}" style="padding:14px 18px">${fav ? icon("heart-fill", 18) : icon("heart", 18)}</button>
  </div>
  <div class="pd-feats">
    ${feats.map((f) => `<div class="pd-feat"><span class="dot">${icon("check", 16)}</span> ${f}</div>`).join("")}
  </div>
  <div style="margin-top:20px;display:flex;align-items:center;gap:6px;color:var(--label-2)">
    ${icon("star-fill", 13)} <span style="font-size:14px">${p.rating.toFixed(1)} ${t("pd.rating")}</span>
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
      body.innerHTML = emptyHTML(icon("heart", 32), t("fav.emptyT"), t("fav.emptyP"), t("fav.emptyBtn"), "catalog");
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
      body.innerHTML = emptyHTML(icon("bag", 32), t("cart.emptyT"), t("cart.emptyP"), t("cart.emptyBtn"), "catalog");
      return;
    }
    const total = cartTotal();

    body.innerHTML = `
<div class="cart-wrap">
  <div>
    ${entries.map(({ p, qty }) => `
<div class="cart-item">
  <div class="thumb"><img src="${p.img}" alt="${tp(p, "name")}" style="object-position:${p.pos || "center"}" /></div>
  <div class="meta">
    <div class="t" data-open="${p.id}">${tp(p, "name")}</div>
    <div class="c">${catName(p.cat)} · ${p.price != null ? money(p.price) : t("cart.priceTBD")}</div>
    <div class="qty">
      <button data-dec="${p.id}">${icon("minus", 14)}</button>
      <span>${qty}</span>
      <button data-inc="${p.id}">${icon("plus", 14)}</button>
    </div>
  </div>
  <div class="right">
    <div class="sum">${p.price != null ? money(p.price * qty) : "—"}</div>
    <div class="rm" data-rm="${p.id}">${icon("trash", 13)} ${t("cart.remove")}</div>
  </div>
</div>`).join("")}
    <p style="margin-top:16px">
      <a class="link-arrow" data-clear="1" style="cursor:pointer;color:var(--ember-2)">${icon("trash", 15)} ${t("cart.clear")}</a>
    </p>
  </div>

  <aside class="summary">
    <h3>${t("cart.checkoutTitle")}</h3>
    <div class="row"><span>${t("cart.count")}</span><span>${cartQty()} ${t("cart.pcs")}</span></div>
    <div class="row total"><span>${t("cart.total")}</span><span>${total > 0 ? money(total) : t("cart.tbd")}</span></div>
    <div class="order-form">
      <label for="ofName">${t("cart.name")}</label>
      <input type="text" id="ofName" placeholder="${t("cart.namePh")}" />
      <label for="ofPhone">${t("cart.phone")}</label>
      <input type="tel" id="ofPhone" placeholder="+7 (___) ___-__-__" />
      <label for="ofComment">${t("cart.comment")}</label>
      <textarea id="ofComment" placeholder="${t("cart.commentPh")}"></textarea>
    </div>
    <button class="btn ember block lg" style="margin-top:14px" data-checkout="1">${icon("chat", 18)} ${t("cart.submit")}</button>
    <p style="font-size:12px;color:var(--label-2);margin-top:10px;text-align:center">
      ${t("cart.disclaimer")}
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
  <div><div class="t">${t("about.addresses")}</div><div class="v">${addrLinks}</div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("clock", 18)}</div>
  <div><div class="t">${t("about.hoursLbl")}</div><div class="v">${t("info.hours")}</div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("phone", 18)}</div>
  <div><div class="t">${t("about.phoneLbl")}</div><div class="v">
    <a href="tel:+${SHOP_CONFIG.phone}">${SHOP_CONFIG.phoneFmt}</a>
    &nbsp;·&nbsp;
    <a href="${SHOP_CONFIG.socials.whatsapp}?text=${encodeURIComponent(SHOP_CONFIG.whatsappMsg)}" target="_blank" rel="noopener">${t("about.waLink")}</a>
  </div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("chat", 18)}</div>
  <div><div class="t">${t("about.emailLbl")}</div><div class="v"><a href="mailto:${SHOP_CONFIG.email}">${SHOP_CONFIG.email}</a></div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("bag", 18)}</div>
  <div><div class="t">Instagram</div><div class="v"><a href="${SHOP_CONFIG.socials.instagram}" target="_blank" rel="noopener">@${SHOP_CONFIG.instagram}</a></div></div>
</div>
<div class="contact-row">
  <div class="ic">${icon("truck", 18)}</div>
  <div><div class="t">${t("about.deliveryLbl")}</div><div class="v">${t("info.delivery")}</div></div>
</div>`;
  }

  /* ---------------------- Сотрудничество ---------------------- */
  function renderCollab() {
    const el = $("#collabBody");
    if (!el) return;
    el.innerHTML = `
<div class="collab-intro">
  <p>${t("collab.intro")}</p>
</div>
<div class="collab-cards">
  <a href="${SHOP_CONFIG.socials.whatsapp}?text=${encodeURIComponent("Здравствуйте! Хочу обсудить сотрудничество с «Ваш отдых».")}" target="_blank" rel="noopener" class="collab-card collab-wa">
    <div class="collab-card-ic">${icon("chat", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">WhatsApp</div>
      <div class="collab-card-sub">${SHOP_CONFIG.phoneFmt}</div>
      <div class="collab-card-cta">${t("collab.waCta")}</div>
    </div>
  </a>
  <a href="${SHOP_CONFIG.socials.instagram}" target="_blank" rel="noopener" class="collab-card collab-ig">
    <div class="collab-card-ic">${icon("ig", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">Instagram</div>
      <div class="collab-card-sub">@${SHOP_CONFIG.instagram}</div>
      <div class="collab-card-cta">${t("collab.igCta")}</div>
    </div>
  </a>
  <a href="mailto:${SHOP_CONFIG.email}" class="collab-card collab-mail">
    <div class="collab-card-ic">${icon("mail", 38)}</div>
    <div class="collab-card-body">
      <div class="collab-card-title">E-mail</div>
      <div class="collab-card-sub">${SHOP_CONFIG.email}</div>
      <div class="collab-card-cta">${t("collab.mailCta")}</div>
    </div>
  </a>
</div>
<div class="collab-facts">
  <div class="collab-fact">
    <div class="cf-ic">${icon("shield-check", 22)}</div>
    <div class="cf-tx"><strong>${t("collab.f1t")}</strong><span>${t("collab.f1s")}</span></div>
  </div>
  <div class="collab-fact">
    <div class="cf-ic">${icon("map-pin", 22)}</div>
    <div class="cf-tx"><strong>${t("collab.f2t")}</strong><span>${t("collab.f2s")}</span></div>
  </div>
  <div class="collab-fact">
    <div class="cf-ic">${icon("truck", 22)}</div>
    <div class="cf-tx"><strong>${t("collab.f3t")}</strong><span>${t("collab.f3s")}</span></div>
  </div>
  <div class="collab-fact">
    <div class="cf-ic">${icon("bag", 22)}</div>
    <div class="cf-tx"><strong>${t("collab.f4t")}</strong><span>${t("collab.f4s")}</span></div>
  </div>
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
    toast(t("toast.addCart"), "bag");
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
  function rmCart(id)  { delete state.cart[id]; save(); updateBadges(); toast(t("toast.rmCart"), "trash"); renderCart(); }
  function clearCart()  { state.cart = {}; save(); updateBadges(); toast(t("toast.clearCart"), "trash"); renderCart(); }

  function toggleFav(id) {
    const i = state.favs.indexOf(id);
    if (i >= 0) { state.favs.splice(i, 1); toast(t("toast.rmFav"), "heart"); }
    else        { state.favs.push(id);     toast(t("toast.addFav"), "heart-fill"); }
    save(); updateBadges(); refreshCurrent();
  }

  function checkout() {
    const entries = cartEntries();
    if (!entries.length) return;
    const name = $("#ofName").value.trim();
    const phone = $("#ofPhone").value.trim();
    const comment = $("#ofComment").value.trim();

    if (!name || !phone) {
      toast(t("toast.needNamePhone"), "chat");
      return;
    }

    let lines = [t("wa.orderHello"), ""];
    entries.forEach(({ p, qty }, i) => {
      const priceStr = p.price != null ? money(p.price * qty) : t("cart.priceTBD");
      lines.push(`${i + 1}. ${tp(p, "name")} — ${qty} ${t("cart.pcs")} (${priceStr})`);
    });
    const total = cartTotal();
    lines.push("");
    lines.push(`${t("wa.total")} ${total > 0 ? money(total) : t("cart.tbd")}`);
    lines.push("");
    lines.push(`${t("wa.name")} ${name}`);
    lines.push(`${t("wa.phone")} ${phone}`);
    if (comment) lines.push(`${t("wa.comment")} ${comment}`);

    window.open(waBase(lines.join("\n")), "_blank", "noopener");

    state.cart = {}; save(); updateBadges();
    toast(t("toast.orderReady"), "check");
    renderCart();
  }

  function askPrice(id) {
    const p = byId(id);
    if (!p) return;
    window.open(waBase(`${t("wa.orderHello").replace(":", "")} ${tp(p, "name")}`), "_blank", "noopener");
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
    if (!q) { res.innerHTML = `<p style="color:var(--label-2);padding:14px 4px;font-size:14px">${t("search.start")}</p>`; return; }
    const list = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      p.desc.toLowerCase().includes(q) ||
      catName(p.cat).toLowerCase().includes(q));
    if (!list.length) { res.innerHTML = `<p style="color:var(--label-2);padding:14px 4px;font-size:14px">${t("search.none")}</p>`; return; }
    res.innerHTML = list.map((p) => `
<div class="search-row" data-open="${p.id}">
  <div class="thumb"><img src="${p.img}" alt="" style="object-position:${p.pos || "center"}" /></div>
  <div><div class="nm">${tp(p, "name")}</div><div class="cat">${catName(p.cat)}</div></div>
  <span class="pr">${p.price != null ? money(p.price) : t("price.ask")}</span>
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
    $("#langBtn").addEventListener("click", toggleLang);
    $("#themeBtn").addEventListener("click", toggleTheme);
    window.addEventListener("hashchange", route);
  }

  /* ---------------------- Тема (светлая/тёмная) ---------------------- */
  const SUN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2.5" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.5" y2="12"/><line x1="5.2" y1="5.2" x2="7" y2="7"/><line x1="17" y1="17" x2="18.8" y2="18.8"/><line x1="18.8" y1="5.2" x2="17" y2="7"/><line x1="7" y1="17" x2="5.2" y2="18.8"/></g></svg>`;
  const MOON_ICON = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

  function applyTheme(theme) {
    const th = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", th);
    localStorage.setItem("vo_theme", th);
    const b = $("#themeBtn");
    if (b) b.innerHTML = th === "dark" ? SUN_ICON : MOON_ICON;
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  }

  /* ---------------------- Язык (RU/EN) ---------------------- */
  function updateLangBtn() {
    const tag = $("#langTag");
    if (tag) tag.textContent = getLang() === "en" ? "EN" : "RU";
  }
  function renderHeaderBits() {
    const addr = $("#tagAddr"), hrs = $("#tagHours");
    if (addr) addr.innerHTML = icon("map-pin", 14) + " " + t("hero.tagAddr");
    if (hrs)  hrs.innerHTML  = icon("clock", 14) + " " + t("info.hours");
    const fc = $("#footContacts");
    if (fc) fc.innerHTML = `
      <li><a href="tel:+${SHOP_CONFIG.phone}">${SHOP_CONFIG.phoneFmt}</a></li>
      <li><a href="mailto:${SHOP_CONFIG.email}">${SHOP_CONFIG.email}</a></li>
      <li><a href="${SHOP_CONFIG.socials.instagram}" target="_blank" rel="noopener">@${SHOP_CONFIG.instagram}</a></li>`;
    document.title = getLang() === "en"
      ? "Vash Otdykh — grills, kazans, knives, samovars & garden furniture | Grozny"
      : "Ваш отдых — мангалы, казаны, ножи, самовары и садовая мебель | Грозный";
  }
  function applyLang() {
    applyStaticI18n(document);
    updateLangBtn();
    renderHeaderBits();
    const sel = $("#sortSelect");
    if (sel) sel.value = state.sort;
    refreshCurrent();
  }
  function toggleLang() {
    setLang(getLang() === "en" ? "ru" : "en");
    applyLang();
  }

  /* ---------------------- Hero Slider ---------------------- */
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots   = document.querySelectorAll(".slider-dots .dot");
    if (!slides.length) return;
    let current = 0;

    function goTo(idx) {
      slides[current].classList.remove("active");
      dots[current] && dots[current].classList.remove("active");
      current = idx;
      slides[current].classList.add("active");
      dots[current] && dots[current].classList.add("active");
    }

    dots.forEach(dot => dot.addEventListener("click", () => goTo(+dot.dataset.idx)));
    setInterval(() => goTo((current + 1) % slides.length), 2800);
  }

  /* ---------------------- Инициализация ---------------------- */
  function init() {
    applyTheme(localStorage.getItem("vo_theme") || "light");
    initObserver();
    wireEvents();
    applyStaticI18n(document);
    updateLangBtn();
    renderHeaderBits();
    updateBadges();
    route();
    observeReveals(document);
    playIntro();
    initHeroSlider();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
