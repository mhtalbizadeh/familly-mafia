import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Info from "./pages/info/Info";
import SelectData from "./pages/game/selectData";
import Deal from "./pages/game/dealCards";
import List from "./pages/game/list";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/info", element: <Info /> },
    { path: "/selectData", element: <SelectData /> },
    { path: "/deal", element: <Deal /> },
    { path: "//list", element: <List /> },
  ],
  {
    basename: "/familly-mafia",
  },
);
