import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const SEARCH_ENGINES = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=", icon: "🔍" },
  { id: "yandex", name: "Яндекс", url: "https://yandex.ru/search/?text=", icon: "🔎" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", icon: "🦆" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=", icon: "🅱" },
];

const QUICK_LINKS = [
  { title: "Яндекс", url: "https://yandex.ru", icon: "🔶" },
  { title: "VK", url: "https://vk.com", icon: "💙" },
  { title: "YouTube", url: "https://youtube.com", icon: "▶️" },
  { title: "Wikipedia", url: "https://wikipedia.org", icon: "📖" },
  { title: "Почта", url: "https://mail.ru", icon: "📧" },
  { title: "Авито", url: "https://avito.ru", icon: "🛒" },
];

interface Tab {
  id: number;
  title: string;
  url: string;
  favicon: string;
}

const initialTabs: Tab[] = [
  { id: 1, title: "Новая вкладка", url: "", favicon: "🏠" },
];

function SettingToggle({
  label, desc, icon, value, onChange
}: {
  label: string;
  desc: string;
  icon: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon name={icon as "ShieldCheck"} size={13} className={value ? "text-[hsl(var(--browser-accent))]" : "text-[hsl(var(--browser-text-muted))]"} />
        <div className="min-w-0">
          <p className="text-[12px] text-[hsl(var(--browser-text))] font-medium leading-tight">{label}</p>
          <p className="text-[10px] text-[hsl(var(--browser-text-muted))] truncate">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ml-2 ${value ? "bg-[hsl(var(--browser-accent))]" : "bg-[hsl(var(--border))]"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function Index() {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTab, setActiveTab] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState(SEARCH_ENGINES[0]);
  const [showEngineMenu, setShowEngineMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [addressBarValue, setAddressBarValue] = useState("");
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  const [settings, setSettings] = useState({
    blockAds: true,
    dataSaving: true,
    javascriptEnabled: true,
    imageLoading: true,
    fontSize: "medium",
    homepage: "yandex.ru",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const currentTab = tabs.find((t) => t.id === activeTab);

  const addTab = () => {
    const newTab: Tab = { id: nextId, title: "Новая вкладка", url: "", favicon: "🏠" };
    setTabs([...tabs, newTab]);
    setActiveTab(nextId);
    setNextId(nextId + 1);
    setAddressBarValue("");
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTab === id) {
      setActiveTab(remaining[remaining.length - 1].id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = selectedEngine.url + encodeURIComponent(searchQuery);
    updateCurrentTab(url, searchQuery);
    setAddressBarValue(url);
  };

  const handleAddressBar = (e: React.FormEvent) => {
    e.preventDefault();
    let url = addressBarValue.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      if (url.includes(".") && !url.includes(" ")) {
        url = "https://" + url;
      } else {
        url = selectedEngine.url + encodeURIComponent(url);
      }
    }
    updateCurrentTab(url, url);
    setAddressBarValue(url);
    setIsAddressEditing(false);
  };

  const updateCurrentTab = (url: string, title: string) => {
    setTabs(tabs.map((t) =>
      t.id === activeTab
        ? { ...t, url, title: title.length > 25 ? title.slice(0, 25) + "…" : title, favicon: "🌐" }
        : t
    ));
  };

  const handleQuickLink = (url: string, title: string) => {
    updateCurrentTab(url, title);
    setAddressBarValue(url);
    setSearchQuery("");
  };

  const isNewTab = !currentTab?.url;

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--background))] font-plex select-none overflow-hidden">

      {/* Хромовая полоса сверху */}
      <div className="h-[3px] bg-gradient-to-r from-[hsl(var(--browser-accent))] via-[hsl(0,65%,62%)] to-[hsl(var(--browser-accent))]" />

      {/* Панель вкладок */}
      <div className="flex items-end bg-[hsl(var(--browser-toolbar))] border-b border-[hsl(var(--browser-tab-border))] px-2 pt-2 gap-[2px] min-h-[38px]">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setAddressBarValue(tab.url || ""); }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-t cursor-pointer
              max-w-[160px] min-w-[80px] text-xs transition-all duration-150 relative group
              ${tab.id === activeTab
                ? "bg-[hsl(var(--browser-tab-active))] text-[hsl(var(--browser-text))] tab-indicator border border-b-0 border-[hsl(var(--browser-tab-border))]"
                : "bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:bg-[hsl(var(--browser-tab-active))] hover:text-[hsl(var(--browser-text))] border border-transparent"
              }
            `}
          >
            <span className="text-[11px] leading-none">{tab.favicon}</span>
            <span className="truncate flex-1 text-[12px]">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded hover:bg-[hsl(var(--border))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-opacity flex-shrink-0"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addTab}
          className="flex items-center justify-center w-7 h-7 mb-0.5 rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors text-lg leading-none"
          title="Новая вкладка"
        >
          +
        </button>

        <div className="flex-1" />

        <button
          onClick={() => { setShowSettings(!showSettings); setShowEngineMenu(false); }}
          className={`flex items-center justify-center w-7 h-7 mb-0.5 rounded transition-colors ${showSettings ? "bg-[hsl(var(--browser-accent))] text-white" : "hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))]"}`}
          title="Настройки"
        >
          <Icon name="Settings" size={14} />
        </button>
      </div>

      {/* Адресная строка + навигация */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[hsl(var(--browser-toolbar))] border-b border-[hsl(var(--browser-tab-border))]">
        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors">
            <Icon name="ChevronLeft" size={15} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors">
            <Icon name="ChevronRight" size={15} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors">
            <Icon name="RotateCw" size={13} />
          </button>
        </div>

        <form onSubmit={handleAddressBar} className="flex-1">
          <div className="flex items-center bg-[hsl(var(--browser-input))] border border-[hsl(var(--browser-tab-border))] rounded px-2 h-7 gap-1.5 focus-within:border-[hsl(var(--browser-accent))] transition-colors">
            <Icon name="Lock" size={11} className="text-[hsl(var(--browser-text-muted))] flex-shrink-0" />
            <input
              ref={addressRef}
              type="text"
              value={isAddressEditing ? addressBarValue : (currentTab?.url || "onion://newtab")}
              onChange={(e) => setAddressBarValue(e.target.value)}
              onFocus={() => { setIsAddressEditing(true); setAddressBarValue(currentTab?.url || ""); }}
              onBlur={() => setIsAddressEditing(false)}
              className="flex-1 bg-transparent outline-none text-[12px] text-[hsl(var(--browser-text))] font-mono placeholder:text-[hsl(var(--browser-text-muted))]"
              placeholder="Введите адрес или запрос..."
            />
            {addressBarValue && (
              <button type="submit" className="text-[hsl(var(--browser-accent))] hover:opacity-70 transition-opacity">
                <Icon name="ArrowRight" size={13} />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors" title="Закладки">
            <Icon name="Bookmark" size={13} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors" title="Загрузки">
            <Icon name="Download" size={13} />
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 overflow-auto bg-[hsl(var(--browser-content))]">

          {isNewTab ? (
            <div className="flex flex-col items-center px-6 pt-10 pb-6 gap-6 animate-fade-in">

              {/* Логотип */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--browser-accent))] to-[hsl(0,55%,38%)] flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🧅</span>
                </div>
                <div>
                  <h1 className="text-[hsl(var(--browser-text))] text-xl font-semibold tracking-tight text-center">Onion Browser</h1>
                  <p className="text-[hsl(var(--browser-text-muted))] text-[11px] text-center">Быстрый · Лёгкий · Надёжный</p>
                </div>
              </div>

              {/* Поиск */}
              <form onSubmit={handleSearch} className="w-full max-w-lg">
                <div className="flex items-center bg-[hsl(var(--browser-input))] border border-[hsl(var(--browser-tab-border))] rounded-full h-10 px-4 gap-2 focus-within:border-[hsl(var(--browser-accent))] transition-all shadow-sm">

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEngineMenu(!showEngineMenu)}
                      className="flex items-center gap-1 text-[12px] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))] transition-colors pr-1 border-r border-[hsl(var(--border))]"
                    >
                      <span>{selectedEngine.icon}</span>
                      <span>{selectedEngine.name}</span>
                      <Icon name="ChevronDown" size={10} />
                    </button>

                    {showEngineMenu && (
                      <div className="absolute top-8 left-0 z-50 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded shadow-xl py-1 min-w-[140px] animate-fade-in">
                        {SEARCH_ENGINES.map((engine) => (
                          <button
                            key={engine.id}
                            type="button"
                            onClick={() => { setSelectedEngine(engine); setShowEngineMenu(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[hsl(var(--browser-tab-bg))] transition-colors ${selectedEngine.id === engine.id ? "text-[hsl(var(--browser-accent))]" : "text-[hsl(var(--browser-text))]"}`}
                          >
                            <span>{engine.icon}</span>
                            <span>{engine.name}</span>
                            {selectedEngine.id === engine.id && <Icon name="Check" size={11} className="ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск в интернете..."
                    className="flex-1 bg-transparent outline-none text-[13px] text-[hsl(var(--browser-text))] placeholder:text-[hsl(var(--browser-text-muted))]"
                    autoFocus
                  />

                  <button type="submit" className="w-7 h-7 flex items-center justify-center rounded-full bg-[hsl(var(--browser-accent))] text-white hover:opacity-85 transition-opacity flex-shrink-0">
                    <Icon name="Search" size={13} />
                  </button>
                </div>
              </form>

              {/* Быстрые ссылки */}
              <div className="w-full max-w-lg">
                <p className="text-[hsl(var(--browser-text-muted))] text-[11px] uppercase tracking-wider mb-2 font-medium">Быстрый доступ</p>
                <div className="grid grid-cols-6 gap-2">
                  {QUICK_LINKS.map((link) => (
                    <button
                      key={link.url}
                      onClick={() => handleQuickLink(link.url, link.title)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded bg-[hsl(var(--browser-tab-bg))] hover:bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] transition-all group"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="text-[10px] text-[hsl(var(--browser-text-muted))] group-hover:text-[hsl(var(--browser-text))] transition-colors">{link.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Статус-бар */}
              <div className="w-full max-w-lg border-t border-[hsl(var(--border))] pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.blockAds && (
                    <div className="flex items-center gap-1 text-[11px] text-[hsl(var(--browser-text-muted))]">
                      <Icon name="ShieldCheck" size={12} className="text-green-500" />
                      <span>Реклама блокируется</span>
                    </div>
                  )}
                  {settings.dataSaving && (
                    <div className="flex items-center gap-1 text-[11px] text-[hsl(var(--browser-text-muted))]">
                      <Icon name="Zap" size={12} className="text-yellow-500" />
                      <span>Экономия трафика</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[hsl(var(--browser-text-muted))]">
                  {tabs.length} {tabs.length === 1 ? "вкладка" : tabs.length < 5 ? "вкладки" : "вкладок"}
                </div>
              </div>
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--browser-tab-bg))] flex items-center justify-center">
                <Icon name="Globe" size={22} className="text-[hsl(var(--browser-text-muted))]" />
              </div>
              <div>
                <p className="text-[hsl(var(--browser-text))] text-sm font-medium mb-1">Внешние сайты</p>
                <p className="text-[hsl(var(--browser-text-muted))] text-[12px] max-w-xs leading-relaxed">
                  В этой среде браузер работает как интерфейс. Для открытия внешних страниц используйте системный браузер.
                </p>
                <p className="text-[hsl(var(--browser-accent))] text-[11px] mt-2 font-mono break-all">{currentTab?.url}</p>
              </div>
              <button
                onClick={() => { updateCurrentTab("", "Новая вкладка"); setAddressBarValue(""); }}
                className="px-4 py-1.5 text-[12px] rounded bg-[hsl(var(--browser-tab-bg))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--browser-text))] border border-[hsl(var(--border))] transition-colors"
              >
                ← На главную
              </button>
            </div>
          )}
        </div>

        {/* Панель настроек */}
        {showSettings && (
          <div className="w-72 bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <Icon name="Settings" size={14} className="text-[hsl(var(--browser-accent))]" />
                <span className="text-[13px] font-semibold text-[hsl(var(--browser-text))]">Настройки</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[hsl(var(--browser-tab-bg))] text-[hsl(var(--browser-text-muted))] transition-colors text-base"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">

              <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="text-[10px] text-[hsl(var(--browser-text-muted))] uppercase tracking-wider mb-2 font-semibold">Приватность</p>
                <SettingToggle
                  label="Блокировать рекламу"
                  desc="Убирает баннеры и трекеры"
                  icon="ShieldCheck"
                  value={settings.blockAds}
                  onChange={(v) => setSettings({ ...settings, blockAds: v })}
                />
                <SettingToggle
                  label="Экономия трафика"
                  desc="Сжимает изображения"
                  icon="Zap"
                  value={settings.dataSaving}
                  onChange={(v) => setSettings({ ...settings, dataSaving: v })}
                />
              </div>

              <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="text-[10px] text-[hsl(var(--browser-text-muted))] uppercase tracking-wider mb-2 font-semibold">Контент</p>
                <SettingToggle
                  label="JavaScript"
                  desc="Включает скрипты на сайтах"
                  icon="Code"
                  value={settings.javascriptEnabled}
                  onChange={(v) => setSettings({ ...settings, javascriptEnabled: v })}
                />
                <SettingToggle
                  label="Загрузка изображений"
                  desc="Отключить для быстрой загрузки"
                  icon="Image"
                  value={settings.imageLoading}
                  onChange={(v) => setSettings({ ...settings, imageLoading: v })}
                />
              </div>

              <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="text-[10px] text-[hsl(var(--browser-text-muted))] uppercase tracking-wider mb-2 font-semibold">Интерфейс</p>

                <div className="mb-3">
                  <label className="text-[12px] text-[hsl(var(--browser-text))] font-medium block mb-1.5">Размер текста</label>
                  <div className="flex gap-1">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings({ ...settings, fontSize: size })}
                        className={`flex-1 py-1 text-[11px] rounded border transition-colors ${settings.fontSize === size
                          ? "bg-[hsl(var(--browser-accent))] text-white border-[hsl(var(--browser-accent))]"
                          : "border-[hsl(var(--border))] text-[hsl(var(--browser-text-muted))] hover:text-[hsl(var(--browser-text))]"
                          }`}
                      >
                        {size === "small" ? "Мал." : size === "medium" ? "Ср." : "Бол."}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-[hsl(var(--browser-text))] font-medium block mb-1.5">Поиск по умолчанию</label>
                  <div className="flex flex-col gap-1">
                    {SEARCH_ENGINES.map((engine) => (
                      <button
                        key={engine.id}
                        onClick={() => setSelectedEngine(engine)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded border text-[12px] transition-colors ${selectedEngine.id === engine.id
                          ? "bg-[hsl(var(--secondary))] border-[hsl(var(--browser-accent))] text-[hsl(var(--browser-accent))]"
                          : "border-transparent text-[hsl(var(--browser-text-muted))] hover:bg-[hsl(var(--browser-tab-bg))]"
                          }`}
                      >
                        <span>{engine.icon}</span>
                        <span>{engine.name}</span>
                        {selectedEngine.id === engine.id && <Icon name="Check" size={11} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="text-[10px] text-[hsl(var(--browser-text-muted))] uppercase tracking-wider mb-2 font-semibold">Домашняя страница</p>
                <div className="flex items-center bg-[hsl(var(--browser-input))] border border-[hsl(var(--border))] rounded px-2.5 h-7 gap-1.5 focus-within:border-[hsl(var(--browser-accent))] transition-colors">
                  <Icon name="Home" size={11} className="text-[hsl(var(--browser-text-muted))]" />
                  <input
                    type="text"
                    value={settings.homepage}
                    onChange={(e) => setSettings({ ...settings, homepage: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-[12px] text-[hsl(var(--browser-text))]"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] flex items-center justify-between">
              <span className="text-[10px] text-[hsl(var(--browser-text-muted))]">Onion Browser v1.0</span>
              <div className="flex items-center gap-1 text-[10px] text-green-500">
                <Icon name="CircleCheck" size={10} />
                <span>Актуальная</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Статусная строка */}
      <div className="flex items-center justify-between px-3 py-1 bg-[hsl(var(--browser-toolbar))] border-t border-[hsl(var(--border))] text-[10px] text-[hsl(var(--browser-text-muted))]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Защищено</span>
          </div>
          {settings.blockAds && <span>🛡 Реклама: вкл.</span>}
          {settings.dataSaving && <span>⚡ Трафик: сжатие</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>🧅 Onion OS</span>
          <span>{new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

    </div>
  );
}
