import { Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/auth/register/Register";
import { LoginPage } from "./pages/auth/login/Login";
import { MainLayout } from "./layout/MainLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import {IsAuth} from "./hooks/IsAuth";
import { UserArticlesPage } from "./pages/dashboard-layout/user/articles/UserArticles";
import { CreateArticlePage } from "./pages/dashboard-layout/user/articles/CreateArticles";
import { HomePage } from "./pages/main-layout/home/Home";
import { ArticlePage } from "./pages/main-layout/article/ArticlePage";
import { SearchArticlesPage } from "./pages/main-layout/article/SearchArticlesPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/search" element={<SearchArticlesPage />} />
      </Route>

      {/* Dashboard layout */}
      <Route element={<IsAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Admin Role */}
          <Route path="admin">

          </Route>
          
          {/* User role */}
          <Route path="user">
            <Route path={'articles'} element={<UserArticlesPage />} />
            <Route path={'create-article'} element={<CreateArticlePage />} />

          </Route>

        </Route>
      </Route>


    </Routes>
  );
}

export default App;
