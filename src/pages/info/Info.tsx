import type { CSSProperties, TouchEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Role, RoleFaction } from '../../data/roles'
import rolesData from '../../data/roles'
import rotateIcon from '../../assets/rotateIcon.svg'
import './Info.css'

type Theme = { accent: string; deep: string; glow: string; dot: string }

const themes: Record<RoleFaction, Theme> = {
  mafia: { accent: '#e02633', deep: '#120609', glow: 'rgba(224, 38, 51, 0.45)', dot: '#ff2b40' },
  city: { accent: '#1f4ebf', deep: '#050915', glow: 'rgba(31, 78, 191, 0.45)', dot: '#3f6bff' },
  independent: { accent: '#9b5cff', deep: '#130a20', glow: 'rgba(155, 92, 255, 0.45)', dot: '#c4b1ff' },
}

export default function Info() {
  const slides = useMemo<Role[]>(() => rolesData, [])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    setFlipped(false)
  }, [index])

  const goTo = (next: number) => {
    const total = slides.length
    const normalized = ((next % total) + total) % total
    setIndex(normalized)
  }

  const handleSwipeStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleSwipeEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStart.current === null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    const threshold = 24
    if (Math.abs(delta) > threshold) {
      goTo(delta > 0 ? index - 1 : index + 1)
    }
    touchStart.current = null
  }

  const currentTheme = themes[slides[index]?.faction ?? 'city']

  return (
    <main className="info-page">
      <header className="info-head">
        <p className="info-label">معرفی نقش‌ها</p>
        <h1 className="info-title">شخصیت‌ها</h1>
      </header>

      <section className="info-slider" onTouchStart={handleSwipeStart} onTouchEnd={handleSwipeEnd}>
        <div className="slider-viewport">
          <div
            className="slider-track"
            style={{ width: `${slides.length * 100}vw`, transform: `translateX(-${index * 100}vw)` }}
          >
            {slides.map((role, i) => {
              const theme = themes[role.faction] ?? themes.city
              const isActive = i === index
              const isFlipped = flipped && isActive
              return (
                <article className="slide" key={role.id}>
                  <div
                    className={`flip-card ${isActive ? 'is-active' : ''}`}
                    style={
                      {
                        '--accent': theme.accent,
                        '--accent-deep': theme.deep,
                        '--glow': theme.glow,
                        '--dot': theme.dot,
                      } as CSSProperties
                    }
                  >
                    <div className={`flip-inner ${isFlipped ? 'is-flipped' : ''}`} onClick={() => isActive && setFlipped((f) => !f)}>
                      <div className="flip-face front" aria-hidden={isFlipped}>
                        <div className="front-top">
                          <span className="role-name">{role.name}</span>
                        </div>
                        <img src={role.image} alt={role.name} className="role-image" loading="lazy" />
                        <button
                          className="rotate-btn"
                          type="button"
                          aria-label="نمایش توضیحات"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFlipped(true)
                          }}
                        >
                          <img src={rotateIcon} className="rotate-icon" aria-hidden="true" alt="" />
                        </button>
                      </div>

                      <div className="flip-face back" aria-hidden={!isFlipped}>
                        <div className="back-head">
                          <span className="back-pill">توضیحات</span>
                          <span className="role-name back-name">{role.name}</span>
                        </div>
                        <p className="role-desc">{role.description}</p>
                        <button
                          className="rotate-btn back-btn"
                          type="button"
                          aria-label="بازگشت به تصویر"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFlipped(false)
                          }}
                        >
                          <img src={rotateIcon} className="rotate-icon" aria-hidden="true" alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="slider-bottom" style={{ '--dot-color': currentTheme.dot } as CSSProperties}>
          <button className="arrow-btn" type="button" onClick={() => goTo(index - 1)} aria-label="قبلی">
            ‹
          </button>
          <div className="dots" aria-label="ناوبری اسلایدر">
            {slides.map((role, i) => (
              <button
                key={role.id}
                className={`dot ${i === index ? 'is-active' : ''}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={role.name}
              />
            ))}
          </div>
          <button className="arrow-btn" type="button" onClick={() => goTo(index + 1)} aria-label="بعدی">
            ›
          </button>
        </div>
      </section>
    </main>
  )
}
