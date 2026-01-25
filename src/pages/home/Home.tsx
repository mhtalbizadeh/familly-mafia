import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <div className="home__panel">
        <h1 className="home__title">مافیا</h1>
        <div className="home__actions">
          <button className="home__button" type="button">شروع بازی</button>
          <button className="home__button home__button--secondary" type="button">تنظیمات</button>
        </div>
      </div>
    </main>
  )
}
