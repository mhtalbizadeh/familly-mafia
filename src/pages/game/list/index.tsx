import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./list.module.css";
import nightAudio from "../../../assets/music/Night.mp3";

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
const NIGHT_AUDIO_SRC = nightAudio;

type Phase = "day" | "night";

function factionLabel(f: RoleFaction) {
  if (f === "city") return "شهر";
  if (f === "mafia") return "مافیا";
  return "مستقل";
}

export default function List() {
  const navigate = useNavigate();
  const [data, setData] = useState<StoredSetup | null>(null);
  const [phase, setPhase] = useState<Phase>("day");
  const nightAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasNightAudio = NIGHT_AUDIO_SRC.trim().length > 0;

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setData(null);
      return;
    }
    try {
      const parsed: StoredSetup = JSON.parse(raw);
      setData(parsed);
    } catch {
      setData(null);
    }
  }, []);

  const roles = data?.roles ?? [];

  const counts = useMemo(() => {
    let city = 0;
    let mafia = 0;
    let independent = 0;

    for (const r of roles) {
      if (r.faction === "city") city++;
      else if (r.faction === "mafia") mafia++;
      else independent++;
    }

    return { city, mafia, independent };
  }, [roles]);

  useEffect(() => {
    if (!hasNightAudio) return;
    const audio = nightAudioRef.current;
    if (!audio) return;
    if (phase === "night") {
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [phase, hasNightAudio]);

  if (!data || !roles.length) {
    return (
      <main className={styles.page}>
        <section className={styles.panel}>
          <h1 className={styles.title}>لیست آماده نیست</h1>
          <p className={styles.subtitle}>
            هنوز اطلاعاتی در Session Storage نیست. اول کارت‌ها رو پخش کن.
          </p>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate("/")}
          >
            برگشت به تنظیمات
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page} data-phase={phase}>
      {hasNightAudio && (
        <audio ref={nightAudioRef} src={NIGHT_AUDIO_SRC} preload="auto" />
      )}
      <section className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>لیست بازیکن‌ها</h1>
            <div className={styles.totalChip}>
              <span>کل</span>
              <strong>{roles.length}</strong>
            </div>
          </div>

          <div className={styles.phaseRow}>
            <span className={styles.phaseLabel}>حالت بازی</span>
            <div className={styles.phaseToggle} role="group" aria-label="انتخاب حالت روز یا شب">
              <button
                type="button"
                className={`${styles.phaseBtn} ${styles.phaseBtnDay} ${phase === "day" ? styles.phaseBtnActive : ""}`}
                onClick={() => setPhase("day")}
                aria-pressed={phase === "day"}
              >
                روز
              </button>
              <button
                type="button"
                className={`${styles.phaseBtn} ${styles.phaseBtnNight} ${phase === "night" ? styles.phaseBtnActive : ""}`}
                onClick={() => setPhase("night")}
                aria-pressed={phase === "night"}
              >
                شب
              </button>
            </div>
          </div>

          <div className={styles.chipsRow}>
            <div className={`${styles.chip} ${styles.chipCity}`}>
              <span>شهر</span>
              <strong>{counts.city}</strong>
            </div>
            <div className={`${styles.chip} ${styles.chipMafia}`}>
              <span>مافیا</span>
              <strong>{counts.mafia}</strong>
            </div>
            {data.includeIndependent && (
              <div className={`${styles.chip} ${styles.chipIndependent}`}>
                <span>مستقل</span>
                <strong>{counts.independent}</strong>
              </div>
            )}
          </div>

          <div className={styles.note}>
            نکته: این لیست فقط برای راوی/ادمین نمایش داده می‌شود.
          </div>
        </header>

        <section className={styles.grid}>
          {roles.map((r, i) => {
            const playerName = (r.player ?? "").trim() || `بازیکن ${i + 1}`;

            return (
              <article
                key={`${r.id}-${i}`}
                className={`${styles.card} ${
                  r.faction === "city"
                    ? styles.cardCity
                    : r.faction === "mafia"
                    ? styles.cardMafia
                    : styles.cardIndependent
                }`}
              >
                <div className={styles.cardGlow} aria-hidden="true" />

                <div className={styles.cardInner}>
                  <div className={styles.cardTop}>
                    <div className={styles.playerBlock}>
                      <div className={styles.playerIndex}>#{i + 1}</div>
                      <div className={styles.playerName}>{playerName}</div>
                    </div>

                    <span
                      className={`${styles.pill} ${
                        r.faction === "city"
                          ? styles.pillCity
                          : r.faction === "mafia"
                          ? styles.pillMafia
                          : styles.pillIndependent
                      }`}
                    >
                      {factionLabel(r.faction)}
                    </span>
                  </div>

                  <div className={styles.roleRow}>
                    <div className={styles.roleVisual}>
                      <img src={r.image} alt={r.name} />
                    </div>

                    <div className={styles.roleMeta}>
                      <div className={styles.roleName}>{r.name}</div>
                      <div className={styles.roleDesc}>{r.description}</div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className={styles.footer}>
          {/* <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => navigate("/deal")}
          >
            برگشت به پخش کارت‌ها
          </button>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate("/test")}
          >
            ادامه
          </button> */}
        </footer>
      </section>
    </main>
  );
}
