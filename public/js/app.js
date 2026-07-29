/* ---------------------------------------------------------
   APP.JS — state, router and page renderers for the
   Mirpur College Rover Scout Group website.
   Plain HTML5 / CSS3 / JavaScript (no build step, no framework).
--------------------------------------------------------- */

const state = {
  lang: localStorage.getItem("sc_lang") === "en" ? "en" : (localStorage.getItem("sc_lang") === "bn" ? "bn" : "bn"),
  dark: localStorage.getItem("sc_dark") === "1" ? true : (localStorage.getItem("sc_dark") === "0" ? false : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)),
  page: (location.hash || "#home").replace("#", "") || "home",
  drawerOpen: false,
  searchOpen: false,
};

function setLang(l) { state.lang = l; localStorage.setItem("sc_lang", l); render(); }
function setDark(d) { state.dark = d; localStorage.setItem("sc_dark", d ? "1" : "0"); render(); }
function setPage(p) {
  state.page = p;
  state.drawerOpen = false;
  state.searchOpen = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  // Only touch location.hash; the hashchange listener will call render()
  // once, avoiding the double-render that happened when this function
  // also called render() directly.
  if (("#" + p) !== location.hash) {
    location.hash = p;
  } else {
    render();
  }
}
function setDrawer(v) { state.drawerOpen = v; render(); }
function setSearchOpen(v) { state.searchOpen = v; render(); }

window.addEventListener("hashchange", () => {
  state.page = (location.hash || "#home").replace("#", "") || "home";
  render();
});

/* ---------------- small view helpers ---------------- */

function icon(name, opts = "") {
  return `<i data-lucide="${name}" ${opts}></i>`;
}

function eyebrow(text) {
  return `<div class="sc-eyebrow text-ember text-sm mb-2">${text}</div>`;
}

function sectionTitle(eyebrowText, title) {
  return `
    <div class="mb-8 reveal">
      ${eyebrow(eyebrowText)}
      <h2 class="sc-display text-3xl md:text-4xl font-bold text-forest">${title}</h2>
      <div class="divider-crest w-24 mt-3"></div>
    </div>`;
}

function card(inner, cls = "") {
  return `<div class="card p-5 reveal ${cls}">${inner}</div>`;
}

function patch(iconName, label, sub, tone = "gold", size = 128, rotate = 0) {
  return `
    <div class="patch ${tone === "ember" ? "patch-ember" : ""} bg-forest" style="width:${size}px;height:${size}px">
      ${icon(iconName, `style="width:${size * 0.28}px;height:${size * 0.28}px" class="text-cream"`)}
      <div class="sc-display text-cream" style="font-size:${size * 0.11}px;margin-top:4px;line-height:1.1;padding:0 8px">${label}</div>
      ${sub ? `<div class="text-cream" style="font-size:${size * 0.075}px;opacity:.8">${sub}</div>` : ""}
    </div>`;
}

function compassMark(size = 40, spin = false) {
  return `<img src="img/logo.png" alt="${L(ORG.name, state.lang)}" width="${size}" height="${size}" class="logo-mark${spin ? " logo-mark-spin" : ""}" style="width:${size}px;height:${size}px" />`;
}

/* ---------------- nav / drawer / search ---------------- */

function renderNav() {
  const lang = state.lang;
  const current = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === state.page);
  return `
  <header class="bg-forest sticky top-0 z-40">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6 py-3">
      <button onclick="setPage('home')" class="flex items-center gap-2 sm:gap-3 min-w-0" style="background:none;border:none;cursor:pointer;">
        ${compassMark(36)}
        <div class="text-left min-w-0">
          <div class="sc-display text-cream text-sm sm:text-lg font-bold leading-none truncate">
            ${lang === "bn" ? "মিরপুর কলেজ রোভার স্কাউট গ্রুপ" : "Mirpur College Rover Scout Group"}
          </div>
          <div class="sc-eyebrow text-gold text-[9px] sm:text-xs mt-1 hidden xs:block">${lang === "bn" ? "মিরপুর-২, ঢাকা" : "MIRPUR-2, DHAKA"}</div>
        </div>
      </button>

      <div class="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <span class="hidden lg:block text-cream sc-eyebrow text-xs opacity-80 mr-2">${current ? L(current.label, lang) : ""}</span>
        <button aria-label="${L(UI.search, lang)}" onclick="setSearchOpen(${!state.searchOpen})" class="icon-btn">${icon("search", 'style="width:16px;height:16px"')}</button>
        <button aria-label="${L(UI.toggleTheme, lang)}" onclick="setDark(${!state.dark})" class="icon-btn">${icon(state.dark ? "sun" : "moon", 'style="width:16px;height:16px"')}</button>
        <button aria-label="${L(UI.toggleLang, lang)}" onclick="setLang('${lang === "bn" ? "en" : "bn"}')" class="icon-btn w-auto px-2.5 sc-eyebrow text-[11px]">${L(UI.toggleLang, lang)}</button>
        <button onclick="setDrawer(true)" class="btn-ghost flex items-center gap-2 !px-3 !py-2">${icon("menu", 'style="width:16px;height:16px"')} <span class="hidden sm:inline text-sm">${L(UI.menu, lang)}</span></button>
      </div>
    </div>

    ${state.searchOpen ? `
    <div class="search-drop border-t border-cream border-opacity-10 bg-forest-mid">
      <div class="max-w-3xl mx-auto px-3 sm:px-6 py-3">
        ${renderSmartSearch()}
      </div>
    </div>` : ""}
  </header>

  ${state.drawerOpen ? renderDrawer() : ""}
  `;
}

function renderSmartSearch() {
  const lang = state.lang;
  return `
    <div class="search-panel p-3 w-full">
      <div class="flex items-center gap-2 border-b border-rope border-opacity-20 pb-2 mb-2">
        ${icon("search", 'style="width:18px;height:18px" class="text-rope flex-shrink-0"')}
        <input id="searchInput" autofocus oninput="onSearchInput(this.value)" placeholder="${L(UI.searchPlaceholder, lang)}" class="flex-1 bg-transparent outline-none text-forest text-sm" style="border:none;">
        <button onclick="setSearchOpen(false)" style="background:none;border:none;cursor:pointer;">${icon("x", 'style="width:16px;height:16px" class="text-rope"')}</button>
      </div>
      <div id="searchResults" class="max-h-72 overflow-y-auto flex flex-col gap-1"></div>
    </div>`;
}

function onSearchInput(q) {
  const lang = state.lang;
  const query = q.trim().toLowerCase();
  const resultsEl = document.getElementById("searchResults");
  if (!resultsEl) return;
  if (!query) { resultsEl.innerHTML = ""; return; }
  const results = SEARCH_INDEX.filter(item => {
    const bn = (item.label.bn || "").toLowerCase();
    const en = (item.label.en || "").toLowerCase();
    return bn.includes(query) || en.includes(query);
  }).slice(0, 8);
  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="text-rope text-sm px-2 py-3 text-center">${L(UI.noResults, lang)}</div>`;
  } else {
    resultsEl.innerHTML = results.map(r => `
      <button onclick="setPage('${r.page}')" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-canvas text-left w-full" style="background:none;border:none;cursor:pointer;">
        ${icon(r.icon, 'style="width:16px;height:16px" class="text-ember flex-shrink-0"')}
        <span class="text-forest text-sm flex-1">${L(r.label, lang)}</span>
        <span class="sc-eyebrow text-rope text-[10px]">${L(r.kind, lang)}</span>
      </button>`).join("");
  }
  createIcons();
}

function renderDrawer() {
  const lang = state.lang;
  return `
  <div class="fixed inset-0 z-50 flex justify-end">
    <div class="drawer-backdrop absolute inset-0 bg-black opacity-50" onclick="setDrawer(false)"></div>
    <div class="drawer-panel relative bg-forest w-80 max-w-[85vw] h-full p-6 overflow-y-auto contour-bg">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">${compassMark(32)}<span class="sc-display text-cream font-bold">${L(UI.menu, lang)}</span></div>
        <button onclick="setDrawer(false)" style="background:none;border:none;cursor:pointer;">${icon("x", 'class="text-cream"')}</button>
      </div>
      ${NAV_GROUPS.map(group => `
        <div class="mb-6">
          <div class="sc-eyebrow text-gold text-xs mb-3">${L(group.title, lang)}</div>
          <div class="flex flex-col gap-1">
            ${group.items.map(item => `
              <button onclick="setPage('${item.id}')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full ${state.page === item.id ? "tab-active" : "tab-idle"}" style="border:none;cursor:pointer;">
                ${icon(item.icon, 'style="width:18px;height:18px"')}
                <span>${L(item.label, lang)}</span>
                ${icon("chevron-right", 'style="width:14px;height:14px" class="ml-auto opacity-50"')}
              </button>`).join("")}
          </div>
        </div>`).join("")}
    </div>
  </div>`;
}

function renderFooter() {
  const lang = state.lang;
  return `
  <footer class="bg-forest contour-bg pt-14 pb-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-cream">
      <div>
        <div class="flex items-center gap-2 mb-3">${compassMark(30)}<span class="sc-display font-bold">${lang === "bn" ? "মিরপুর কলেজ রোভার স্কাউট গ্রুপ" : "Mirpur College Rover Scout Group"}</span></div>
        <p class="text-sm opacity-75">${lang === "bn" ? "মিরপুর কলেজের রোভার স্কাউটদের নেতৃত্ব ও সেবার মানসিকতা গড়ে তোলার প্ল্যাটফর্ম।" : "Building leadership and a spirit of service among the Rover Scouts of Mirpur College."}</p>
      </div>
      <div>
        <div class="sc-eyebrow text-gold text-xs mb-3">${lang === "bn" ? "লিংক" : "Links"}</div>
        <div class="flex flex-col gap-2 text-sm opacity-85">
          <button onclick="setPage('about')" class="text-left" style="background:none;border:none;color:inherit;cursor:pointer;">${lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}</button>
          <button onclick="setPage('events')" class="text-left" style="background:none;border:none;color:inherit;cursor:pointer;">${lang === "bn" ? "ইভেন্ট" : "Events"}</button>
          <button onclick="setPage('downloads')" class="text-left" style="background:none;border:none;color:inherit;cursor:pointer;">${lang === "bn" ? "ডাউনলোড" : "Downloads"}</button>
        </div>
      </div>
      <div>
        <div class="sc-eyebrow text-gold text-xs mb-3">${lang === "bn" ? "সদস্য" : "Members"}</div>
        <div class="flex flex-col gap-2 text-sm opacity-85">
          <button onclick="setPage('register')" class="text-left" style="background:none;border:none;color:inherit;cursor:pointer;">${lang === "bn" ? "রেজিস্ট্রেশন" : "Registration"}</button>
        </div>
      </div>
      <div>
        <div class="sc-eyebrow text-gold text-xs mb-3">${lang === "bn" ? "যোগাযোগ" : "Contact"}</div>
        <div class="flex flex-col gap-2 text-sm opacity-85">
          <span>mcrsg.mirpurcollege@gmail.com</span>
          <span>+৮৮০ ১৭xx-xxxxxx</span>
        </div>
      </div>
    </div>
    <div class="divider-rope max-w-6xl mx-auto mt-10 mb-5"></div>
    <div class="text-center text-cream text-xs opacity-60">
      ${lang === "bn" ? "© ২০২৬ মিরপুর কলেজ রোভার স্কাউট গ্রুপ — সকল অধিকার সংরক্ষিত" : "© 2026 Mirpur College Rover Scout Group — All rights reserved"}
    </div>
  </footer>`;
}

/* ---------------- pages ---------------- */

function pageHome() {
  const lang = state.lang;
  return `
    <section class="bg-forest contour-bg relative overflow-hidden">
      <div class="hero-sheen"></div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 flex flex-col md:flex-row items-center gap-8 md:gap-10 relative">
        <div class="flex-1 text-center md:text-left">
          ${eyebrow(L(UI.scoutMotto, lang))}
          <h1 class="sc-display text-cream text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            ${lang === "bn" ? "নেতৃত্ব ও সেবার <br class='hidden sm:block'> এক তারুণ্যদীপ্ত যাত্রা" : "A Youthful Journey of <br class='hidden sm:block'> Leadership & Service"}
          </h1>
          <p class="text-cream opacity-85 mt-5 max-w-md mx-auto md:mx-0">
            ${lang === "bn" ? "মিরপুর কলেজ রোভার স্কাউট গ্রুপ কলেজ শিক্ষার্থীদের নেতৃত্ব, স্বেচ্ছাসেবা ও অভিযাত্রার মাধ্যমে দায়িত্বশীল নাগরিক হিসেবে গড়ে তোলে।" : "Mirpur College Rover Scout Group shapes responsible young citizens through leadership, community service, and adventure."}
          </p>
          <div class="flex gap-4 mt-8 flex-wrap justify-center md:justify-start">
            <button onclick="setPage('register')" class="btn-primary">${L(UI.joinNow, lang)}</button>
            <button onclick="setPage('about')" class="btn-ghost">${L(UI.learnMore, lang)}</button>
          </div>
        </div>
        <div class="flex-1 flex justify-center"><div class="float-slow">${compassMark(190)}</div></div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "স্বাগতম" : "Welcome", lang === "bn" ? "আমাদের বার্তা" : "Our Message")}
      <p class="max-w-2xl text-rope leading-relaxed">
        ${lang === "bn" ? "আমরা বিশ্বাস করি প্রতিটি তরুণ-তরুণীর মাঝে নেতৃত্বের বীজ লুকিয়ে আছে। মিরপুর কলেজের প্রাঙ্গণ থেকে শুরু করে ক্যাম্পের আগুনের পাশে এবং সেবার হাত বাড়িয়ে আমরা সেই বীজকে অঙ্কুরিত করি। আমাদের এই রোভারিং যাত্রায় আপনাকে স্বাগতম।" : "We believe every young person carries the seed of leadership within them. From the halls of Mirpur College to the campfire and hands-on community service, we help that seed grow. Welcome to our Rovering journey."}
      </p>
    </section>

    <section class="bg-canvas py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-10">
        ${card(`<h3 class="sc-display text-forest text-xl font-bold mb-3">${L(UI.scoutPromise, lang)}</h3><p class="text-rope leading-relaxed">${lang === "bn" ? "\u201cআমি আমার আত্নমর্যাদার উপর বিশ্বাস করে বলছ যে — ঈশ্বর ও দেশের প্রতি আমার কর্তব্য পালন করতে, সর্বদা অপরকে সাহায্য করতে এবং স্কাউট আইন মেনে চলতে আমি আমার যথাসাধ্য চেষ্টা করব।\u201d" : "\u201cOn my honor, I promise that - I will do my best to fulfill my duty to God and my country, to always help others, and to obey the Scout Law.\u201d"}</p>`)}
        ${card(`<h3 class="sc-display text-forest text-xl font-bold mb-3">${L(UI.scoutLaw, lang)}</h3><p class="text-rope leading-relaxed">${(lang === "bn" ? [
          "১. স্কাউট আত্মমর্যাদায় বিশ্বাসী।",
          "২. স্কাউট সকলের বন্ধু।",
          "৩. স্কাউট বিনয়ী ও অনুগত।",
          "৪. স্কাউট জীবের প্রতি সদয়।",
          "৫. স্কাউট সদা প্রফুল্ল।",
          "৬. স্কাউট মিতব্যয়ী।",
          "৭. স্কাউট চিন্তা, কথা ও কাজে নির্মল।",
        ] : [
          "1. A Scout is trustworthy.",
          "2. A Scout is a friend to all.",
          "3. A Scout is polite and loyal.",
          "4. A Scout is kind to all living things.",
          "5. A Scout is always cheerful.",
          "6. A Scout is thrifty.",
          "7. A Scout is clean in thought, word, and deed.",
        ]).join("<br>")}</p>`)}
         ${card(`<h3 class="sc-display text-forest text-xl font-bold mb-3">${L(UI.scoutMotto, lang)}</h3><p class="text-rope leading-relaxed">${lang === "bn" ? "\u201cরোভার স্কাউটের মূলমন্ত্র হলো: "সেবা" \u201d" : "\u201cThe Rover Scout motto is: "Service" \u201d"}</p>`)}
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "পরিসংখ্যান" : "Statistics", lang === "bn" ? "সংখ্যায় আমাদের সংগঠন" : "Our Organization in Numbers")}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        ${STATS.map((s, i) => `<div class="flex justify-center">${patch(s.icon, L(s.value, lang), L(s.label, lang), "gold", 110, i % 2 === 0 ? -4 : 4)}</div>`).join("")}
      </div>
    </section>

    <section class="bg-canvas py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        ${sectionTitle(lang === "bn" ? "আপডেট" : "Updates", lang === "bn" ? "সাম্প্রতিক সংবাদ" : "Latest News")}
        <div class="grid md:grid-cols-3 gap-6">
          ${NEWS.slice(0, 3).map(n => card(`
            ${n.tag ? `<div class="sc-eyebrow text-ember text-xs mb-2">${L(n.tag, lang)}</div>` : ""}
            <h4 class="font-semibold text-forest mb-2">${L(n.title, lang)}</h4>
            <div class="text-rope text-sm flex items-center gap-2">${icon("clock", 'style="width:14px;height:14px"')}${L(n.date, lang)}</div>`)).join("")}
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "সামনে যা আসছে" : "Coming Up", lang === "bn" ? "আসন্ন ইভেন্ট" : "Upcoming Events")}
      <div class="grid md:grid-cols-3 gap-6">
        ${EVENTS.slice(0, 3).map(e => card(`
          <h4 class="font-semibold text-forest mb-2">${L(e.title, lang)}</h4>
          ${e.date ? `<div class="text-rope text-sm flex items-center gap-2 mb-1">${icon("calendar", 'style="width:14px;height:14px"')}${L(e.date, lang)}</div>` : ""}
          ${e.loc ? `<div class="text-rope text-sm flex items-center gap-2 mb-3">${icon("map-pin", 'style="width:14px;height:14px"')}${L(e.loc, lang)}</div>` : ""}
          <button onclick="setPage('events')" class="btn-primary text-sm">${L(UI.registerBtn, lang)}</button>`)).join("")}
      </div>
    </section>

    <section class="bg-canvas py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        ${sectionTitle(lang === "bn" ? "মুহূর্তগুলো" : "Moments", lang === "bn" ? "গ্যালারি" : "Gallery")}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${GALLERY.slice(0, 4).map(item => `<img src="${galleryImgSrc(item)}" alt="scout activity" class="rounded-lg object-cover w-full h-32 md:h-40" />`).join("")}
        </div>
      </div>
    </section>`;
}

function pageAbout() {
  const lang = state.lang;
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "পরিচিতি" : "Introduction", lang === "bn" ? "আমাদের সম্পর্কে" : "About Us")}
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${ABOUT_BLOCKS.map(b => card(`
          ${icon(b.icon, 'style="width:26px;height:26px" class="text-ember mb-3"')}
          <h4 class="sc-display font-bold text-forest mb-2">${L(b.title, lang)}</h4>
          <p class="text-rope text-sm leading-relaxed">${L(b.body, lang)}</p>`)).join("")}
      </div>
    </div>`;
}

function pageLeadership() {
  const lang = state.lang;
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "আমাদের কাণ্ডারি" : "Our Guides", lang === "bn" ? "নেতৃত্ব" : "Leadership")}
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${LEADERSHIP.map(l => card(`
          <div class="flex justify-center mb-4">${icon(l.icon, 'style="width:30px;height:30px" class="text-ember"')}</div>
          <h4 class="font-semibold text-forest">${l.name}</h4>
          <div class="sc-eyebrow text-rope text-xs mt-1">${L(l.role, lang)}</div>`, "text-center")).join("")}
      </div>
    </div>`;
}

function pageContact() {
  const lang = state.lang;
  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "সাহায্য দরকার?" : "Need Help?", lang === "bn" ? "যোগাযোগ করুন" : "Get in Touch")}
      <div class="grid md:grid-cols-2 gap-6 md:gap-8">
        ${card(`
          <div class="grid grid-cols-1 gap-4">
            <input class="input-field" placeholder="${L(UI.yourName, lang)}" />
            <input class="input-field" placeholder="${L(UI.email, lang)}" />
            <textarea class="input-field" rows="4" placeholder="${L(UI.yourMessage, lang)}"></textarea>
            <button class="btn-primary" onclick="alert('${lang === "bn" ? "বার্তা পাঠানো হয়েছে (নমুনা)" : "Message sent (demo)"}')">${L(UI.sendMessage, lang)}</button>
          </div>`)}
        ${card(`
          <div class="rounded-lg overflow-hidden mb-4 h-48">
            <iframe
              src="https://www.google.com/maps?q=${encodeURIComponent(ORG.mapQuery)}&output=embed"
              width="100%" height="100%" style="border:0; display:block;"
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              title="${lang === "bn" ? "মানচিত্র" : "Map"}"></iframe>
          </div>
          <a href="${ORG.mapLink}" target="_blank" rel="noopener" class="text-ember text-sm flex items-center gap-2 mb-4 hover:underline">
            ${icon("map-pin", 'style="width:16px;height:16px"')} ${lang === "bn" ? "গুগল ম্যাপে দেখুন" : "Open in Google Maps"}
          </a>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-rope">${icon("phone", 'style="width:16px;height:16px"')} +৮৮০ ২-৯xxxxxxx</div>
            <div class="flex items-center gap-2 text-rope">${icon("mail", 'style="width:16px;height:16px"')} mcrsg.mirpurcollege@gmail.com</div>
            <div class="flex items-center gap-2 text-rope">${icon("facebook", 'style="width:16px;height:16px"')} fb.com/mirpurcollegerover</div>
            <div class="flex items-center gap-2 text-rope">${icon("youtube", 'style="width:16px;height:16px"')} youtube.com/mirpurcollegerover</div>
          </div>`)}
      </div>
    </div>`;
}

function pageGallery() {
  const lang = state.lang;
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "স্মৃতির পাতা" : "Memories", lang === "bn" ? "গ্যালারি" : "Gallery")}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        ${GALLERY.map(item => `<img src="${galleryImgSrc(item)}" class="rounded-lg object-cover w-full h-32 sm:h-36" alt="scout gallery" />`).join("")}
      </div>
    </div>`;
}

function pageDownloads() {
  const lang = state.lang;
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "নথিপত্র" : "Documents", lang === "bn" ? "ডাউনলোড" : "Downloads")}
      <div class="flex flex-col gap-3">
        ${DOWNLOADS.map(d => card(`
          <div class="flex items-center gap-3">
            ${icon("file-text", 'style="width:22px;height:22px" class="text-ember flex-shrink-0"')}
            <div>
              <div class="text-forest font-medium">${L(d.name, lang)}</div>
              <div class="text-rope text-xs">${d.size}</div>
            </div>
          </div>
          <a href="${d.file}" download class="btn-primary text-sm flex items-center justify-center gap-2">${icon("download", 'style="width:16px;height:16px"')} ${L(UI.download, lang)}</a>`,
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3")).join("")}
      </div>
    </div>`;
}

function pageEvents() {
  const lang = state.lang;
  const cats = lang === "bn"
    ? ["ক্যাম্প রেজিস্ট্রেশন", "হাইকিং", "প্রশিক্ষণ", "স্বেচ্ছাসেবক কর্মসূচি", "কমিউনিটি সার্ভিস"]
    : ["Camp Registration", "Hiking", "Training", "Volunteer Programs", "Community Service"];
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "কর্মসূচি" : "Programs", lang === "bn" ? "ইভেন্টসমূহ" : "Events")}
      <div class="flex flex-wrap gap-2 sm:gap-3 mb-8">
        ${cats.map(c => `<span class="card px-4 py-2 text-sm text-forest">${c}</span>`).join("")}
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        ${EVENTS.map(e => card(`
          <img src="https://picsum.photos/seed/${String(L(e.title, lang)).length}${e.id || ""}/400/200" class="rounded-lg mb-4 w-full h-32 object-cover" alt="${L(e.title, lang)}" />
          <h4 class="font-semibold text-forest mb-2">${L(e.title, lang)}</h4>
          ${e.date ? `<div class="text-rope text-sm flex items-center gap-2 mb-1">${icon("calendar", 'style="width:14px;height:14px"')}${L(e.date, lang)}</div>` : ""}
          ${e.loc ? `<div class="text-rope text-sm flex items-center gap-2 mb-1">${icon("map-pin", 'style="width:14px;height:14px"')}${L(e.loc, lang)}</div>` : ""}
          ${e.seats ? `<div class="text-rope text-sm flex items-center gap-2 mb-3">${icon("users", 'style="width:14px;height:14px"')}${L(UI.participants, lang)}: ${L(e.seats, lang)}</div>` : ""}
          <button onclick="setPage('register')" class="btn-primary text-sm w-full">${L(UI.registerBtn, lang)}</button>`)).join("")}
      </div>
    </div>`;
}

function pageNews() {
  const lang = state.lang;
  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "প্রকাশনা" : "Publications", lang === "bn" ? "সংবাদ ও নোটিশ" : "News & Notices")}
      <div class="flex flex-col gap-4">
        ${NEWS.map(n => card(`
          ${n.tag ? `<div class="sc-eyebrow text-ember text-xs bg-canvas px-2 py-1 rounded flex-shrink-0">${L(n.tag, lang)}</div>` : ""}
          <div>
            <h4 class="font-semibold text-forest">${L(n.title, lang)}</h4>
            <div class="text-rope text-sm mt-1 flex items-center gap-2">${icon("clock", 'style="width:14px;height:14px"')}${L(n.date, lang)}</div>
          </div>`, "flex items-start gap-4")).join("")}
      </div>
    </div>`;
}

function pageAchievement() {
  const lang = state.lang;
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "গর্বের মুহূর্ত" : "Proud Moments", lang === "bn" ? "অর্জন" : "Achievements")}
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${ACHIEVEMENTS.map(a => card(`
          ${icon(a.icon, 'style="width:28px;height:28px" class="text-ember mb-3"')}
          <h4 class="font-semibold text-forest mb-2">${L(a.title, lang)}</h4>
          <p class="text-rope text-sm">${L(a.detail, lang)}</p>`)).join("")}
      </div>
    </div>`;
}

/* ---------------- Firestore sync for MEMBERS ----------------
   If js/firebase-config.js still has placeholder values (Firebase not
   set up yet), fbMembersReady() returns false and everything falls back
   to the old in-memory-only behaviour, so the site keeps working even
   before Firebase is connected. */
const MEMBERS_COLLECTION = "members";
const APPLICATIONS_COLLECTION = "applications";
let membersUnsub = null;

function fbMembersReady() {
  return typeof firebase !== "undefined" && typeof firebase.firestore === "function";
}

function startMembersListener() {
  if (!fbMembersReady()) return; // no firebase-config.js values yet — stay on local MEMBERS
  if (membersUnsub) return;
  membersUnsub = firebase.firestore().collection(MEMBERS_COLLECTION)
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snap) => {
        MEMBERS = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        render();
      },
      (err) => {
        console.error("members listener error:", err);
        // Most likely cause: Firestore security rules don't allow public
        // read yet — see public/MEMBER-FIREBASE-SETUP.md.
      }
    );
}

let registerForm = {};
let registerSubmitted = false;
let lastRegisteredMemberId = null;

function updateRegisterField(k, v) { registerForm[k] = v; }

function handleRegisterPhotoSelected(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    // Firestore documents are capped at ~1MiB, and this photo shares the
    // doc with the rest of the profile fields — keep some headroom.
    if (dataUrl.length > 700000) {
      alert(state.lang === "bn"
        ? "ছবিটি অনেক বড়। আরেকটু ছোট সাইজের পাসপোর্ট ছবি দিয়ে আবার চেষ্টা করো।"
        : "This photo is too large. Please try a smaller passport-size photo.");
      input.value = "";
      return;
    }
    registerForm.photo = dataUrl;
    render();
  };
  reader.onerror = () => {
    alert(state.lang === "bn" ? "ছবি পড়তে সমস্যা হয়েছে, আবার চেষ্টা করো।" : "Couldn't read that photo, please try again.");
  };
  reader.readAsDataURL(file);
}

function submitRegister() {
  const newId = nextMemberId();
  const newMember = {
    id: newId,
    name: { bn: registerForm.name || "", en: registerForm.name || "" },
    inst: { bn: registerForm.institution || "", en: registerForm.institution || "" },
    rank: UI.applicantRank,
    mobile: registerForm.phone || "",
    email: registerForm.email || "",
    blood: registerForm.blood || "",
    photo: registerForm.photo || "",
    joiningDate: { bn: new Date().toLocaleDateString("bn-BD"), en: new Date().toLocaleDateString("en-GB") },
    attendance: 0,
    badgeCount: 0,
    avatarSeed: newId,
    isNew: true,
  };

  if (fbMembersReady()) {
    // Goes into "applications" (pending) — an admin must Approve it in
    // /admin > Applications before it becomes a real member. Document ID
    // = the Rover ID itself, so it's the same value everywhere once approved.
    firebase.firestore().collection(APPLICATIONS_COLLECTION).doc(newId).set({
      ...newMember,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch((err) => console.error("save application failed:", err));
  } else {
    // Firebase not configured yet — keep the old local-only behaviour.
    MEMBERS.unshift(newMember);
  }

  lastRegisteredMemberId = newId;
  registerSubmitted = true;
  render();
}

function newRegisterApplication() { registerSubmitted = false; registerForm = {}; lastRegisteredMemberId = null; render(); }

function pageRegister() {
  const lang = state.lang;
  if (registerSubmitted) {
    return `
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        ${icon("check-circle", 'style="width:48px;height:48px" class="text-ember mx-auto mb-4"')}
        <h3 class="sc-display text-2xl font-bold text-forest">${L(UI.applicationReceived, lang)}</h3>
        <p class="text-rope mt-2">${L(UI.applicationReceivedSub, lang)}</p>
        <button class="btn-primary mt-6" onclick="newRegisterApplication()">${L(UI.newApplication, lang)}</button>
      </div>`;
  }
  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      ${sectionTitle(lang === "bn" ? "নতুন সদস্য" : "New Member", lang === "bn" ? "অনলাইন রেজিস্ট্রেশন" : "Online Registration")}
      ${card(`
        <div class="grid sm:grid-cols-2 gap-4">
          ${REGISTER_FIELDS.map(([k, label]) => `
            <div>
              <label class="text-sm text-rope block mb-1">${L(label, lang)}</label>
              <input class="input-field" value="${registerForm[k] || ""}" oninput="updateRegisterField('${k}', this.value)" />
            </div>`).join("")}
          <div>
            <label class="text-sm text-rope block mb-1">${L(UI.gender, lang)}</label>
            <select class="input-field" onchange="updateRegisterField('gender', this.value)">
              <option value="">${L(UI.selectOption, lang)}</option>
              <option>${L(UI.male, lang)}</option>
              <option>${L(UI.female, lang)}</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-rope block mb-1">${L(UI.photo, lang)}</label>
            <input type="file" accept="image/*" class="input-field" onchange="handleRegisterPhotoSelected(this)" />
            ${registerForm.photo ? `<img src="${registerForm.photo}" class="mt-2 rounded-lg w-20 h-20 object-cover" alt="preview" />` : ""}
          </div>
        </div>
        <div class="mt-5">
          <label class="text-sm text-rope block mb-1">${L(UI.signature, lang)}</label>
          <input class="input-field" value="${registerForm.signature || ""}" oninput="updateRegisterField('signature', this.value)" />
        </div>
        <button class="btn-primary mt-6" onclick="submitRegister()">${L(UI.submitApplication, lang)}</button>`)}
    </div>`;
}

function pageLoginRedirect() {
  const lang = state.lang;
  return `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      ${icon("key-round", 'style="width:44px;height:44px" class="text-ember mx-auto mb-4"')}
      <h3 class="sc-display text-2xl font-bold text-forest">${lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</h3>
      <p class="text-rope mt-2">${lang === "bn" ? "অ্যাডমিন প্যানেল একটি পৃথক অ্যাপ্লিকেশন — নিচের লিংকে যান।" : "The admin panel is a separate application — open the link below."}</p>
      <a href="../admin/index.html" class="btn-primary mt-6 inline-block">${lang === "bn" ? "অ্যাডমিন প্যানেলে যান" : "Go to Admin Panel"}</a>
    </div>`;
}

const PAGES = {
  home: pageHome, about: pageAbout, leadership: pageLeadership, contact: pageContact,
  gallery: pageGallery, downloads: pageDownloads, events: pageEvents, news: pageNews,
  achievement: pageAchievement, register: pageRegister, login: pageLoginRedirect,
};

/* ---------------- root render ---------------- */

function createIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function render() {
  document.documentElement.className = state.dark ? "dark" : "";
  document.documentElement.lang = state.lang;
  const root = document.getElementById("root");
  const pageFn = PAGES[state.page] || pageHome;
  root.innerHTML = `
    <div class="sc-root">
      ${renderNav()}
      <main>${pageFn()}</main>
      ${renderFooter()}
    </div>`;
  createIcons();
}

startMembersListener();
startEventsListener();
startGalleryListener();
startNoticesListener();
render();
