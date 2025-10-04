import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSignUpPage from "../pages/adminPanelPages/AdminSignUpPage";
import AdminLogin from "../component/adminPanel/adminCredentials/AdminLogin";
// import EngineeringForm from "../component/userPanel/registrationComponents/EngineeringForm";
import AdminManageSchool from "../pages/adminPanelPages/AdminManageSchool";

import AdminEditSchool from "../pages/adminPanelPages/AdminEditSchool";
import AdminAddSchool from "../pages/adminPanelPages/AdminAddSchool";
import Signin from "../component/userPanel/loginComponents/Signin";
import CollegeAdminPage from "../pages/adminPanelPages/CollegeAdminPage";
import AddCollegeAdmin from "../component/adminPanel/adminDashboard/AddCollegeAdmin";
import AdminAddCollegeAdmin from "../pages/adminPanelPages/AdminAddCollegeAdminPage";
import AdminEditCollegeAdminPage from "../pages/adminPanelPages/AdminEditCollegeAdminPage";

// college imports
import CollegeSignup from "../component/collegeAdminPanel/collegeAdminCredentials/CollegeSignup";
import CollegeLogin from "../component/collegeAdminPanel/collegeAdminCredentials/CollegeLogin";
import CollegeLayout from "../layout/CollegeLayout";
import StudentsPage from "../pages/collegeAdminPanelPages/StudentsPage";
import TestsPage from "../pages/collegeAdminPanelPages/TestsPage";
import TestDashboard from "../component/collegeAdminPanel/testPage/TestDashboard";
import AddAllQuestions from "../component/collegeAdminPanel/AddAllQuestions.jsx";
// import AddSingleQuestion from "../component/collegeAdminPanel/AddSingleQuestion.jsx";
import AddStudentPage from "../pages/collegeAdminPanelPages/AddStudentsPage.jsx";
import AddBulkStudents from "../component/collegeAdminPanel/studentPage/AddBulkStudents.jsx";
import EditStudents from "../component/collegeAdminPanel/studentPage/EditStudents.jsx";

// user imports
import UserProfilePage from "../pages/userPanelPages/UserProfilePage";
import EditProfile from "../component/userPanel/userProfile/EditProfile";
import AddSingleQuestion from "../component/collegeAdminPanel/AddSingleQuestion.jsx";
import CollegeAdminProtectedRoutes from "../utils/CollegeAdminProtectedRoutes.jsx";
import Test from "../component/userPanel/exam/Test.jsx";
import TestListPage from "../pages/userPanelPages/TestListPage.jsx";
import ExamInstructionPage from "../pages/userPanelPages/ExamInstructionPage.jsx";
import ExamPage from "../pages/userPanelPages/ExamPage.jsx";
import SuperAdminProtectedRoutes from "../utils/SuperAdminProtectedRoutes.jsx";
import TestSelectionPage from "../pages/userPanelPages/TestSelectionPage.jsx";
import StudentAdminProtectedRoutes from "../utils/StudentProtectedRoutes.jsx";
import StudentProtectedRoutes from "../utils/StudentProtectedRoutes.jsx";
import Settings from "../pages/userPanelPages/Settings.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/admin_signup" element={<AdminSignUpPage />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        {/* <Route path="/admin_dashboard" element={<Admin_DashboardPage />} /> */}

        {/* Admin Routes */}
        <Route element={<SuperAdminProtectedRoutes />}>
          <Route path="/admin_dashboard" element={<AdminManageSchool />} />
          <Route
            path="/admin_dashboard/add_school"
            element={<AdminAddSchool />}
          />
          <Route
            path="/admin_dashboard/edit_school/:id"
            element={<AdminEditSchool />}
          />
          <Route path="/college_admin" element={<CollegeAdminPage />} />
          <Route
            path="/college_admin/add_college_admin"
            element={<AdminAddCollegeAdmin />}
          />
        </Route>
        <Route
          path="/admin_dashboard/edit_college_admin/:id"
          element={<AdminEditCollegeAdminPage />}
        />

        {/* college routes */}
        <Route path="/college_signup" element={<CollegeSignup />} />

        <Route path="/college_login" element={<CollegeLogin />} />
        <Route element={<CollegeAdminProtectedRoutes />}>
          <Route
            path="/college/*"
            element={
              <CollegeLayout>
                <Routes>
                  <Route path="students" element={<StudentsPage />} />
                  <Route
                    path="students/add_students"
                    element={<AddStudentPage />}
                  />
                  <Route
                    path="students/add_bulk_students"
                    element={<AddBulkStudents />}
                  />
                  {/* <Route
                  path="add_single_questions"
                  element={<AddSingleQuestion />}
                /> */}
                  <Route
                    path="add_all_questions"
                    element={<AddAllQuestions />}
                  />
                  <Route
                    path="add_single_question"
                    element={<AddSingleQuestion />}
                  />
                  <Route
                    path="students/edit_student/:id"
                    element={<EditStudents />}
                  />
                  <Route path="tests" element={<TestsPage />} />
                  <Route
                    path="/tests/:testName/*"
                    element={<TestDashboard />}
                  />
                </Routes>
              </CollegeLayout>
            }
          />
        </Route>

        {/* user routes */}

        {/* <Route path="/user_signup" element={<EngineeringForm />} /> */}
        <Route path="/user_signin" element={<Signin />} />

        <Route element={<StudentProtectedRoutes />}>
          <Route path="/user_profile" element={<UserProfilePage />} />
          <Route path="/user_test" element={<TestListPage />} />
          <Route
            path="/user_test/instructions"
            element={<ExamInstructionPage />}
          />
          <Route
            path="/user_test/user_test_selection"
            element={<TestSelectionPage />}
          />
          <Route path="/user_test/start_exam" element={<ExamPage />} />
          <Route path="/user_profile/edit" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
