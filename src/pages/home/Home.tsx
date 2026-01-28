import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      <div className="home__panel">
        <h1 className="home__title">مافیا</h1>
        <div className="home__actions">
          <Link to={"/selectData"} className="home__button" type="button">
            شروع بازی
          </Link>
          <Link to="/info" className="home__button home__button--secondary">
            توضیحات
          </Link>
        </div>
      </div>
    </main>
  );
}
