import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
// import StudyPage from "./pages/study/StudyPage";
import DeckPage from "./pages/deck/DeckPage";
import StudyPage from "./pages/study/StudyPage";
import StatisticsPage from "./pages/stats/StatisticsPage";
import { NotificationProvider } from "./components/common/NotificationProvider";
import { ConfirmProvider } from "./components/common/ConfirmProvider";

export default function App() {
  return (
    <NotificationProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <Routes>

          {/* Layout wrap */}
          <Route path="/" element={<MainLayout />}>

            <Route index element={<DashboardPage />} />
            <Route path="review" element={<StudyPage />} />
            <Route path="decks" element={<DeckPage />} />
            <Route path="stats" element={<StatisticsPage />} />
          </Route>

          </Routes>
        </BrowserRouter>
      </ConfirmProvider>
    </NotificationProvider>
  );
}