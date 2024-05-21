import { Routes, Route, Navigate } from "react-router-dom";
import Policies from "./components/Policies/Policies";
import PolicyDetails from "./components/policyDetails/PolicyDetails";
import MyPolicies from "./components/MyPolicies/MyPolicies";
import RegisterPage from "./Pages/RegisterPage";
import ClaimForm from "./components/ClaimForm/ClaimForm";
import AppLayout from "./Pages/AppLayout";
import LoginPage from "./Pages/LoginPage";
import UserHome from "./components/UserHome/UserHome";
import UserProfile from "./components/UserProfile/UserProfile";
import UserList from "./components/UserList/UserList";
import ReviewClaims from "./components/ReviewClaims/ReviewClaims";
import DocumentList from "./components/DocumentList/DocumentList";
import AdminAnalytics from './components/AdminAnalytics/AdminAnalytics';
import ManagePolicies from './components/adminPolicies/ManagePolicies';
import AddPolicy from './components/adminPolicies/AddPolicy';
import ContactUs from './components/ContactUs/ContactUs';
import AboutUs from './components/AboutUs/AboutUs';
import ChatBot from "./components/ChatBot/ChatBot";
import getCurrentUserId from "./utils/getCurrentUserId";
import { useUserInfo } from "./utils/useUserInfo";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const currentUserId = getCurrentUserId();
  const currentUserRole = useUserInfo(currentUserId).information.roleName;
  console.log(currentUserRole);



  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/404" element={<NotFound />} />

        <Route path="/" element={<AppLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="policies" element={<Policies />} />
          <Route path="policy" element={<PolicyDetails />} />
          <Route path="my-policies" element={<MyPolicies />} />
          <Route path="claim" element={<ClaimForm />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="surebot" element={<ChatBot />} />

          {currentUserRole === 'Insurer' ? (
            <>
              <Route path="admin-home" element={<AdminAnalytics />} />
              <Route path="manage-users" element={<UserList />} />
              <Route path="manage-claims" element={<ReviewClaims />} />
              <Route path="manage-documents" element={<DocumentList />} />
              <Route path="manage-policies" element={<ManagePolicies />} />
              <Route path="manage-policies/add-policy" element={<AddPolicy />} />
            </>
          ) : (
            <>
              <Route path="admin-home" element={<Navigate to="/404" />} />
              <Route path="manage-users" element={<Navigate to="/404" />} />
              <Route path="manage-claims" element={<Navigate to="/404" />} />
              <Route path="manage-documents" element={<Navigate to="/404" />} />
              <Route path="manage-policies" element={<Navigate to="/404" />} />
              <Route path="manage-policies/add-policy" element={<Navigate to="/404" />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
