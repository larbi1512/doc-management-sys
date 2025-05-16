import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserListPage from "./pages/Users/UserListPage";
import UserForm from "./components/UserManagement/UserForm";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import DocumentForm from "./components/DocumentManagement/DocumentForm";
import UserDetail from "./components/UserManagement/UserDetail";
import DocumentDetail from "./components/DocumentManagement/DocumentDetail";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DepartmentForm from "./components/DepartmentManagement/DepartmentForm";
import { restoreSession } from './features/auth/authThunks';
export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
              <Route path="/departments/new" element={<DepartmentForm />} />
              <Route path="/documents" element={<DocumentListPage />} />
              <Route path="/documents/new" element={<DocumentForm />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/documents/edit/:id" element={<DocumentForm />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}