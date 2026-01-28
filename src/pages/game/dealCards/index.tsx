import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./deal.module.css";

type RoleFaction = "city" | "mafia" | "independent";
type ActionType = string;

type StoredRole = {
  id: string;
  name: string;
  description: string;
  image: string;
  faction: RoleFaction;
  actions: ActionType[];
  player?: string;
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

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setSetup(null);
      setDeck([]);
      return;
    }

    try {
      const parsed: StoredSetup = JSON.parse(raw);

      const shuffled = shuffle(parsed.roles).map((r) => ({
        ...r,
        player: r.player ?? "",
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
    setRevealed(false);
  }, [index]);

  useEffect(() => {
    if (revealed) requestAnimationFrame(() => inputRef.current?.focus());
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
    if (index < total - 1) setIndex((i) => i + 1);
  }

  function handleSave() {
    if (!setup) return;
    if (!canProceed) return;

    const updatedDeck = deck.map((r, i) => ({
      ...r,
      player: (names[i] ?? "").trim(),
    }));

    const updated: StoredSetup = { ...setup, roles: updatedDeck };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    navigate("/list");
  }

  if (!setup || !deck.length) {
    return (
      <main className={styles.page}>
        <section className={styles.panel}>
          <h1 className={styles.title}>اطلاعاتی پیدا نشد</h1>
          <p className={styles.subtitle}>
            اول از صفحه قبل تنظیمات بازی رو انجام بده و تایید کن.
          </p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate("/")}
          >
            برگشت
          </button>
        </section>
      </main>
    );
  }

  const isLast = index === total - 1;

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.playerLine}>
              بازیکن شماره <strong>{index + 1}</strong>
            </div>
            <div className={styles.remainingLine}>
              باقی‌مانده: <strong>{remaining}</strong>
            </div>
          </div>

          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div className={styles.progressMeta}>
            <span>{progressValue}%</span>
            <span>
              {index + 1}/{total}
            </span>
          </div>
        </header>

        <section className={`${styles.card} ${revealed ? styles.revealed : ""}`}>
          <div className={styles.cardGlow} aria-hidden="true" />

          <div className={styles.cardInner}>
            <div className={styles.roleTop}>
              <span
                className={`${styles.pill} ${
                  current.faction === "city"
                    ? styles.pillCity
                    : current.faction === "mafia"
                    ? styles.pillMafia
                    : styles.pillIndependent
                }`}
              >
                {current.faction === "city"
                  ? "شهر"
                  : current.faction === "mafia"
                  ? "مافیا"
                  : "مستقل"}
              </span>
              <span className={styles.roleHint}>
                لطفاً فقط خودِ بازیکن کارت رو ببینه 🙂
              </span>
            </div>

            <div className={styles.visual}>
              <img src={current.image} alt={current.name} />
            </div>

            <div className={styles.content}>
              <h2 className={styles.roleName}>{current.name}</h2>
              <p className={styles.roleDesc}>{current.description}</p>

              <label className={styles.inputWrap}>
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
            <div className={styles.mask}>
              <div className={styles.maskBox}>
                <div className={styles.maskTitle}>کارت آماده‌ست 🎴</div>
                <div className={styles.maskText}>
                  وقتی مطمئن شدی فقط خودت داری نگاه می‌کنی، دکمه رو بزن.
                </div>

                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleReveal}
                >
                  مشاهده نقش
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          {!isLast ? (
            <>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleNext}
                disabled={!revealed || !canProceed}
              >
                بعدی
              </button>
              <div className={styles.footerNote}>
                {(!revealed && "اول نقش رو ببین 👀") ||
                  (!canProceed && "اسم رو وارد کن ✍️") ||
                  "آماده‌ای بزن بعدی ✅"}
              </div>
            </>
          ) : (
            <>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSave}
                disabled={!revealed || !canProceed}
              >
                ذخیره
              </button>
              <div className={styles.footerNote}>
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
