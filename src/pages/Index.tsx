import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const ENGINES = [
  { id: "google",     name: "Google",     short: "G", url: "https://www.google.com/search?q=" },
  { id: "yandex",     name: "Яндекс",     short: "Я", url: "https://yandex.ru/search/?text=" },
  { id: "duckduckgo", name: "DuckDuckGo", short: "D", url: "https://duckduckgo.com/?q=" },
  { id: "bing",       name: "Bing",       short: "B", url: "https://www.bing.com/search?q=" },
];

const BOOKMARKS = [
  { id: 1, title: "Яндекс",    url: "https://yandex.ru",     icon: "🔶" },
  { id: 2, title: "VK",        url: "https://vk.com",         icon: "💙" },
  { id: 3, title: "YouTube",   url: "https://youtube.com",    icon: "▶️" },
  { id: 4, title: "Wikipedia", url: "https://wikipedia.org",  icon: "📖" },
  { id: 5, title: "Почта",     url: "https://mail.ru",        icon: "📧" },
  { id: 6, title: "Авито",     url: "https://avito.ru",       icon: "🛒" },
  { id: 7, title: "Habr",      url: "https://habr.com",       icon: "🟠" },
  { id: 8, title: "GitHub",    url: "https://github.com",     icon: "🐙" },
];

type Screen = "home" | "search" | "settings" | "tabs";

interface Tab {
  id: number;
  title: string;
  url: string;
}

function Hint({ btn, label }: { btn: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-[hsl(var(--ob-border))] bg-[hsl(var(--ob-surface2))] font-pixel text-[6px] text-[hsl(var(--ob-text))] leading-none flex-shrink-0">
        {btn}
      </span>
      <span className="text-[hsl(var(--ob-muted))] text-[9px]">{label}</span>
    </div>
  );
}

function SettingRow({
  label, value, onToggle, focused,
}: { label: string; value: boolean; onToggle: () => void; focused: boolean }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between px-3 py-[5px] cursor-pointer transition-colors rounded ${focused ? "bg-[hsl(var(--ob-surface2))] outline outline-2 outline-[hsl(var(--ob-accent))] -outline-offset-1" : "hover:bg-[hsl(var(--ob-surface2))]"}`}
    >
      <span className="text-[10px] text-[hsl(var(--ob-text))]">{label}</span>
      <div className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${value ? "bg-[hsl(var(--ob-accent))]" : "bg-[hsl(var(--ob-border))]"}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
    </div>
  );
}

export default function Index() {
  const [screen, setScreen]       = useState<Screen>("home");
  const [tabs, setTabs]           = useState<Tab[]>([{ id: 1, title: "Новая вкладка", url: "" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [nextId, setNextId]       = useState(2);
  const [query, setQuery]         = useState("");
  const [engineIdx, setEngineIdx] = useState(0);
  const [bookmarkFocus, setBookmarkFocus] = useState(-1);
  const [settingFocus]            = useState(-1);
  const [time, setTime]           = useState(new Date());

  const [settings, setSettings] = useState({
    blockAds:   true,
    dataSaving: true,
    javascript: true,
    images:     true,
    darkMode:   true,
    turboMode:  false,
  });

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen === "search") searchRef.current?.focus();
  }, [screen]);

  const currentTab = tabs.find(t => t.id === activeTab);
  const engine = ENGINES[engineIdx];

  const goSearch = () => {
    if (!query.trim()) return;
    const url = engine.url + encodeURIComponent(query);
    setTabs(tabs.map(t => t.id === activeTab ? { ...t, title: query.slice(0, 20), url } : t));
    setQuery("");
    setScreen("home");
  };

  const addTab = () => {
    const t: Tab = { id: nextId, title: "Новая вкладка", url: "" };
    setTabs([...tabs, t]);
    setActiveTab(nextId);
    setNextId(nextId + 1);
    setScreen("home");
  };

  const closeTab = (id: number) => {
    if (tabs.length === 1) return;
    const rest = tabs.filter(t => t.id !== id);
    setTabs(rest);
    if (activeTab === id) setActiveTab(rest[rest.length - 1].id);
  };

  const openBookmark = (bm: typeof BOOKMARKS[0]) => {
    setTabs(tabs.map(t => t.id === activeTab ? { ...t, title: bm.title, url: bm.url } : t));
  };

  const settingLabels: Record<keyof typeof settings, string> = {
    blockAds:   "Блокировать рекламу",
    dataSaving: "Экономия трафика",
    javascript: "JavaScript",
    images:     "Загрузка изображений",
    darkMode:   "Тёмная тема",
    turboMode:  "Turbo Mode",
  };

  return (
    <div className="w-[640px] h-[480px] flex flex-col bg-[hsl(var(--ob-bg))] font-plex overflow-hidden relative select-none">

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline" />

      {/* ═══ ШАПКА ════════════════════════════════════════════ */}
      <div className="flex items-center h-8 px-2 gap-2 bg-[hsl(var(--ob-surface))] border-b border-[hsl(var(--ob-border))] flex-shrink-0 z-10">

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5 h-5 rounded bg-[hsl(var(--ob-accent))] flex items-center justify-center">
            <span className="text-[10px]">🧅</span>
          </div>
          <span className="font-pixel text-[7px] text-[hsl(var(--ob-text))] leading-none tracking-tight">ONION</span>
        </div>

        <button
          onClick={() => setScreen("search")}
          className="flex-1 h-5 flex items-center gap-1.5 bg-[hsl(var(--ob-surface2))] border border-[hsl(var(--ob-border))] rounded px-2 hover:border-[hsl(var(--ob-accent))] transition-colors"
        >
          <Icon name="Lock" size={9} className="text-[hsl(var(--ob-green))] flex-shrink-0" />
          <span className="text-[10px] text-[hsl(var(--ob-muted))] truncate flex-1 text-left font-mono">
            {currentTab?.url || "onion://newtab"}
          </span>
          <span className="text-[8px] text-[hsl(var(--ob-muted))] bg-[hsl(var(--ob-border))] px-1 rounded flex-shrink-0 font-pixel">A</span>
        </button>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[hsl(var(--ob-surface2))] text-[hsl(var(--ob-muted))] transition-colors">
            <Icon name="ChevronLeft" size={11} />
          </button>
          <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[hsl(var(--ob-surface2))] text-[hsl(var(--ob-muted))] transition-colors">
            <Icon name="RotateCw" size={10} />
          </button>
        </div>

        <button
          onClick={() => setScreen(screen === "tabs" ? "home" : "tabs")}
          className={`flex items-center gap-1 px-2 h-5 rounded text-[9px] border transition-colors ${screen === "tabs" ? "border-[hsl(var(--ob-accent))] text-[hsl(var(--ob-accent))] bg-[hsl(var(--ob-surface2))]" : "border-[hsl(var(--ob-border))] text-[hsl(var(--ob-muted))] hover:border-[hsl(var(--ob-accent))]"}`}
        >
          <Icon name="Layers" size={9} />
          <span>{tabs.length}</span>
        </button>

        <button
          onClick={() => setScreen(screen === "settings" ? "home" : "settings")}
          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${screen === "settings" ? "bg-[hsl(var(--ob-accent))] text-white" : "hover:bg-[hsl(var(--ob-surface2))] text-[hsl(var(--ob-muted))]"}`}
        >
          <Icon name="Settings" size={10} />
        </button>

        <span className="font-pixel text-[7px] text-[hsl(var(--ob-muted))] flex-shrink-0 w-8 text-right">
          {time.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* ═══ КОНТЕНТ ═══════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── ПОИСК ── */}
        {screen === "search" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[hsl(var(--ob-surface))] border-b border-[hsl(var(--ob-border))]">
              <button
                onClick={() => setEngineIdx((engineIdx + 1) % ENGINES.length)}
                className="w-8 h-7 rounded border border-[hsl(var(--ob-border))] bg-[hsl(var(--ob-surface2))] text-[9px] font-bold text-[hsl(var(--ob-accent))] hover:border-[hsl(var(--ob-accent))] transition-colors flex-shrink-0"
                title="Сменить поисковик"
              >
                {engine.short}
              </button>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") goSearch(); if (e.key === "Escape") setScreen("home"); }}
                placeholder={`Поиск через ${engine.name}...`}
                className="flex-1 bg-[hsl(var(--ob-surface2))] border border-[hsl(var(--ob-border))] rounded px-2 h-7 text-[11px] text-[hsl(var(--ob-text))] placeholder:text-[hsl(var(--ob-muted))] outline-none focus:border-[hsl(var(--ob-accent))] transition-colors"
              />
              <button onClick={goSearch} className="w-8 h-7 flex items-center justify-center rounded bg-[hsl(var(--ob-accent))] text-white hover:opacity-85 transition-opacity flex-shrink-0">
                <Icon name="Search" size={12} />
              </button>
              <button onClick={() => setScreen("home")} className="w-7 h-7 flex items-center justify-center rounded border border-[hsl(var(--ob-border))] text-[hsl(var(--ob-muted))] hover:text-[hsl(var(--ob-text))] transition-colors flex-shrink-0">
                <Icon name="X" size={11} />
              </button>
            </div>

            <div className="px-3 py-2">
              <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1.5">Поисковая система</p>
              <div className="flex gap-1.5">
                {ENGINES.map((eng, i) => (
                  <button
                    key={eng.id}
                    onClick={() => setEngineIdx(i)}
                    className={`flex-1 py-1.5 rounded text-[10px] border transition-colors ${engineIdx === i
                      ? "bg-[hsl(var(--ob-accent))] text-white border-[hsl(var(--ob-accent))]"
                      : "border-[hsl(var(--ob-border))] text-[hsl(var(--ob-muted))] hover:border-[hsl(var(--ob-accent))] hover:text-[hsl(var(--ob-text))]"
                    }`}
                  >
                    {eng.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 py-1">
              <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1.5">Быстрый переход</p>
              <div className="grid grid-cols-4 gap-1.5">
                {BOOKMARKS.map(bm => (
                  <button
                    key={bm.id}
                    onClick={() => { openBookmark(bm); setScreen("home"); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-[hsl(var(--ob-border))] bg-[hsl(var(--ob-surface2))] hover:border-[hsl(var(--ob-accent))] transition-colors text-left"
                  >
                    <span className="text-sm leading-none flex-shrink-0">{bm.icon}</span>
                    <span className="text-[10px] text-[hsl(var(--ob-text))] truncate">{bm.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ВКЛАДКИ ── */}
        {screen === "tabs" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[hsl(var(--ob-border))]">
              <div className="flex items-center gap-2">
                <Icon name="Layers" size={12} className="text-[hsl(var(--ob-accent))]" />
                <span className="text-[11px] font-semibold text-[hsl(var(--ob-text))]">Вкладки</span>
                <span className="text-[9px] text-[hsl(var(--ob-muted))] bg-[hsl(var(--ob-surface2))] px-1.5 py-0.5 rounded">{tabs.length}</span>
              </div>
              <button
                onClick={addTab}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-[hsl(var(--ob-accent))] text-white hover:opacity-85 transition-opacity"
              >
                <Icon name="Plus" size={10} />
                <span>Новая</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setScreen("home"); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-all ${tab.id === activeTab
                    ? "border-[hsl(var(--ob-accent))] bg-[hsl(var(--ob-surface2))]"
                    : "border-[hsl(var(--ob-border))] bg-[hsl(var(--ob-surface2))] hover:border-[hsl(var(--ob-accent))]"
                  }`}
                >
                  <Icon name="Globe" size={12} className={tab.id === activeTab ? "text-[hsl(var(--ob-accent))]" : "text-[hsl(var(--ob-muted))]"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[hsl(var(--ob-text))] truncate font-medium">{tab.title}</p>
                    {tab.url && <p className="text-[9px] text-[hsl(var(--ob-muted))] truncate font-mono">{tab.url}</p>}
                  </div>
                  {tab.id === activeTab && <span className="font-pixel text-[6px] text-[hsl(var(--ob-accent))] flex-shrink-0">ACT</span>}
                  {tabs.length > 1 && (
                    <button
                      onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-[hsl(var(--ob-border))] text-[hsl(var(--ob-muted))] hover:text-[hsl(var(--ob-text))] transition-colors flex-shrink-0"
                    >
                      <Icon name="X" size={9} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── НАСТРОЙКИ ── */}
        {screen === "settings" && (
          <div className="flex-1 flex flex-col animate-fade-in overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[hsl(var(--ob-border))]">
              <Icon name="Settings" size={12} className="text-[hsl(var(--ob-accent))]" />
              <span className="text-[11px] font-semibold text-[hsl(var(--ob-text))]">Настройки браузера</span>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/2 border-r border-[hsl(var(--ob-border))] overflow-y-auto">
                <div className="px-2 py-1.5">
                  <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1 px-1">Приватность</p>
                  {(["blockAds", "dataSaving", "turboMode"] as const).map((key, i) => (
                    <SettingRow key={key} label={settingLabels[key]} value={settings[key]}
                      onToggle={() => setSettings({ ...settings, [key]: !settings[key] })}
                      focused={settingFocus === i} />
                  ))}
                </div>
                <div className="px-2 py-1.5 border-t border-[hsl(var(--ob-border))]">
                  <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1 px-1">Контент</p>
                  {(["javascript", "images", "darkMode"] as const).map((key, i) => (
                    <SettingRow key={key} label={settingLabels[key]} value={settings[key]}
                      onToggle={() => setSettings({ ...settings, [key]: !settings[key] })}
                      focused={settingFocus === i + 3} />
                  ))}
                </div>
              </div>

              <div className="w-1/2 overflow-y-auto flex flex-col">
                <div className="px-2 py-1.5 flex-1">
                  <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1 px-1">Поиск по умолчанию</p>
                  {ENGINES.map((eng, i) => (
                    <button
                      key={eng.id}
                      onClick={() => setEngineIdx(i)}
                      className={`w-full flex items-center gap-2 px-3 py-[5px] rounded text-[10px] transition-colors mb-0.5 ${engineIdx === i
                        ? "bg-[hsl(var(--ob-surface2))] text-[hsl(var(--ob-accent))] border border-[hsl(var(--ob-accent))]"
                        : "text-[hsl(var(--ob-muted))] hover:bg-[hsl(var(--ob-surface2))] border border-transparent"
                      }`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded bg-[hsl(var(--ob-border))] text-[9px] font-bold flex-shrink-0">{eng.short}</span>
                      <span>{eng.name}</span>
                      {engineIdx === i && <Icon name="Check" size={10} className="ml-auto" />}
                    </button>
                  ))}
                </div>

                <div className="px-3 py-2 border-t border-[hsl(var(--ob-border))]">
                  <div className="bg-[hsl(var(--ob-surface2))] rounded p-2">
                    <p className="font-pixel text-[6px] text-[hsl(var(--ob-accent))] mb-1">ONION BROWSER</p>
                    <p className="text-[9px] text-[hsl(var(--ob-muted))]">v1.0 · Miyoo Mini Plus</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ob-green))]" />
                      <span className="text-[9px] text-[hsl(var(--ob-green))]">Актуальная</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ГЛАВНЫЙ ЭКРАН ── */}
        {screen === "home" && (
          <div className="flex-1 overflow-y-auto animate-fade-in">
            {currentTab?.url ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--ob-surface2))] flex items-center justify-center border border-[hsl(var(--ob-border))]">
                  <Icon name="Globe" size={18} className="text-[hsl(var(--ob-muted))]" />
                </div>
                <div>
                  <p className="text-[12px] text-[hsl(var(--ob-text))] font-semibold mb-1">{currentTab.title}</p>
                  <p className="text-[9px] text-[hsl(var(--ob-accent))] font-mono break-all max-w-xs leading-relaxed">{currentTab.url}</p>
                  <p className="text-[9px] text-[hsl(var(--ob-muted))] mt-2 max-w-xs leading-relaxed">
                    Внешние страницы открываются через системный браузер Onion OS
                  </p>
                </div>
                <button
                  onClick={() => setTabs(tabs.map(t => t.id === activeTab ? { ...t, title: "Новая вкладка", url: "" } : t))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[hsl(var(--ob-border))] text-[10px] text-[hsl(var(--ob-muted))] hover:border-[hsl(var(--ob-accent))] hover:text-[hsl(var(--ob-text))] transition-colors"
                >
                  <Icon name="Home" size={10} />
                  На главную
                </button>
              </div>
            ) : (
              <div className="p-3 flex flex-col gap-3">

                {/* Лого + поиск */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--ob-accent))] to-[hsl(0,55%,35%)] flex items-center justify-center shadow-md shadow-[hsl(var(--ob-accent)/25%)]">
                      <span className="text-base">🧅</span>
                    </div>
                    <span className="font-pixel text-[5px] text-[hsl(var(--ob-muted))] leading-none">ONION</span>
                  </div>
                  <button
                    onClick={() => setScreen("search")}
                    className="flex-1 h-8 flex items-center gap-2 bg-[hsl(var(--ob-surface2))] border border-[hsl(var(--ob-border))] rounded px-2.5 hover:border-[hsl(var(--ob-accent))] transition-colors"
                  >
                    <Icon name="Search" size={11} className="text-[hsl(var(--ob-muted))]" />
                    <span className="text-[11px] text-[hsl(var(--ob-muted))] flex-1 text-left">Поиск в интернете…</span>
                    <span className="font-pixel text-[7px] text-[hsl(var(--ob-muted))] bg-[hsl(var(--ob-border))] px-1.5 py-0.5 rounded flex-shrink-0">A</span>
                  </button>
                </div>

                {/* Закладки 4×2 */}
                <div>
                  <p className="text-[8px] text-[hsl(var(--ob-muted))] uppercase tracking-widest mb-1.5">Закладки</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BOOKMARKS.map((bm, i) => (
                      <button
                        key={bm.id}
                        onClick={() => openBookmark(bm)}
                        onMouseEnter={() => setBookmarkFocus(i)}
                        onMouseLeave={() => setBookmarkFocus(-1)}
                        className={`flex flex-col items-center gap-1 py-2 rounded border transition-all ${bookmarkFocus === i
                          ? "border-[hsl(var(--ob-accent))] bg-[hsl(var(--ob-surface2))]"
                          : "border-[hsl(var(--ob-border))] bg-[hsl(var(--ob-surface2))] hover:border-[hsl(var(--ob-accent))]"
                        }`}
                      >
                        <span className="text-lg leading-none">{bm.icon}</span>
                        <span className="text-[9px] text-[hsl(var(--ob-muted))]">{bm.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Статус */}
                <div className="flex items-center justify-between bg-[hsl(var(--ob-surface))] rounded border border-[hsl(var(--ob-border))] px-3 py-1.5">
                  <div className="flex items-center gap-3">
                    {settings.blockAds && (
                      <div className="flex items-center gap-1">
                        <Icon name="ShieldCheck" size={10} className="text-[hsl(var(--ob-green))]" />
                        <span className="text-[9px] text-[hsl(var(--ob-muted))]">Реклама: вкл.</span>
                      </div>
                    )}
                    {settings.dataSaving && (
                      <div className="flex items-center gap-1">
                        <Icon name="Zap" size={10} className="text-[hsl(var(--ob-yellow))]" />
                        <span className="text-[9px] text-[hsl(var(--ob-muted))]">Turbo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ob-green))]" />
                    <span className="font-pixel text-[6px] text-[hsl(var(--ob-muted))]">SECURE</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* ═══ ПОДСКАЗКИ КНОПОК ══════════════════════════════════ */}
      <div className="flex items-center justify-between h-6 px-3 bg-[hsl(var(--ob-surface))] border-t border-[hsl(var(--ob-border))] flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Hint btn="A" label="Открыть" />
          <Hint btn="B" label="Назад" />
          <Hint btn="X" label="Поиск" />
          <Hint btn="Y" label="Вкладки" />
        </div>
        <div className="flex items-center gap-3">
          <Hint btn="L" label="Пред." />
          <Hint btn="R" label="След." />
          <Hint btn="☰" label="Меню" />
        </div>
      </div>

    </div>
  );
}
