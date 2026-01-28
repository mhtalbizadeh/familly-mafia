import { useEffect, useMemo, useState } from "react";
import roles from "../../../data/roles";
import "./selectData.css";
import { useNavigate } from "react-router-dom";

type RoleId = (typeof roles)[number]["id"];

const STORAGE_KEY = "mafia:setup";

const MANDATORY_ROLE_IDS = new Set<RoleId>(["citizen", "mafia"]);

function toNumber(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function SelectData() {
  const [playerCountInput, setPlayerCountInput] = useState<string>("");
  const [cityCountInput, setCityCountInput] = useState<string>("");
  const [mafiaCountInput, setMafiaCountInput] = useState<string>("");
  const [includeIndependent, setIncludeIndependent] = useState<boolean>(false);

  const roleById = useMemo(() => {
    const m = new Map<RoleId, (typeof roles)[number]>();
    roles.forEach((r) => m.set(r.id, r));
    return m;
  }, []);

  const independentRoleIds = useMemo(
    () => roles.filter((r) => r.faction === "independent").map((r) => r.id),
    [],
  );
  const independentRoleIdSet = useMemo(
    () => new Set<RoleId>(independentRoleIds),
    [independentRoleIds],
  );

  const players = toNumber(playerCountInput) ?? 0;
  const cityCount = toNumber(cityCountInput) ?? 0;
  const mafiaCount = toNumber(mafiaCountInput) ?? 0;

  const independentCount = includeIndependent ? independentRoleIds.length : 0;

  const isPlayerCountSet = players > 0;

  // چون citizen و mafia همیشه وجود دارند، حداقل 1 شهر و 1 مافیا منطقیه
  const isTeamCountsReady =
    isPlayerCountSet &&
    toNumber(cityCountInput) !== null &&
    toNumber(mafiaCountInput) !== null &&
    cityCount >= 1 &&
    mafiaCount >= 1 &&
    cityCount + mafiaCount + independentCount === players;

  // اسلات‌های نقش‌های ویژه (به‌جز citizen/mafia)
  const citySpecialLimit = Math.max(cityCount - 1, 0);
  const mafiaSpecialLimit = Math.max(mafiaCount - 1, 0);

  const [selectedRoles, setSelectedRoles] = useState<Set<RoleId>>(
    () => new Set<RoleId>(["citizen", "mafia"]),
  );

  // همیشه citizen و mafia تیک‌خورده باشند + مستقل‌ها با سوییچ کنترل شوند
  useEffect(() => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);

      // mandatory همیشه
      next.add("citizen");
      next.add("mafia");

      // مستقل‌ها از روی checkbox
      if (includeIndependent) {
        independentRoleIds.forEach((id) => next.add(id));
      } else {
        independentRoleIds.forEach((id) => next.delete(id));
      }

      return next;
    });
  }, [includeIndependent, independentRoleIds]);

  const selectedCitySpecialCount = useMemo(() => {
    let c = 0;
    selectedRoles.forEach((id) => {
      const r = roleById.get(id);
      if (!r) return;
      if (r.faction === "city" && id !== "citizen") c++;
    });
    return c;
  }, [selectedRoles, roleById]);

  const selectedMafiaSpecialCount = useMemo(() => {
    let c = 0;
    selectedRoles.forEach((id) => {
      const r = roleById.get(id);
      if (!r) return;
      if (r.faction === "mafia" && id !== "mafia") c++;
    });
    return c;
  }, [selectedRoles, roleById]);

  // اگر کاربر تعدادها رو کم کرد، انتخاب‌های اضافی رو اتومات کم کنیم تا از سقف رد نشه
  useEffect(() => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);

      // mandatory + مستقل‌ها دوباره تضمین
      next.add("citizen");
      next.add("mafia");
      if (includeIndependent) independentRoleIds.forEach((id) => next.add(id));
      else independentRoleIds.forEach((id) => next.delete(id));

      const selectedCitySpecial = roles
        .filter((r) => r.faction === "city" && r.id !== "citizen")
        .map((r) => r.id)
        .filter((id) => next.has(id));

      const selectedMafiaSpecial = roles
        .filter((r) => r.faction === "mafia" && r.id !== "mafia")
        .map((r) => r.id)
        .filter((id) => next.has(id));

      if (selectedCitySpecial.length > citySpecialLimit) {
        const extra = selectedCitySpecial.length - citySpecialLimit;
        selectedCitySpecial.slice(-extra).forEach((id) => next.delete(id));
      }

      if (selectedMafiaSpecial.length > mafiaSpecialLimit) {
        const extra = selectedMafiaSpecial.length - mafiaSpecialLimit;
        selectedMafiaSpecial.slice(-extra).forEach((id) => next.delete(id));
      }

      return next;
    });
  }, [
    citySpecialLimit,
    mafiaSpecialLimit,
    includeIndependent,
    independentRoleIds,
  ]);

  const canSelectTotal = citySpecialLimit + mafiaSpecialLimit;
  const selectedSpecialTotal =
    selectedCitySpecialCount + selectedMafiaSpecialCount;
  const remainingSelectable = Math.max(
    canSelectTotal - selectedSpecialTotal,
    0,
  );

  const roleSelectionEnabled = isTeamCountsReady;

  function toggleRole(id: RoleId) {
    if (!roleSelectionEnabled) return;

    // citizen/mafia همیشه ثابت
    if (MANDATORY_ROLE_IDS.has(id)) return;

    // مستقل‌ها فقط با checkbox بالا کنترل می‌شن
    if (independentRoleIdSet.has(id)) return;

    const role = roleById.get(id);
    if (!role) return;

    setSelectedRoles((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
        return next;
      }

      // اضافه کردن با رعایت سقف‌ها
      if (role.faction === "city") {
        if (selectedCitySpecialCount >= citySpecialLimit) return next;
      }
      if (role.faction === "mafia") {
        if (selectedMafiaSpecialCount >= mafiaSpecialLimit) return next;
      }

      next.add(id);
      return next;
    });
  }

  function buildStoredRoles() {
    const citizenRole = roleById.get("citizen");
    const mafiaRole = roleById.get("mafia");
    if (!citizenRole || !mafiaRole) return [];

    const cloneWithEmptyPlayer = (r: (typeof roles)[number]) => ({
      ...r,
      player: "", // طبق درخواست: فعلاً خالی
    });

    // مستقل‌ها
    const independentSelected = includeIndependent
      ? roles.filter((r) => r.faction === "independent")
      : [];

    // نقش‌های انتخاب‌شده شهر (شامل citizen)
    const citySelected = roles.filter(
      (r) => r.faction === "city" && selectedRoles.has(r.id),
    );

    // نقش‌های انتخاب‌شده مافیا (شامل mafia)
    const mafiaSelected = roles.filter(
      (r) => r.faction === "mafia" && selectedRoles.has(r.id),
    );

    const cityRoster = citySelected.map(cloneWithEmptyPlayer);
    while (cityRoster.length < cityCount) {
      cityRoster.push(cloneWithEmptyPlayer(citizenRole));
    }

    const mafiaRoster = mafiaSelected.map(cloneWithEmptyPlayer);
    while (mafiaRoster.length < mafiaCount) {
      mafiaRoster.push(cloneWithEmptyPlayer(mafiaRole));
    }

    const independentRoster = independentSelected.map(cloneWithEmptyPlayer);

    // خروجی نهایی دقیقاً به تعداد بازیکن:
    // اگر 20 بازیکن و 15 نقش انتخاب شده باشد، بقیه با citizen/mafia پر می‌شوند.
    return [...cityRoster, ...mafiaRoster, ...independentRoster].slice(
      0,
      players,
    );
  }
  const navigate = useNavigate();

  function handleSubmit() {
    if (!isTeamCountsReady) return;

    const storedRoles = buildStoredRoles();

    const payload = {
      playerCount: players,
      cityCount,
      mafiaCount,
      includeIndependent,
      independentCount,
      roles: storedRoles, // این آرایه با Role interface شما هم‌خوان است (player خالی)
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    console.log("Saved to sessionStorage:", payload);
    navigate("/deal");
  }

  return (
    <main className="select-page">
      <section className="select-panel">
        <div className="input-grid">
          <label className="field">
            <span>تعداد بازیکن</span>
            <input
              type="number"
              min={3}
              max={30}
              value={playerCountInput}
              onChange={(e) => {
                const v = e.target.value;
                setPlayerCountInput(v);

                const n = toNumber(v);
                if (!n || n <= 0) {
                  setCityCountInput("");
                  setMafiaCountInput("");
                  setIncludeIndependent(false);
                }
              }}
            />
          </label>

          <label className="field">
            <div className="field-row">
              <span>شهروند</span>
            </div>
            <input
              type="number"
              min={0}
              disabled={!isPlayerCountSet}
              value={cityCountInput}
              onChange={(e) => setCityCountInput(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="field-row">
              <span>مافیا</span>
            </div>
            <input
              type="number"
              min={0}
              disabled={!isPlayerCountSet}
              value={mafiaCountInput}
              onChange={(e) => setMafiaCountInput(e.target.value)}
            />
          </label>

          <label className="field field--checkbox">
            <div>
              <span>نقش مستقل</span>
              <p className="hint">اگر نمی‌خواهی مستقل‌ها باشند خاموش کن</p>
            </div>
            <input
              type="checkbox"
              disabled={!isPlayerCountSet}
              checked={includeIndependent}
              onChange={(e) => setIncludeIndependent(e.target.checked)}
            />
          </label>
        </div>

        <div className="roles-head">
          <div>
            <h2>کدوم کاراکترها توی بازی باشن؟</h2>
          </div>
          <div className="counter">
            <span>قابل اتخاب</span>
            <strong>
              {roleSelectionEnabled ? String(remainingSelectable) : "0"}
            </strong>
          </div>
        </div>

        <div className="roles-grid">
          {roles.map((role) => {
            const isMandatory = MANDATORY_ROLE_IDS.has(role.id);
            const isIndependent = role.faction === "independent";

            const active = selectedRoles.has(role.id);

            const disabledBase = !roleSelectionEnabled;
            const disabledMandatory = isMandatory;
            const disabledIndependent = isIndependent;

            const isCitySpecial =
              role.faction === "city" && role.id !== "citizen";
            const isMafiaSpecial =
              role.faction === "mafia" && role.id !== "mafia";

            const cityFull = selectedCitySpecialCount >= citySpecialLimit;
            const mafiaFull = selectedMafiaSpecialCount >= mafiaSpecialLimit;

            const disabledBecauseFull =
              !active &&
              ((isCitySpecial && cityFull) || (isMafiaSpecial && mafiaFull));

            const disabled =
              disabledBase ||
              disabledMandatory ||
              disabledIndependent ||
              disabledBecauseFull;

            const checked = isIndependent ? includeIndependent : active;

            return (
              <label
                key={role.id}
                className={`role-card role-card--${role.faction} ${
                  checked ? "is-active" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleRole(role.id)}
                />
                <div className="role-visual">
                  <img src={role.image} alt={role.name} />
                </div>
                <div className="role-meta">
                  <div className="role-top">
                    <span className="role-name">{role.name}</span>
                    <span className="pill">{role.faction}</span>
                  </div>
                  <p className="role-desc">{role.description}</p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="footer-actions">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!isTeamCountsReady}
          >
            تایید و پخش کارت‌ها
          </button>
        </div>
      </section>
    </main>
  );
}
