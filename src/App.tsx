import { Route, Routes } from "react-router-dom";
import { Register } from "./pages/auth/register/Register";
import { Login } from "./pages/auth/login/Login";
import { MainLayout } from "./layout/MainLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import {IsAuth} from "./hooks/IsAuth";
import { UserArticles } from "./pages/dashboard-layout/user/articles/UserArticles";
import { CreateArticle } from "./pages/dashboard-layout/user/articles/CreateArticles";
import { Home } from "./pages/main-layout/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Dashboard layout */}
      <Route element={<IsAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Admin Role */}
          <Route path="admin">

          </Route>
          
          {/* User role */}
          <Route path="user">
            <Route path={'articles'} element={<UserArticles />} />
            <Route path={'create-article'} element={<CreateArticle />} />

          </Route>

        </Route>
      </Route>


    </Routes>
  );
}

export default App;
