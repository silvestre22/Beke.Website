// Flavor data from "全口味-带凉度指引" (Flavor Profile) and the single-flavor KV pages.
const FLAVORS = [
  { no: "01", en: "Green Grape Ice",          cn: "香槟青提",   sweet: 4, cool: 9,  nic: 3, family: "fruit", bg: "#eef6d6" },
  { no: "02", en: "Ludou Ice",                cn: "绿豆冰",     sweet: 4, cool: 9,  nic: 3, family: "drink", bg: "#e2f3df" },
  { no: "03", en: "Grapefruit Passion Fruit", cn: "葡萄柚百香果", sweet: 4, cool: 9, nic: 3, family: "fruit", bg: "#fde8df" },
  { no: "04", en: "Pink Guava",               cn: "番石榴",     sweet: 4, cool: 8,  nic: 3, family: "fruit", bg: "#fde3ea" },
  { no: "05", en: "Raw Cola Ice",             cn: "生可乐",     sweet: 6, cool: 9,  nic: 3, family: "drink", bg: "#ebe4df" },
  { no: "06", en: "Mineral Water",            cn: "矿泉水",     sweet: 2, cool: 10, nic: 3, family: "drink", bg: "#e0f1fc" },
  { no: "07", en: "Bayberry Ice",             cn: "杨梅冰",     sweet: 2, cool: 9,  nic: 3, family: "fruit", bg: "#f7dfe6" },
  { no: "08", en: "Strawberry Ice",           cn: "新鲜草莓",   sweet: 6, cool: 8,  nic: 3, family: "fruit", bg: "#fde0e3" },
  { no: "09", en: "Oolong Ice Tea",           cn: "高山乌龙",   sweet: 2, cool: 8,  nic: 3, family: "tea",   bg: "#e3f2e4" },
  { no: "10", en: "Iced Black Tea",           cn: "糯香红茶",   sweet: 4, cool: 9,  nic: 3, family: "tea",   bg: "#fbe9d2" },
  { no: "11", en: "Banana Freeze",            cn: "老冰棍",     sweet: 5, cool: 9,  nic: 3, family: "drink", bg: "#fdf3d2" },
  { no: "12", en: "Coconut Water",            cn: "椰子水",     sweet: 4, cool: 9,  nic: 3, family: "drink", bg: "#f3ebe3" },
  { no: "13", en: "Watermelon Ice",           cn: "极凉西瓜",   sweet: 5, cool: 8,  nic: 3, family: "fruit", bg: "#fde3de" },
  { no: "14", en: "Miami Mint",               cn: "迈阿密薄荷", sweet: 2, cool: 9,  nic: 4, family: "mint",  bg: "#dff5ea" },
  { no: "15", en: "Peach Oolong Ice Tea",     cn: "蜜桃乌龙",   sweet: 3, cool: 8,  nic: 3, family: "tea",   bg: "#fde6de" },
  { no: "16", en: "Mango Pomelo Sago",        cn: "杨枝甘露",   sweet: 5, cool: 8,  nic: 3, family: "fruit", bg: "#fdefd0" },
  { no: "17", en: "Pineapple Ice",            cn: "菠萝",       sweet: 6, cool: 8,  nic: 3, family: "fruit", bg: "#fdf2cf" },
  { no: "18", en: "Lime Ice",                 cn: "极凉青柠",   sweet: 4, cool: 9,  nic: 3, family: "fruit", bg: "#eaf6d9" },
  { no: "19", en: "Sour Apple Ice",           cn: "酸苹果",     sweet: 4, cool: 8,  nic: 3, family: "fruit", bg: "#e9f5d7" },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function storageGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function storageSet(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }

/* ---------- Language ---------- */
const LANG_KEY = "beke-lang";
const HTML_LANG = { en: "en", zh: "zh-CN", id: "id" };
function detectLang() {
  const saved = storageGet(LANG_KEY);
  if (I18N[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("id") || nav.startsWith("ms")) return "id";
  return "en";
}
let lang = detectLang();
const t = key => I18N[lang][key] ?? I18N.en[key] ?? key;

function applyLang(next) {
  lang = next;
  storageSet(LANG_KEY, lang);
  document.documentElement.lang = HTML_LANG[lang];
  document.documentElement.dataset.lang = lang;
  document.title = t("meta.title");
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$("[data-flavor]").forEach(el => { el.textContent = flavorName(FLAVORS.find(f => f.no === el.dataset.flavor)); });
  $$("[data-wa]").forEach(el => { el.href = `https://wa.me/60102064096?text=${encodeURIComponent(t(el.dataset.wa))}`; });
  $$(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  render();
  requestAnimationFrame(syncNavTop);
}
const flavorName = f => (lang === "zh" ? f.cn : f.en);
const flavorSub = f => (lang === "zh" ? f.en : f.cn);
$$(".lang button").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));

/* ---------- Age gate ---------- */
const AGE_KEY = "beke-age-ok";

if (storageGet(AGE_KEY) === "1") document.body.classList.remove("gated");
else $("#gate-yes").focus();

$("#gate-yes").addEventListener("click", () => {
  storageSet(AGE_KEY, "1");
  document.body.classList.remove("gated");
});
$("#gate-no").addEventListener("click", () => {
  $("#gate-denied").hidden = false;
  $(".gate__actions").hidden = true;
});

/* ---------- Sticky offsets ---------- */
const nav = $("#nav"), warn = $(".warning");
function syncNavTop() { nav.style.top = warn.offsetHeight + "px"; }
syncNavTop();
addEventListener("resize", syncNavTop);
addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

/* ---------- Flavor grid ---------- */
const ICON_COOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M4.9 7l14.2 10M4.9 17 19.1 7"/></svg>';
const ICON_SWEET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 3c-2 3 2 5 0 8M12 3c-2 3 2 5 0 8M16 3c-2 3 2 5 0 8M5 15h14l-2 6H7z"/></svg>';

function meter(kind, value) {
  const cells = Array.from({ length: 10 }, (_, i) => `<i class="${i < value ? "on" : ""}"></i>`).join("");
  const label = t(kind === "cool" ? "legend.cool" : "legend.sweet");
  return `<div class="meter meter--${kind}" aria-label="${label} ${value} out of 10">
    ${kind === "cool" ? ICON_COOL : ICON_SWEET}<span class="meter__bar">${cells}</span><span class="meter__val">${value}</span></div>`;
}

let filter = "all", sort = "no", visible = FLAVORS;
const grid = $("#grid");

function render() {
  visible = FLAVORS.filter(f => filter === "all" || f.family === filter);
  const by = {
    no: (a, b) => a.no.localeCompare(b.no),
    cool: (a, b) => b.cool - a.cool || a.sweet - b.sweet,
    sweet: (a, b) => b.sweet - a.sweet || b.cool - a.cool,
    light: (a, b) => a.sweet - b.sweet || b.cool - a.cool,
  }[sort];
  visible = [...visible].sort(by);
  grid.innerHTML = visible.map((f, i) => `
    <button class="fcard" data-no="${f.no}" style="--bg:${f.bg};animation-delay:${Math.min(i, 12) * 35}ms" aria-label="${flavorName(f)}, ${t("card.open")}">
      <div class="fcard__media">
        <span class="fcard__no">No.${f.no}</span>
        <span class="fcard__nic ${f.nic > 3 ? "fcard__nic--hi" : ""}">${f.nic}% NIC</span>
        <img src="assets/flavors/${f.no}.jpg" alt="" loading="lazy">
      </div>
      <div class="fcard__body">
        <div class="fcard__name">${flavorName(f)}</div>
        <div class="fcard__cn">${flavorSub(f)}</div>
        ${meter("cool", f.cool)}
        ${meter("sweet", f.sweet)}
      </div>
    </button>`).join("");
}
applyLang(lang);

$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.toggle("is-active", c === chip));
  filter = chip.dataset.filter;
  render();
}));
$("#sort").addEventListener("change", e => { sort = e.target.value; render(); });

/* ---------- Lightbox ---------- */
const lb = $("#lightbox"), lbImg = $("#lb-img");
let current = 0;
function show(i) {
  current = (i + visible.length) % visible.length;
  const f = visible[current];
  lbImg.src = `assets/kv/${f.no}.jpg`;
  lbImg.alt = `${flavorName(f)}: ${t("legend.cool")} ${f.cool}/10, ${t("legend.sweet")} ${f.sweet}/10, ${f.nic}% NIC`;
}
grid.addEventListener("click", e => {
  const card = e.target.closest(".fcard");
  if (!card) return;
  show(visible.findIndex(f => f.no === card.dataset.no));
  lb.showModal();
});
$("#lb-close").addEventListener("click", () => lb.close());
$("#lb-prev").addEventListener("click", () => show(current - 1));
$("#lb-next").addEventListener("click", () => show(current + 1));
lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
lb.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

/* ---------- Reveal on scroll ---------- */
const targets = $$(".section-head, .tile, .spec, .pack figure, .rules li, .film__frame");
targets.forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
targets.forEach(el => io.observe(el));
