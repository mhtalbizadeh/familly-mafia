import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dealCards.css";

type RoleFaction = "city" | "mafia" | "independent";
type ActionType = string;

type StoredRole = {
  id: string;
  name: string;
  description: string;
  image: string;
  faction: RoleFaction;
  actions: ActionType[];
  player?: string; // فعلاً خالی، آخر ذخیره پر میشه
};

type StoredSetup = {
  playerCount: number;
  cityCount: number;
  mafiaCount: number;
  includeIndependent: boolean;
  independentCount: number;
  roles: StoredRole[];
};

const STORAGE_KEY = "mafia:setup";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Deal() {
  const navigate = useNavigate();

  const [setup, setSetup] = useState<StoredSetup | null>(null);
  const [deck, setDeck] = useState<StoredRole[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [names, setNames] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load + shuffle once on mount
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setSetup(null);
      setDeck([]);
      return;
    }

    try {
      const parsed: StoredSetup = JSON.parse(raw);

      // رندوم کردن ترتیب کارت‌ها (صرفاً برای نمایش)
      const shuffled = shuffle(parsed.roles).map((r) => ({
        ...r,
        player: r.player ?? "", // اگه قبلاً چیزی بوده، نگه دار
      }));

      setSetup(parsed);
      setDeck(shuffled);
      setNames(shuffled.map((r) => r.player ?? ""));
      setIndex(0);
      setRevealed(false);
    } catch {
      setSetup(null);
      setDeck([]);
    }
  }, []);

  const total = deck.length;
  const current = deck[index];

  const progressValue = useMemo(() => {
    if (!total) return 0;
    return Math.round(((index + 1) / total) * 100);
  }, [index, total]);

  const remaining = useMemo(() => {
    if (!total) return 0;
    return Math.max(total - (index + 1), 0);
  }, [index, total]);

  useEffect(() => {
    // هر بار که رفتیم بازیکن بعدی، کارت دوباره تار بشه
    setRevealed(false);

    // فوکوس input بعد از reveal
    if (revealed) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [index]);

  useEffect(() => {
    if (revealed) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [revealed]);

  const canProceed = (names[index] ?? "").trim().length > 0;

  function handleReveal() {
    setRevealed(true);
  }

  function handleNameChange(v: string) {
    setNames((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  }

  function handleNext() {
    if (!canProceed) return;

    if (index < total - 1) {
      setIndex((i) => i + 1);
      return;
    }
  }

  function handleSave() {
    if (!setup) return;
    // اگر آخرین نفر هم اسم نذاشته، ذخیره نکن
    if (!canProceed) return;

    const updatedDeck = deck.map((r, i) => ({
      ...r,
      player: (names[i] ?? "").trim(), // player پر میشه
    }));

    const updated: StoredSetup = {
      ...setup,
      roles: updatedDeck,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/test");
  }

  if (!setup || !deck.length) {
    return (
      <main className="deal-page">
        <section className="deal-panel">
          <h1 className="deal-title">اطلاعاتی پیدا نشد</h1>
          <p className="deal-subtitle">
            اول از صفحه قبل تنظیمات بازی رو انجام بده و تایید کن.
          </p>
          <button className="deal-btn deal-btn--primary" onClick={() => navigate("/")}>
            برگشت
          </button>
        </section>
      </main>
    );
  }

  const isLast = index === total - 1;

  return (
    <main className="deal-page">
      <section className="deal-panel">
        <header className="deal-header">
          <div className="deal-header-top">
            <div className="deal-player">
              بازیکن شماره <strong>{index + 1}</strong>
            </div>
            <div className="deal-remaining">
              باقی‌مانده: <strong>{remaining}</strong>
            </div>
          </div>

          <div className="deal-progress">
            <div className="deal-progress-bar" style={{ width: `${progressValue}%` }} />
          </div>

          <div className="deal-progress-meta">
            <span>{progressValue}%</span>
            <span>
              {index + 1}/{total}
            </span>
          </div>
        </header>

        <section className={`deal-card ${revealed ? "is-revealed" : ""}`}>
          <div className="deal-card-glow" aria-hidden="true" />

          <div className="deal-card-inner">
            <div className="deal-role-top">
              <span className={`deal-pill deal-pill--${current.faction}`}>
                {current.faction === "city"
                  ? "شهر"
                  : current.faction === "mafia"
                  ? "مافیا"
                  : "مستقل"}
              </span>
              <span className="deal-role-hint">
                لطفاً فقط خودِ بازیکن کارت رو ببینه 🙂
              </span>
            </div>

            <div className="deal-role-visual">
              <img src={current.image} alt={current.name} />
            </div>

            <div className="deal-role-content">
              <h2 className="deal-role-name">{current.name}</h2>
              <p className="deal-role-desc">{current.description}</p>

              <label className="deal-input">
                <span>اسم بازیکن</span>
                <input
                  ref={inputRef}
                  value={names[index] ?? ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="مثلاً: علی"
                  disabled={!revealed}
                />
              </label>
            </div>
          </div>

          {!revealed && (
            <div className="deal-mask">
              <div className="deal-mask-box">
                <div className="deal-mask-title">کارت آماده‌ست 🎴</div>
                <div className="deal-mask-text">
                  وقتی مطمئن شدی فقط خودت داری نگاه می‌کنی،
                  دکمه رو بزن.
                </div>

                <button className="deal-btn deal-btn--primary" onClick={handleReveal}>
                  مشاهده نقش
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="deal-footer">
          {!isLast ? (
            <>
              <button
                className="deal-btn deal-btn--primary"
                onClick={handleNext}
                disabled={!revealed || !canProceed}
              >
                بعدی
              </button>
              <div className="deal-footer-note">
                {(!revealed && "اول نقش رو ببین 👀") ||
                  (!canProceed && "اسم رو وارد کن ✍️") ||
                  "آماده‌ای بزن بعدی ✅"}
              </div>
            </>
          ) : (
            <>
              <button
                className="deal-btn deal-btn--primary"
                onClick={handleSave}
                disabled={!revealed || !canProceed}
              >
                ذخیره
              </button>
              <div className="deal-footer-note">
                {(!revealed && "اول نقش رو ببین 👀") ||
                  (!canProceed && "اسم رو وارد کن ✍️") ||
                  "همه چی آماده‌ست، ذخیره کن ✅"}
              </div>
            </>
          )}
        </footer>
      </section>
    </main>
  );
}
