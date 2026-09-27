const DATA = window.DATA;
const CONTRACT = DATA.contract;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function usd(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function compactUsd(n) {
  if (n >= 10000) return "$" + (n / 1000).toFixed(2) + "K";
  if (n >= 1000) {
    const k = Math.round((n / 1000) * 10) / 10;
    return "$" + (Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)) + "K";
  }
  return usd(n);
}
function sprite(id, px) {
  if (!id) {
    return `<img src="assets/mark.png" alt="" width="${px}" height="${px}" style="width:${px}px;height:${px}px;object-fit:contain">`;
  }
  const src = id <= 649
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  return `<img class="pixel" src="${src}" alt="#${id}" width="${px}" height="${px}" style="width:${px}px;height:${px}px;object-fit:contain">`;
}
function strategyBySlug(slug) {
  return DATA.strategies.find((s) => s.slug === slug);
}
function toast(message) {
  const el = document.querySelector(".toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}
function copyContract(btn) {
  navigator.clipboard.writeText(CONTRACT).then(() => {
    const prev = btn.innerHTML;
    btn.textContent = "copied";
    setTimeout(() => { btn.innerHTML = prev; }, 1200);
  }).catch(() => toast("Copy the contract from the footer."));
}

function header(page) {
  const links = [
    ["browse.html", "Strategies", "browse"],
    ["market.html", "Live Market", "market"],
    ["raffles.html", "Raffles", "raffles"],
    ["how-it-works.html", "How It Works", "how"],
  ];
  const nav = links.map(([href, label, id]) => `<a href="${href}" class="${page === id ? "active" : ""}">${label}</a>`).join("");
  return `<header class="site-header">
    <div class="header-inner">
      <div style="display:flex;align-items:center;gap:4px">
        <a class="brand" href="index.html">${sprite(25, 28)}<span><em>Poké</em><span>Strategy</span></span></a>
        <nav class="nav">${nav}</nav>
      </div>
      <div class="header-actions">
        <span class="contract-pill" title="${CONTRACT}"><b>$VAULT</b><span>7tEs…5zpump</span>
          <button class="copy-btn" type="button" data-copy>copy ⧉</button>
        </span>
        <a class="btn btn-sm btn-primary button-inner-shadow" href="deploy.html">Deploy Strategy</a>
        <button class="menu-btn" type="button" aria-label="Menu" data-menu>☰</button>
      </div>
    </div>
    <div class="menu-panel" data-menu-panel>${nav}</div>
  </header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="wrap foot-grid">
    <div class="foot-brand">
      <a class="brand" href="index.html">${sprite(25, 28)}<span><em>Poké</em><span>Strategy</span></span></a>
      <p>Tokens whose fees buy graded, vaulted Pokémon cards and raffle them to holders.</p>
      <div class="built">a product of <b>Vault</b> · vaulted RWA strategies</div>
      <div class="built">built on
        <a href="https://collectorcrypt.com" target="_blank" rel="noreferrer">Collector Crypt</a>
        <a href="https://pump.fun" target="_blank" rel="noreferrer">pump.fun</a>
        <a href="https://jup.ag" target="_blank" rel="noreferrer">Jupiter</a>
      </div>
      <div class="contract-block">
        <div>$VAULT contract</div>
        <div class="addr">${CONTRACT} <button class="copy-btn" type="button" data-copy>copy ⧉</button></div>
        <div class="ext-links">
          <a href="https://pump.fun/coin/${CONTRACT}" target="_blank" rel="noreferrer">pump.fun ↗</a>
          <a href="https://dexscreener.com/solana/${CONTRACT}" target="_blank" rel="noreferrer">Dexscreener ↗</a>
          <a href="https://jup.ag/swap/SOL-${CONTRACT}" target="_blank" rel="noreferrer">Jupiter ↗</a>
        </div>
      </div>
    </div>
    <div>
      <nav class="foot-nav">
        <a href="browse.html">Strategies</a>
        <a href="raffles.html">Raffles</a>
        <a href="market.html">Live Market</a>
        <a href="deploy.html">Deploy</a>
        <a href="how-it-works.html">How It Works</a>
        <a href="tos.html">Terms</a>
      </nav>
      <p class="legal">© 2026 Vault. Strategy tokens are experimental and unaudited. Strategy wallets are programmatic and only buy cards. Cards stay in Collector Crypt's insured vault until raffled. Nothing here is financial advice.</p>
    </div>
  </div></footer>
  <div class="toast" role="status"></div>`;
}

function cardTile(c, opts = {}) {
  const discount = c.fmv && c.price < c.fmv ? Math.round((1 - c.price / c.fmv) * 100) : 0;
  const strat = c.slug ? strategyBySlug(c.slug) : null;
  return `<article class="slab">
    <a class="slab-art" href="${c.href}" target="_blank" rel="noreferrer">
      <img class="card-photo" src="${c.image}" alt="${esc(c.title)}">
      <span class="slab-source"><img src="assets/collector.png" alt="Collector Crypt"></span>
      ${c.badge ? `<span class="deal-flag">${esc(c.badge)}</span>` : ""}
    </a>
    <div class="slab-meta">
      <a class="slab-title" href="${c.href}" target="_blank" rel="noreferrer" title="${esc(c.title)}">${esc(c.title)}</a>
      <div class="tags">${c.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="price-line">
        <b>${usd(c.price)}</b>
        ${c.sol ? `<span>${c.sol} SOL</span>` : ""}
        <span>FMV ${usd(c.fmv)}</span>
      </div>
      ${discount ? `<div class="discount">−${discount}% vs FMV</div>` : ""}
      <div class="seller">seller ${esc(c.seller)}</div>
      ${opts.strategy && strat ? `<div class="strat-foot"><a href="strategy.html?slug=${strat.slug}">${sprite(strat.dex, 18)} $${esc(strat.ticker)}</a><b>${usd(c.price)}</b></div>` : ""}
      ${opts.bought ? `<div class="seller">bought ${esc(c.ago)} for ${usd(c.price)}</div>` : ""}
    </div>
  </article>`;
}

function strategyCard(s) {
  return `<a class="strategy-card" href="strategy.html?slug=${s.slug}">
    <div class="sprite-box">${sprite(s.dex, 64)}</div>
    <div class="grow">
      <h3><span>${esc(s.name)}</span><span class="chip">$${esc(s.ticker)}</span></h3>
      <div class="chip-row" style="margin-top:8px">${s.rules.map((r) => `<span class="chip">${esc(r)}</span>`).join("")}</div>
      <div class="foot"><span><b>${s.cards}</b> cards · est. <b>${s.value >= 1000 ? compactUsd(s.value) : usd(s.value)}</b></span><img src="assets/collector.png" alt="" width="16" height="16" style="width:16px;height:16px"></div>
    </div>
  </a>`;
}

function renderHome() {
  const layer = document.getElementById("marquee");
  if (layer) {
    layer.innerHTML = Array.from({ length: 8 }, (_, row) => {
      const ids = [];
      for (let n = row + 1; n <= 151; n += 9) ids.push(n);
      const doubled = ids.concat(ids);
      const rev = row % 2 ? " reverse" : "";
      const dur = 34 + row * 4;
      return `<div class="marquee-row${rev}" style="animation-duration:${dur}s">${doubled.map((id) => `<div class="bubble">${sprite(id, 72)}</div>`).join("")}</div>`;
    }).join("");
  }
  const ticks = DATA.cards.filter((c) => c.ticker);
  const tickHtml = ticks.concat(ticks).map((c) => `<span class="tick"><img src="assets/collector.png" alt=""><a href="strategy.html?slug=${c.slug}">$${esc(c.ticker)}</a><span class="muted">bought</span><span>${esc(c.title)}</span><b>${usd(c.price)}</b><span class="muted">${esc(c.ago)}</span><span class="dot">•</span></span>`).join("");
  const ticker = document.getElementById("ticker");
  if (ticker) ticker.innerHTML = tickHtml;
  const fresh = document.getElementById("fresh");
  if (fresh) fresh.innerHTML = DATA.cards.slice(0, 6).map((c) => cardTile(c, { strategy: true })).join("");
  const deals = document.getElementById("deals");
  if (deals) deals.innerHTML = DATA.cards.filter((c) => c.deal).map((c) => cardTile(c)).join("");
  const top = document.getElementById("top");
  if (top) top.innerHTML = ["pikastr", "vaultstr-2b83", "kabutstr-e415", "charstr", "mewstr", "gengastr"].map((slug) => strategyCard(strategyBySlug(slug))).join("");
}

function renderBrowse() {
  const root = document.getElementById("browse-root");
  const params = new URLSearchParams(location.search);
  const state = { q: params.get("q") || "", pokemon: params.get("q") || "Any", view: "table", holds: false, mcap: "any", window: "any" };
  const names = [...new Set(DATA.strategies.flatMap((s) => s.pokemon))].sort();
  const counts = Object.fromEntries(names.map((n) => [n, DATA.strategies.filter((s) => s.pokemon.includes(n)).length]));

  function filtered() {
    return DATA.strategies.filter((s) => {
      if (state.pokemon !== "Any" && !s.pokemon.includes(state.pokemon) && !s.rules.some((r) => r.toLowerCase().includes(state.pokemon.toLowerCase())) && !s.name.toLowerCase().includes(state.pokemon.toLowerCase())) return false;
      if (state.holds && s.cards <= 0) return false;
      if (state.mcap === "5" && s.mcap < 5000) return false;
      if (state.mcap === "25" && s.mcap < 25000) return false;
      if (state.mcap === "100" && s.mcap < 100000) return false;
      if (state.window !== "any" && s.window !== state.window) return false;
      if (state.q && state.pokemon === "Any") {
        const blob = (s.name + " " + s.ticker + " " + s.rules.join(" ")).toLowerCase();
        if (!blob.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
  }

  function paint() {
    const rows = filtered();
    const chips = [`<button class="pick ${state.pokemon === "Any" ? "on" : ""}" data-poke="Any">Any Pokémon</button>`]
      .concat(names.map((n) => `<button class="pick ${state.pokemon === n ? "on" : ""}" data-poke="${esc(n)}">${esc(n)} (${counts[n]})</button>`))
      .join("");
    const body = state.view === "cards"
      ? `<div class="strategy-grid">${rows.map(strategyCard).join("") || `<p class="empty">No strategies match.</p>`}</div>`
      : `<div class="table-wrap"><table>
          <thead><tr><th>Strategy</th><th>Rules</th><th>Market cap</th><th>Fees</th><th>Treasury</th><th>Cards</th><th>Deployed</th><th>Est. value</th><th>Created</th></tr></thead>
          <tbody>${rows.map((s) => `<tr>
            <td><a class="who" href="strategy.html?slug=${s.slug}">${sprite(s.dex, 36)}<span><b>${esc(s.name)}</b><span class="muted">$${esc(s.ticker)}</span></span></a></td>
            <td><div class="chip-row">${s.rules.map((r) => `<a class="chip" href="browse.html?q=${encodeURIComponent(r)}">${esc(r)}</a>`).join("")}</div></td>
            <td><b>${compactUsd(s.mcap)}</b> <span class="${s.change < 0 ? "down" : "up"}">${s.change > 0 ? "+" : ""}${s.change}%</span></td>
            <td class="mono">${s.feesSol.toFixed(2)} SOL</td>
            <td>${usd(s.treasury)}</td>
            <td>${s.cards}</td>
            <td>${usd(s.deployed)}</td>
            <td>${usd(s.value)}</td>
            <td class="muted">${esc(s.created)}</td>
          </tr>`).join("")}</tbody>
        </table></div>`;
    root.innerHTML = `
      <div class="page"><div class="wrap">
        <div class="kicker">Live</div>
        <h1 style="margin-top:8px">Strategies</h1>
        <div class="stat-grid">
          <div class="stat"><span>Live</span><b>${DATA.stats.strategies}</b></div>
          <div class="stat"><span>Market cap</span><b>${compactUsd(DATA.stats.mcap)}</b></div>
          <div class="stat"><span>Cards</span><b>${DATA.stats.cards}</b></div>
          <div class="stat"><span>Deployed</span><b>${compactUsd(DATA.stats.deployed)}</b></div>
          <div class="stat"><span>Est. value</span><b>${compactUsd(DATA.stats.value)}</b></div>
        </div>
        <div class="chip-row" style="margin-top:18px" data-pokes>${chips}</div>
        <div class="filters" style="margin-top:14px">
          <div class="field"><label>Search</label><input id="q" value="${esc(state.pokemon === "Any" ? state.q : "")}" placeholder="Name, ticker, rule"></div>
          <div class="chip-row">
            <span class="muted" style="font-size:12px;align-self:center">Raffle</span>
            ${["any", "1h", "2h", "24h"].map((w) => `<button class="pick ${state.window === w ? "on" : ""}" data-window="${w}">${w === "any" ? "Any raffle" : w}</button>`).join("")}
            <span class="muted" style="font-size:12px;align-self:center">Market cap</span>
            ${[["any", "Any"], ["5", "≥ $5K"], ["25", "≥ $25K"], ["100", "≥ $100K"]].map(([id, label]) => `<button class="pick ${state.mcap === id ? "on" : ""}" data-mcap="${id}">${label}</button>`).join("")}
            <button class="pick ${state.holds ? "on" : ""}" data-holds>Holds cards</button>
          </div>
        </div>
        <div class="toolbar">
          <div class="muted">${rows.length} of ${DATA.strategies.length} shown · sample of the live board</div>
          <div class="seg">
            <button type="button" data-view="table" class="${state.view === "table" ? "on" : ""}">Table</button>
            <button type="button" data-view="cards" class="${state.view === "cards" ? "on" : ""}">Cards</button>
          </div>
        </div>
        ${body}
      </div></div>`;
    root.querySelectorAll("[data-poke]").forEach((btn) => btn.addEventListener("click", () => { state.pokemon = btn.dataset.poke; state.q = ""; paint(); }));
    root.querySelectorAll("[data-window]").forEach((btn) => btn.addEventListener("click", () => { state.window = btn.dataset.window; paint(); }));
    root.querySelectorAll("[data-mcap]").forEach((btn) => btn.addEventListener("click", () => { state.mcap = btn.dataset.mcap; paint(); }));
    root.querySelector("[data-holds]").addEventListener("click", () => { state.holds = !state.holds; paint(); });
    root.querySelectorAll("[data-view]").forEach((btn) => btn.addEventListener("click", () => { state.view = btn.dataset.view; paint(); }));
    root.querySelector("#q").addEventListener("input", (e) => { state.q = e.target.value; state.pokemon = "Any"; paint(); root.querySelector("#q").focus(); });
  }
  paint();
}

function marketFilters(state) {
  return DATA.cards.filter((c) => {
    if (state.pokemon && c.pokemon.toLowerCase() !== state.pokemon.toLowerCase() && !c.title.toLowerCase().includes(state.pokemon.toLowerCase())) return false;
    if (state.grader !== "any" && c.grader !== state.grader) return false;
    if (state.minGrade && c.grade < Number(state.minGrade)) return false;
    if (state.maxGrade && c.grade > Number(state.maxGrade)) return false;
    if (state.lang !== "any" && c.lang !== state.lang) return false;
    if (state.yearFrom && c.year < Number(state.yearFrom)) return false;
    if (state.yearTo && c.year > Number(state.yearTo)) return false;
    if (state.minPrice && c.price < Number(state.minPrice)) return false;
    if (state.maxPrice && c.price > Number(state.maxPrice)) return false;
    if (state.under && !(c.fmv && c.price < c.fmv)) return false;
    if (state.text && !c.title.toLowerCase().includes(state.text.toLowerCase())) return false;
    return true;
  }).sort((a, b) => state.order === "deal" ? (b.fmv - b.price) - (a.fmv - a.price) : a.price - b.price);
}

function renderMarket() {
  const root = document.getElementById("market-root");
  const state = { pokemon: "", grader: "any", minGrade: "", maxGrade: "", lang: "any", yearFrom: "", yearTo: "", minPrice: "", maxPrice: "", under: false, text: "", order: "floor" };
  const grades = ["10", "9.5", "9", "8.5", "8", "7", "6"];
  function paint() {
    const rows = marketFilters(state);
    const summary = state.pokemon || state.grader !== "any" || state.under || state.text
      ? `${rows.length} listing${rows.length === 1 ? "" : "s"} match these rules.`
      : "No filters: cheapest graded Pokémon cards on Collector Crypt, in price order.";
    root.innerHTML = `<div class="page"><div class="wrap">
      <h1>Live Market</h1>
      <p class="sub">Every graded Pokémon card listed on <a class="inline-logo" href="https://collectorcrypt.com" target="_blank" rel="noreferrer"><img src="assets/collector.png" alt="">Collector Crypt</a>, normalized: numeric grades, canonical language and set names, USD prices, insured value as fair value. Exactly what a strategy sees, in the order it would buy.</p>
      <div class="layout-2" style="margin-top:28px">
        <aside class="panel">
          <div class="field"><label>Pokémon</label><input data-k="pokemon" value="${esc(state.pokemon)}" placeholder="Pikachu"></div>
          <div class="field" style="margin-top:12px"><label>Grader</label>
            <div class="grade-picks">${["any", "PSA", "CGC", "BGS", "SGC", "TAG"].map((g) => `<button type="button" class="pick ${state.grader === g ? "on" : ""}" data-grader="${g}">${g === "any" ? "Any" : g}</button>`).join("")}</div>
          </div>
          <div class="field" style="margin-top:12px"><label>Min grade</label><div class="grade-picks">${grades.map((g) => `<button type="button" class="pick ${state.minGrade === g ? "on" : ""}" data-min="${g}">${g}+</button>`).join("")}</div></div>
          <div class="field" style="margin-top:12px"><label>Max grade</label><div class="grade-picks">${grades.map((g) => `<button type="button" class="pick ${state.maxGrade === g ? "on" : ""}" data-max="${g}">≤ ${g}</button>`).join("")}</div></div>
          <div class="field" style="margin-top:12px"><label>Language</label>
            <div class="lang-picks">${["any", "English", "Japanese", "Korean", "Chinese"].map((g) => `<button type="button" class="pick ${state.lang === g ? "on" : ""}" data-lang="${g}">${g === "any" ? "Any" : g}</button>`).join("")}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
            <div class="field"><label>Year from</label><input data-k="yearFrom" value="${esc(state.yearFrom)}" inputmode="numeric"></div>
            <div class="field"><label>Year to</label><input data-k="yearTo" value="${esc(state.yearTo)}" inputmode="numeric"></div>
            <div class="field"><label>Min price $</label><input data-k="minPrice" value="${esc(state.minPrice)}" inputmode="decimal"></div>
            <div class="field"><label>Max price $</label><input data-k="maxPrice" value="${esc(state.maxPrice)}" inputmode="decimal"></div>
          </div>
          <button type="button" class="toggle ${state.under ? "on" : ""}" data-under style="margin-top:14px"><span class="switch"><i></i></span> Only under fair value</button>
          <div class="field" style="margin-top:12px"><label>Must include text</label><input data-k="text" value="${esc(state.text)}"></div>
          <div class="field" style="margin-top:12px"><label>Buy order</label>
            <div class="grade-picks">
              <button type="button" class="pick ${state.order === "floor" ? "on" : ""}" data-order="floor">Floor cheapest first</button>
              <button type="button" class="pick ${state.order === "deal" ? "on" : ""}" data-order="deal">Best deal</button>
            </div>
          </div>
          <a class="btn btn-md btn-primary" style="margin-top:16px;width:100%" href="deploy.html">Turn these filters into a strategy</a>
        </aside>
        <div>
          <p class="muted">${summary}</p>
          <div class="card-grid" style="margin-top:14px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
            ${rows.map((c) => cardTile(c)).join("") || `<p class="empty">Nothing listed fits these filters right now.</p>`}
          </div>
        </div>
      </div>
    </div></div>`;
    const keep = (sel) => {
      const el = root.querySelector(sel);
      if (el) { el.focus(); const v = el.value; el.setSelectionRange(v.length, v.length); }
    };
    root.querySelectorAll("[data-k]").forEach((input) => input.addEventListener("input", () => {
      state[input.dataset.k] = input.value;
      const key = input.dataset.k;
      paint();
      keep(`[data-k="${key}"]`);
    }));
    root.querySelectorAll("[data-grader]").forEach((b) => b.addEventListener("click", () => { state.grader = state.grader === b.dataset.grader ? "any" : b.dataset.grader; if (b.dataset.grader === "any") state.grader = "any"; paint(); }));
    root.querySelectorAll("[data-min]").forEach((b) => b.addEventListener("click", () => { state.minGrade = state.minGrade === b.dataset.min ? "" : b.dataset.min; paint(); }));
    root.querySelectorAll("[data-max]").forEach((b) => b.addEventListener("click", () => { state.maxGrade = state.maxGrade === b.dataset.max ? "" : b.dataset.max; paint(); }));
    root.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => { state.lang = b.dataset.lang; paint(); }));
    root.querySelector("[data-under]").addEventListener("click", () => { state.under = !state.under; paint(); });
    root.querySelectorAll("[data-order]").forEach((b) => b.addEventListener("click", () => { state.order = b.dataset.order; paint(); }));
  }
  paint();
}

function fmtLeft(sec) {
  sec = Math.max(0, sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function renderRaffles() {
  const root = document.getElementById("raffle-root");
  const state = { tab: "upcoming", strategy: "all" };
  const clock = DATA.raffles.map((r) => r.seconds);
  const options = [...new Map(DATA.raffles.map((r) => [r.slug, r])).values()];
  function paint() {
    const list = state.tab === "upcoming"
      ? DATA.raffles.filter((r) => state.strategy === "all" || r.slug === state.strategy)
      : [];
    const winners = DATA.winners.filter((r) => state.strategy === "all" || r.slug === state.strategy);
    let body = "";
    if (state.tab === "upcoming") {
      body = list.map((r, i) => {
        const idx = DATA.raffles.indexOf(r);
        return `<article class="raffle">
          <img src="${r.image}" alt="">
          <div>
            <h3>${esc(r.title)}</h3>
            <div class="muted" style="margin-top:4px;font-size:13px"><a href="strategy.html?slug=${r.slug}">$${esc(r.ticker)}</a> · bought ${esc(r.ago)} for ${usd(r.paid)} · est. ${usd(r.est)} · ${esc(r.window)} window</div>
          </div>
          <div class="count"><b data-left="${idx}">${fmtLeft(clock[idx])}</b><span class="muted">until draw</span></div>
        </article>`;
      }).join("") || `<p class="empty">No draws queued for that strategy.</p>`;
    } else if (state.tab === "winners") {
      body = winners.map((r) => `<article class="raffle">
        <img src="${r.image}" alt="">
        <div><h3>${esc(r.title)}</h3><div class="muted" style="margin-top:4px;font-size:13px"><a href="strategy.html?slug=${r.slug}">$${esc(r.ticker)}</a> · winner ${esc(r.winner)} · ${esc(r.when)}</div></div>
        <div class="count"><b>${usd(r.est)}</b><span class="muted">est. value</span></div>
      </article>`).join("");
    } else {
      body = `<div class="table-wrap"><table><thead><tr><th>Wallet</th><th>Wins</th><th>Est. value</th></tr></thead><tbody>
        ${DATA.leaderboard.map((w) => `<tr><td class="mono">${esc(w.wallet)}</td><td>${w.wins}</td><td>${usd(w.value)}</td></tr>`).join("")}
      </tbody></table></div>`;
    }
    const next = Math.min(...clock);
    root.innerHTML = `<div class="page"><div class="wrap">
      <div class="kicker">Raffles</div>
      <h1 style="margin-top:8px">Every draw,<br>every winner.</h1>
      <p class="sub">Each card a strategy buys is raffled to that strategy's token holders after its window. Countdowns tick live; winners and proofs stay here.</p>
      <div class="metric-grid">
        <div class="metric"><span>Next draw</span><b data-next>${fmtLeft(next)}</b></div>
        <div class="metric"><span>Queued</span><b>${DATA.stats.cards}</b><em class="muted">in the sample, ${DATA.raffles.length} shown</em></div>
        <div class="metric"><span>Cards given away</span><b>${DATA.stats.given}</b><em class="muted">${usd(DATA.stats.givenValue)}</em></div>
        <div class="metric"><span>Winners</span><b>${DATA.stats.winners}</b><em class="muted">${DATA.stats.repeatWinners} won more than once</em></div>
      </div>
      <div class="tabs">
        <button type="button" data-tab="upcoming" class="${state.tab === "upcoming" ? "on" : ""}">Upcoming (${DATA.raffles.length})</button>
        <button type="button" data-tab="winners" class="${state.tab === "winners" ? "on" : ""}">Winners (${DATA.winners.length})</button>
        <button type="button" data-tab="board" class="${state.tab === "board" ? "on" : ""}">Leaderboard</button>
        <select data-strat style="margin-left:auto;background:#0c0c0c;border:1px solid var(--border);border-radius:999px;padding:6px 10px">
          <option value="all">Every strategy</option>
          ${options.map((r) => `<option value="${r.slug}" ${state.strategy === r.slug ? "selected" : ""}>$${esc(r.ticker)} · ${esc(strategyBySlug(r.slug).name)}</option>`).join("")}
        </select>
      </div>
      <p class="muted" style="margin-bottom:8px">odds ∝ token balance · pools and team wallets excluded · seed = sha256(blockhash + purchase id)</p>
      ${body}
    </div></div>`;
    root.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { state.tab = b.dataset.tab; paint(); }));
    root.querySelector("[data-strat]").addEventListener("change", (e) => { state.strategy = e.target.value; paint(); });
  }
  paint();
  setInterval(() => {
    for (let i = 0; i < clock.length; i++) clock[i] = Math.max(0, clock[i] - 1);
    document.querySelectorAll("[data-left]").forEach((el) => { el.textContent = fmtLeft(clock[Number(el.dataset.left)]); });
    const next = document.querySelector("[data-next]");
    if (next) next.textContent = fmtLeft(Math.min(...clock));
  }, 1000);
}

function renderStrategy() {
  const root = document.getElementById("strategy-root");
  const slug = new URLSearchParams(location.search).get("slug") || "pikastr";
  const s = strategyBySlug(slug) || DATA.strategies[0];
  const held = DATA.cards.filter((c) => c.slug === s.slug);
  const upcoming = DATA.raffles.filter((r) => r.slug === s.slug);
  const delta = s.value && s.deployed ? Math.round((s.value / s.deployed - 1) * 100) : 0;
  root.innerHTML = `<div class="page"><div class="wrap">
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div class="sprite-box" style="width:88px;height:88px">${sprite(s.dex, 72)}</div>
      <div style="flex:1;min-width:240px">
        <h1>${esc(s.name)}</h1>
        <div class="chip-row" style="margin-top:10px"><span class="chip">$${esc(s.ticker)}</span>${s.rules.map((r) => `<span class="chip">${esc(r)}</span>`).join("")}</div>
        <p class="muted" style="margin-top:10px">Solana · pump.fun · <span class="mono">${esc(s.wallet)}</span> · created ${esc(s.created)}</p>
      </div>
      <a class="btn btn-md btn-outline" href="https://pump.fun" target="_blank" rel="noreferrer">trade ↗</a>
    </div>
    <div class="metric-grid">
      <div class="metric"><span>Market cap</span><b>${compactUsd(s.mcap)}</b><em class="${s.change < 0 ? "down" : "up"}">${s.change > 0 ? "+" : ""}${s.change}%</em></div>
      <div class="metric"><span>Treasury</span><b>${usd(s.treasury)}</b></div>
      <div class="metric"><span>Cards</span><b>${s.cards}</b><em class="muted">${usd(s.deployed)} deployed</em></div>
      <div class="metric"><span>Est. value held</span><b>${usd(s.value)}</b><em class="${delta < 0 ? "down" : "up"}">${delta}% vs paid</em></div>
      <div class="metric"><span>Matches now</span><b>${s.matches}</b></div>
      <div class="metric"><span>Fees claimed</span><b>${s.feesSol.toFixed(2)} SOL</b></div>
    </div>
    <div class="tabs" data-stabs>
      <button type="button" class="on" data-stab="vault">Vault (${held.length || s.cards})</button>
      <button type="button" data-stab="next">Next targets (${s.matches})</button>
      <button type="button" data-stab="raffles">Raffles (${upcoming.length})</button>
    </div>
    <div id="stab"></div>
  </div></div>`;
  const stab = root.querySelector("#stab");
  function show(which) {
    root.querySelectorAll("[data-stab]").forEach((b) => b.classList.toggle("on", b.dataset.stab === which));
    if (which === "vault") {
      stab.innerHTML = held.length
        ? `<p class="muted" style="margin-bottom:12px">${esc(s.name)} sample holdings</p><div class="card-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${held.map((c) => cardTile(c, { bought: true })).join("")}</div>`
        : `<p class="empty">This strategy has not vaulted a card in the local sample yet.</p>`;
    } else if (which === "next") {
      stab.innerHTML = s.matches
        ? `<p class="empty">${s.matches} live listings match the rules. Open the market to scan them.</p><p style="text-align:center"><a class="btn btn-md btn-outline" href="market.html">Open the live market</a></p>`
        : `<p class="empty">No listing currently matches.</p>`;
    } else {
      stab.innerHTML = upcoming.length
        ? upcoming.map((r) => `<article class="raffle"><img src="${r.image}" alt=""><div><h3>${esc(r.title)}</h3><div class="muted" style="margin-top:4px">bought ${esc(r.ago)} for ${usd(r.paid)}</div></div><div class="count"><b>${fmtLeft(r.seconds)}</b><span class="muted">until draw</span></div></article>`).join("")
        : `<p class="empty">No draw is queued.</p>`;
    }
  }
  root.querySelectorAll("[data-stab]").forEach((b) => b.addEventListener("click", () => show(b.dataset.stab)));
  show("vault");
  document.title = `${s.name} ($${s.ticker}) · PokéStrategy`;
}

function renderDeploy() {
  const form = document.getElementById("deploy-form");
  if (!form) return;
  const review = document.getElementById("review");
  const name = form.querySelector('[name="name"]');
  const ticker = form.querySelector('[name="ticker"]');
  const pokemon = form.querySelector('[name="pokemon"]');
  const text = form.querySelector('[name="text"]');
  const desc = form.querySelector('[name="description"]');
  const count = document.getElementById("desc-count");
  const windowSel = form.querySelector('[name="window"]');
  const summary = document.getElementById("rule-summary");

  function describe() {
    const bits = [];
    if (pokemon.value.trim()) bits.push(pokemon.value.trim());
    const graders = [...form.querySelectorAll("[data-grader].on")].map((b) => b.dataset.grader);
    if (graders.length) bits.push(graders.join("/"));
    const min = form.querySelector("[data-min].on");
    if (min) bits.push(`grade ${min.dataset.min}+`);
    const lang = [...form.querySelectorAll("[data-lang].on")].map((b) => b.dataset.lang);
    if (lang.length) bits.push(lang.join("/"));
    if (form.querySelector("[data-under]").classList.contains("on")) bits.push("under fair value");
    if (text.value.trim()) bits.push(`“${text.value.trim()}”`);
    if (!bits.length) bits.push("floor");
    return bits.join(" · ");
  }
  function paint() {
    const label = name.value.trim() || "Custom Strategy";
    const tick = (ticker.value.trim() || "CARDSTR").toUpperCase();
    const win = windowSel.value;
    review.innerHTML = `<div class="muted">Token</div><div style="font-size:18px;margin:4px 0 10px"><b>${esc(label)}</b> <span class="chip">$${esc(tick)}</span></div>
      <div>Buys <b>${esc(describe())}</b>, raffled to holders after ${esc(win)} on Collector Crypt.</div>
      <p class="muted" style="margin-top:8px">Launch pump.fun on Solana · 1B supply · fair launch, no allocation.</p>
      <p class="muted">Fees per trade 0.24–0.76% to the strategy wallet.</p>
      <p style="margin-top:8px">Cost <b>0.035 SOL</b> creation rent and gas. Signed in your wallet in one step.</p>`;
    summary.textContent = bitsFallback();
    count.textContent = `${desc.value.length} / 500`;
  }
  function bitsFallback() {
    const line = describe();
    return line === "floor"
      ? "No filters: cheapest graded Pokémon cards on Collector Crypt, in price order."
      : line;
  }
  form.addEventListener("input", paint);
  form.querySelectorAll(".pick").forEach((btn) => btn.addEventListener("click", () => {
    if (btn.dataset.min) form.querySelectorAll("[data-min]").forEach((b) => b.classList.toggle("on", b === btn && !btn.classList.contains("on")));
    else btn.classList.toggle("on");
    paint();
  }));
  form.querySelector("[data-under]").addEventListener("click", () => {
    form.querySelector("[data-under]").classList.toggle("on");
    paint();
  });
  document.getElementById("sprite-pick").addEventListener("click", () => {
    const id = 1 + Math.floor(Math.random() * 151);
    document.getElementById("sprite-preview").innerHTML = sprite(id, 72);
  });
  const presets = {
    pika: () => { pokemon.value = "Pikachu"; text.value = ""; clearPicks(); },
    zard: () => { pokemon.value = "Charizard"; text.value = ""; clearPicks(); form.querySelector('[data-grader="PSA"]').classList.add("on"); form.querySelector('[data-min="10"]').classList.add("on"); form.querySelector('[name="maxPrice"]').value = "500"; },
    vintage: () => { pokemon.value = ""; clearPicks(); form.querySelector('[name="yearFrom"]').value = "1996"; form.querySelector('[name="yearTo"]').value = "2003"; form.querySelector('[data-min="8"]').classList.add("on"); },
    eevee: () => { pokemon.value = "Eevee"; clearPicks(); form.querySelector("[data-under]").classList.add("on"); },
    gengar: () => { pokemon.value = "Gengar"; clearPicks(); form.querySelector('[data-lang="Japanese"]').classList.add("on"); },
  };
  function clearPicks() {
    form.querySelectorAll(".pick.on").forEach((b) => b.classList.remove("on"));
    form.querySelector("[data-under]").classList.remove("on");
    ["yearFrom", "yearTo", "minPrice", "maxPrice"].forEach((n) => { form.querySelector(`[name="${n}"]`).value = ""; });
  }
  form.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => { presets[b.dataset.preset](); paint(); }));
  form.querySelector("#launch").addEventListener("click", () => {
    toast("This preview does not connect a wallet or launch a token.");
  });
  document.getElementById("sprite-preview").innerHTML = sprite(25, 72);
  paint();
}

function mount() {
  const page = document.body.dataset.page || "home";
  document.getElementById("header").innerHTML = header(page);
  document.getElementById("footer").innerHTML = footer();
  const headerEl = document.querySelector(".site-header");
  const onScroll = () => headerEl.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  document.querySelectorAll("[data-copy]").forEach((btn) => btn.addEventListener("click", () => copyContract(btn)));
  const menu = document.querySelector("[data-menu]");
  const panel = document.querySelector("[data-menu-panel]");
  if (menu) menu.addEventListener("click", () => panel.classList.toggle("open"));
  if (page === "home") renderHome();
  if (page === "browse") renderBrowse();
  if (page === "market") renderMarket();
  if (page === "raffles") renderRaffles();
  if (page === "strategy") renderStrategy();
  if (page === "deploy") renderDeploy();
}
mount();
