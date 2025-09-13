import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/static/css/framework.css";
import "./assets/static/css/global.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RecoilRoot>
      <ToastContainer />
      <App />
    </RecoilRoot>
  </BrowserRouter>
);
