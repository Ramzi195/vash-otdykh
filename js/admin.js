/* ==========================================================================
   Ваш отдых — Логика административной панели
   Данные хранятся в localStorage; экспортируются в products.js / config.js
   ========================================================================== */

"use strict";

/* ── Ключи localStorage ── */
const LS_HASH   = "vo_admin_hash";
const LS_PRODS  = "vo_admin_prods";
const LS_CATS   = "vo_admin_cats";
const LS_CFG    = "vo_admin_cfg";

/* ── Пароль по умолчанию ── */
const DEFAULT_PASS = "admin123";

/* ── Рабочие данные (загружаются при входе) ── */
let state = { prods: [], cats: [], cfg: {} };
let editProductId   = null;
let editCatId       = null;
let confirmCallback = null;

/* ══════════════════════════════════════════════
   SHA-256 через Web Crypto
══════════════════════════════════════════════ */
async function sha256(str) {
  const buf  = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ══════════════════════════════════════════════
   Инициализация: хэш пароля при первом запуске
══════════════════════════════════════════════ */
async function ensureDefaultHash() {
  if (!localStorage.getItem(LS_HASH)) {
    localStorage.setItem(LS_HASH, await sha256(DEFAULT_PASS));
  }
}

/* ══════════════════════════════════════════════
   Загрузка данных из localStorage
   (при первом запуске копируются из products.js / config.js)
══════════════════════════════════════════════ */
function loadState() {
  /* Товары */
  const rawP = localStorage.getItem(LS_PRODS);
  state.prods = rawP ? JSON.parse(rawP) : JSON.parse(JSON.stringify(PRODUCTS));

  /* Категории (исключаем "all" из редактирования) */
  const rawC = localStorage.getItem(LS_CATS);
  if (rawC) {
    state.cats = JSON.parse(rawC);
  } else {
    state.cats = JSON.parse(JSON.stringify(CATEGORIES.filter(c => c.id !== "all")));
  }

  /* Настройки */
  const rawCfg = localStorage.getItem(LS_CFG);
  state.cfg = rawCfg ? JSON.parse(rawCfg) : JSON.parse(JSON.stringify(SHOP_CONFIG));
}

function saveProds()  { localStorage.setItem(LS_PRODS, JSON.stringify(state.prods)); }
function saveCats()   { localStorage.setItem(LS_CATS,  JSON.stringify(state.cats)); }
function saveCfg()    { localStorage.setItem(LS_CFG,   JSON.stringify(state.cfg)); }

/* ══════════════════════════════════════════════
   Тосты
══════════════════════════════════════════════ */
function toast(msg, type = "ok") {
  const wrap = document.getElementById("toastWrap");
  const el   = document.createElement("div");
  el.className = `a-toast ${type}`;
  el.innerHTML = `<span class="a-ti">${type === "ok" ? "✓" : "✕"}</span>${msg}`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(10px)"; el.style.transition = ".3s"; }, 2600);
  setTimeout(() => el.remove(), 3000);
}

/* ══════════════════════════════════════════════
   Навигация
══════════════════════════════════════════════ */
function showPage(page) {
  document.querySelectorAll(".a-page").forEach(s => s.style.display = "none");
  document.querySelectorAll(".a-nav-item").forEach(n => n.classList.remove("active"));

  const sec = document.getElementById(`page-${page}`);
  if (sec) sec.style.display = "";

  const navEl = document.querySelector(`.a-nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add("active");

  if (page === "dashboard")  renderDashboard();
  if (page === "products")   renderProducts();
  if (page === "categories") renderCategories();
  if (page === "settings")   renderSettings();
}

/* ══════════════════════════════════════════════
   ДАШБОРД
══════════════════════════════════════════════ */
function renderDashboard() {
  const statsEl = document.getElementById("dashStats");
  const withPrice   = state.prods.filter(p => p.price !== null && p.price !== undefined).length;
  const noPrice     = state.prods.length - withPrice;
  const hits        = state.prods.filter(p => p.badge === "hit").length;

  statsEl.innerHTML = [
    { num: state.prods.length, lbl: "Товаров" },
    { num: state.cats.length,  lbl: "Категорий" },
    { num: withPrice,          lbl: "С ценой" },
    { num: noPrice,            lbl: "«Узнать цену»" },
    { num: hits,               lbl: "Хитов" },
  ].map(s => `<div class="a-stat"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`).join("");

  const recent = [...state.prods].slice(-5).reverse();
  document.querySelector("#dashRecent tbody").innerHTML = recent.map(p => `
    <tr>
      <td><div class="thumb-wrap"><img class="thumb" src="${p.img}" style="object-position:${p.pos||'center'}" onerror="this.style.display='none'"/></div></td>
      <td><strong>${p.name}</strong></td>
      <td>${catName(p.cat)}</td>
      <td>${p.price ? "₽ " + p.price.toLocaleString("ru") : "—"}</td>
    </tr>`).join("");
}

/* ══════════════════════════════════════════════
   ТОВАРЫ
══════════════════════════════════════════════ */
function catName(id) {
  const c = state.cats.find(c => c.id === id);
  return c ? c.name : id;
}

function badgeHtml(b) {
  if (!b) return `<span class="a-badge none">—</span>`;
  const labels = { hit: "Хит", new: "Новинка", sale: "Скидка" };
  return `<span class="a-badge ${b}">${labels[b] || b}</span>`;
}

function renderProducts() {
  fillCatSelect("prodFilterCat", true);
  filterProducts();
}

function filterProducts() {
  const q   = (document.getElementById("prodSearch").value || "").toLowerCase();
  const cat = document.getElementById("prodFilterCat").value;

  const list = state.prods.filter(p => {
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchCat = !cat || p.cat === cat;
    return matchQ && matchCat;
  });

  document.getElementById("prodTableBody").innerHTML = list.length
    ? list.map(p => `
      <tr>
        <td><div class="thumb-wrap"><img class="thumb" src="${p.img}" style="object-position:${p.pos||'center'}" onerror="this.style.display='none'"/></div></td>
        <td><strong>${p.name}</strong><br/><span style="font-size:12px;color:var(--a-sub)">${p.id}</span></td>
        <td>${catName(p.cat)}</td>
        <td>${p.price ? "₽ " + p.price.toLocaleString("ru") : '<span style="color:var(--a-sub)">Узнать</span>'}</td>
        <td>${badgeHtml(p.badge)}</td>
        <td><div class="a-actions">
          <button class="a-btn sm ghost" onclick="openEditProduct('${p.id}')">✎</button>
          <button class="a-btn sm red"   onclick="openDeleteProduct('${p.id}')">✕</button>
        </div></td>
      </tr>`).join("")
    : `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--a-sub);">Ничего не найдено</td></tr>`;
}

function fillCatSelect(selId, withAll = false) {
  const sel = document.getElementById(selId);
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = (withAll ? `<option value="">Все категории</option>` : "") +
    state.cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  if (cur) sel.value = cur;
}

/* ── Открыть форму добавления ── */
function openAddProduct() {
  editProductId = null;
  document.getElementById("prodModalTitle").textContent = "Добавить товар";
  ["name","id","desc","img","pos","price","priceNote","rating"].forEach(f => {
    const el = document.getElementById(`pm-${f}`);
    if (el) el.value = "";
  });
  document.getElementById("pm-badge").value = "";
  fillCatSelect("pm-cat");
  openModal("prodModal");
}

/* ── Открыть форму редактирования ── */
function openEditProduct(id) {
  const p = state.prods.find(p => p.id === id);
  if (!p) return;
  editProductId = id;
  document.getElementById("prodModalTitle").textContent = "Редактировать товар";
  document.getElementById("pm-name").value      = p.name || "";
  document.getElementById("pm-id").value        = p.id   || "";
  document.getElementById("pm-desc").value      = p.desc || "";
  document.getElementById("pm-img").value       = p.img  || "";
  document.getElementById("pm-pos").value       = p.pos  || "";
  document.getElementById("pm-price").value     = p.price != null ? p.price : "";
  document.getElementById("pm-priceNote").value = p.priceNote || "";
  document.getElementById("pm-rating").value    = p.rating != null ? p.rating : "";
  document.getElementById("pm-badge").value     = p.badge || "";
  fillCatSelect("pm-cat");
  document.getElementById("pm-cat").value = p.cat || "";
  openModal("prodModal");
}

/* ── Сохранить товар ── */
function saveProduct() {
  const name = document.getElementById("pm-name").value.trim();
  const id   = document.getElementById("pm-id").value.trim().replace(/\s+/g, "-");
  const cat  = document.getElementById("pm-cat").value;
  const desc = document.getElementById("pm-desc").value.trim();

  if (!name || !id || !cat || !desc) { toast("Заполните обязательные поля (*)", "err"); return; }

  /* Проверяем уникальность ID при добавлении */
  if (!editProductId && state.prods.find(p => p.id === id)) {
    toast("Товар с таким ID уже существует", "err"); return;
  }

  const priceRaw = document.getElementById("pm-price").value.trim();
  const product = {
    id,
    cat,
    name,
    desc,
    price:     priceRaw !== "" ? parseFloat(priceRaw) : null,
    priceNote: document.getElementById("pm-priceNote").value.trim() || null,
    img:       document.getElementById("pm-img").value.trim() || `images/${id}.jpg`,
    pos:       document.getElementById("pm-pos").value.trim() || "center center",
    badge:     document.getElementById("pm-badge").value || null,
    rating:    parseFloat(document.getElementById("pm-rating").value) || 4.5,
  };

  if (editProductId) {
    const idx = state.prods.findIndex(p => p.id === editProductId);
    if (idx !== -1) state.prods[idx] = product;
    toast("Товар обновлён");
  } else {
    state.prods.push(product);
    toast("Товар добавлен");
  }

  saveProds();
  closeModal("prodModal");
  filterProducts();
}

/* ── Удалить товар ── */
function openDeleteProduct(id) {
  const p = state.prods.find(p => p.id === id);
  if (!p) return;
  document.getElementById("confirmText").textContent = `Удалить товар «${p.name}»? Это действие нельзя отменить.`;
  confirmCallback = () => {
    state.prods = state.prods.filter(p => p.id !== id);
    saveProds();
    filterProducts();
    toast("Товар удалён");
  };
  openModal("confirmModal");
}

/* ══════════════════════════════════════════════
   КАТЕГОРИИ
══════════════════════════════════════════════ */
function renderCategories() {
  const list = document.getElementById("catList");
  if (!state.cats.length) {
    list.innerHTML = `<div style="padding:28px;text-align:center;color:var(--a-sub);">Нет категорий</div>`;
    return;
  }
  list.innerHTML = `<table class="a-table">
    <thead><tr><th>ID</th><th>Название</th><th>Товаров</th><th style="width:110px">Действия</th></tr></thead>
    <tbody>` +
    state.cats.map(c => {
      const cnt = state.prods.filter(p => p.cat === c.id).length;
      return `<tr>
        <td><code style="font-size:12px;background:var(--a-bg);padding:2px 7px;border-radius:5px">${c.id}</code></td>
        <td><strong>${c.name}</strong></td>
        <td>${cnt}</td>
        <td><div class="a-actions">
          <button class="a-btn sm ghost" onclick="openEditCat('${c.id}')">✎</button>
          <button class="a-btn sm red"   onclick="openDeleteCat('${c.id}')">✕</button>
        </div></td>
      </tr>`;
    }).join("") +
    `</tbody></table>`;
}

function openAddCat() {
  editCatId = null;
  document.getElementById("catModalTitle").textContent = "Добавить категорию";
  document.getElementById("cm-id").value   = "";
  document.getElementById("cm-name").value = "";
  document.getElementById("cm-id").disabled = false;
  openModal("catModal");
}

function openEditCat(id) {
  const c = state.cats.find(c => c.id === id);
  if (!c) return;
  editCatId = id;
  document.getElementById("catModalTitle").textContent = "Редактировать категорию";
  document.getElementById("cm-id").value    = c.id;
  document.getElementById("cm-id").disabled = true;
  document.getElementById("cm-name").value  = c.name;
  openModal("catModal");
}

function saveCat() {
  const id   = document.getElementById("cm-id").value.trim().replace(/\s+/g, "-");
  const name = document.getElementById("cm-name").value.trim();
  if (!id || !name) { toast("Заполните все поля", "err"); return; }

  if (editCatId) {
    const c = state.cats.find(c => c.id === editCatId);
    if (c) c.name = name;
    toast("Категория обновлена");
  } else {
    if (state.cats.find(c => c.id === id) || id === "all") { toast("ID уже используется", "err"); return; }
    state.cats.push({ id, name });
    toast("Категория добавлена");
  }
  saveCats();
  closeModal("catModal");
  renderCategories();
}

function openDeleteCat(id) {
  const c    = state.cats.find(c => c.id === id);
  const cnt  = state.prods.filter(p => p.cat === id).length;
  document.getElementById("confirmText").textContent =
    `Удалить категорию «${c.name}»? В ней ${cnt} товаров — они останутся, но потеряют категорию.`;
  confirmCallback = () => {
    state.cats = state.cats.filter(c => c.id !== id);
    saveCats();
    renderCategories();
    toast("Категория удалена");
  };
  openModal("confirmModal");
}

/* ══════════════════════════════════════════════
   НАСТРОЙКИ
══════════════════════════════════════════════ */
function renderSettings() {
  const c = state.cfg;
  document.getElementById("s-name").value        = c.name || "";
  document.getElementById("s-motto").value       = c.motto || "";
  document.getElementById("s-since").value       = c.since || "";
  document.getElementById("s-phone").value       = c.phone || "";
  document.getElementById("s-phoneFmt").value    = c.phoneFmt || "";
  document.getElementById("s-email").value       = c.email || "";
  document.getElementById("s-instagram").value   = c.instagram || "";
  document.getElementById("s-hours").value       = c.hours || "";
  document.getElementById("s-delivery").value    = c.delivery || "";
  document.getElementById("s-addr0").value       = (c.addresses && c.addresses[0]) || "";
  document.getElementById("s-addr1").value       = (c.addresses && c.addresses[1]) || "";
  document.getElementById("s-whatsappMsg").value = c.whatsappMsg || "";
}

function saveSettings() {
  const phone = document.getElementById("s-phone").value.trim();
  state.cfg = {
    ...state.cfg,
    name:        document.getElementById("s-name").value.trim(),
    motto:       document.getElementById("s-motto").value.trim(),
    since:       parseInt(document.getElementById("s-since").value) || 2013,
    phone,
    phoneFmt:    document.getElementById("s-phoneFmt").value.trim(),
    email:       document.getElementById("s-email").value.trim(),
    instagram:   document.getElementById("s-instagram").value.trim(),
    hours:       document.getElementById("s-hours").value.trim(),
    delivery:    document.getElementById("s-delivery").value.trim(),
    addresses: [
      document.getElementById("s-addr0").value.trim(),
      document.getElementById("s-addr1").value.trim(),
    ].filter(Boolean),
    whatsappMsg: document.getElementById("s-whatsappMsg").value.trim(),
    socials: {
      whatsapp:  `https://wa.me/${phone}`,
      instagram: `https://instagram.com/${document.getElementById("s-instagram").value.trim()}`,
    },
  };
  saveCfg();
  toast("Настройки сохранены");
}

/* ══════════════════════════════════════════════
   ЭКСПОРТ
══════════════════════════════════════════════ */
function serializeProduct(p) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(p.id)},`);
  lines.push(`    cat: ${JSON.stringify(p.cat)},`);
  lines.push(`    name: ${JSON.stringify(p.name)},`);
  lines.push(`    desc: ${JSON.stringify(p.desc)},`);
  lines.push(`    price: ${p.price != null ? p.price : "null"}, priceNote: ${p.priceNote ? JSON.stringify(p.priceNote) : "null"},`);
  lines.push(`    img: ${JSON.stringify(p.img)}, pos: ${JSON.stringify(p.pos || "center center")},`);
  lines.push(`    badge: ${p.badge ? JSON.stringify(p.badge) : "null"}, rating: ${p.rating || 4.5},`);
  lines.push(`  },`);
  return lines.join("\n");
}

function generateProductsJs() {
  const catsWithAll = [{ id: "all", name: "Все товары" }, ...state.cats];
  const catsStr = catsWithAll.map(c =>
    `  { id: ${JSON.stringify(c.id)}, name: ${JSON.stringify(c.name)} },`
  ).join("\n");

  const prodsStr = state.prods.map(serializeProduct).join("\n\n");

  return `/* ==========================================================================
   Ваш отдых — каталог товаров (экспорт из админ-панели)
   ========================================================================== */

const CATEGORIES = [
${catsStr}
];

const PRODUCTS = [
${prodsStr}
];
`;
}

function generateConfigJs() {
  const c = state.cfg;
  return `/* ==========================================================================
   Ваш отдых — настройки магазина (экспорт из админ-панели)
   ========================================================================== */

const SHOP_CONFIG = {
  name:       ${JSON.stringify(c.name || "Ваш отдых")},
  motto:      ${JSON.stringify(c.motto || "")},
  since:      ${c.since || 2013},

  phone:      ${JSON.stringify(c.phone || "")},
  phoneFmt:   ${JSON.stringify(c.phoneFmt || "")},
  email:      ${JSON.stringify(c.email || "")},
  instagram:  ${JSON.stringify(c.instagram || "")},

  addresses: [
    ${(c.addresses || []).map(a => JSON.stringify(a)).join(",\n    ")},
  ],

  hours:      ${JSON.stringify(c.hours || "")},
  delivery:   ${JSON.stringify(c.delivery || "")},

  whatsappMsg: ${JSON.stringify(c.whatsappMsg || "")},

  socials: {
    whatsapp:  ${JSON.stringify((c.socials && c.socials.whatsapp) || "")},
    instagram: ${JSON.stringify((c.socials && c.socials.instagram) || "")},
  },
};
`;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════
   СМЕНА ПАРОЛЯ
══════════════════════════════════════════════ */
async function changePassword() {
  const cur    = document.getElementById("pwdCurrent").value;
  const next   = document.getElementById("pwdNew").value;
  const repeat = document.getElementById("pwdRepeat").value;
  const errEl  = document.getElementById("pwdErr");
  errEl.classList.remove("show");

  const curHash = await sha256(cur);
  if (curHash !== localStorage.getItem(LS_HASH)) {
    errEl.textContent = "Текущий пароль неверный"; errEl.classList.add("show"); return;
  }
  if (next.length < 6) {
    errEl.textContent = "Новый пароль должен содержать минимум 6 символов"; errEl.classList.add("show"); return;
  }
  if (next !== repeat) {
    errEl.textContent = "Пароли не совпадают"; errEl.classList.add("show"); return;
  }

  localStorage.setItem(LS_HASH, await sha256(next));
  document.getElementById("pwdCurrent").value = "";
  document.getElementById("pwdNew").value     = "";
  document.getElementById("pwdRepeat").value  = "";
  toast("Пароль успешно изменён");
}

/* ══════════════════════════════════════════════
   МОДАЛЬНЫЕ ОКНА
══════════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

/* ══════════════════════════════════════════════
   ВХОД / ВЫХОД
══════════════════════════════════════════════ */
async function tryLogin() {
  const pwd = document.getElementById("loginPwd").value;
  const hash = await sha256(pwd);
  const errEl = document.getElementById("loginErr");
  if (hash === localStorage.getItem(LS_HASH)) {
    errEl.classList.remove("show");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminApp").style.display    = "block";
    loadState();
    showPage("dashboard");
  } else {
    errEl.classList.add("show");
    document.getElementById("loginPwd").value = "";
    document.getElementById("loginPwd").focus();
  }
}

function logout() {
  document.getElementById("adminApp").style.display    = "none";
  document.getElementById("loginScreen").style.display = "";
  document.getElementById("loginPwd").value = "";
  state = { prods: [], cats: [], cfg: {} };
}

/* ══════════════════════════════════════════════
   ПРИВЯЗКА СОБЫТИЙ
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  await ensureDefaultHash();

  /* Вход по Enter */
  document.getElementById("loginPwd").addEventListener("keydown", e => { if (e.key === "Enter") tryLogin(); });
  document.getElementById("loginBtn").addEventListener("click", tryLogin);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  /* Навигация */
  document.getElementById("adminNav").addEventListener("click", e => {
    const item = e.target.closest(".a-nav-item");
    if (item) showPage(item.dataset.page);
  });

  /* Товары */
  document.getElementById("addProductBtn").addEventListener("click", openAddProduct);
  document.getElementById("prodSearch").addEventListener("input", filterProducts);
  document.getElementById("prodFilterCat").addEventListener("change", filterProducts);
  document.getElementById("prodModalSave").addEventListener("click", saveProduct);
  document.getElementById("prodModalClose").addEventListener("click", () => closeModal("prodModal"));

  /* Категории */
  document.getElementById("addCatBtn").addEventListener("click", openAddCat);
  document.getElementById("catModalSave").addEventListener("click", saveCat);
  document.getElementById("catModalClose").addEventListener("click", () => closeModal("catModal"));

  /* Настройки */
  document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);

  /* Экспорт */
  document.getElementById("exportProdsBtn").addEventListener("click", () => {
    downloadFile(generateProductsJs(), "products.js");
    toast("products.js скачан");
  });
  document.getElementById("exportCfgBtn").addEventListener("click", () => {
    downloadFile(generateConfigJs(), "config.js");
    toast("config.js скачан");
  });

  /* Пароль */
  document.getElementById("changePwdBtn").addEventListener("click", changePassword);

  /* Подтверждение удаления */
  document.getElementById("confirmOk").addEventListener("click", () => {
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
    closeModal("confirmModal");
  });
  document.getElementById("confirmCancel").addEventListener("click", () => closeModal("confirmModal"));

  /* Закрытие модалок по клику на фон */
  document.querySelectorAll(".a-overlay").forEach(ov => {
    ov.addEventListener("click", e => { if (e.target === ov) closeModal(ov.id); });
  });
});
