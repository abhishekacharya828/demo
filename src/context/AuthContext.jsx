import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const storageToken = JSON.parse(localStorage.getItem("token"));
  const storageRefreshToken = JSON.parse(localStorage.getItem("refreshToken"));

  const storageUserData = localStorage.getItem("userData");
  const storageStudentData = localStorage.getItem("studentData");

  const [tokens, setTokens] = useState(storageToken ? storageToken : null);
  const [refreshtokens, setRefreshtokens] = useState(
    storageRefreshToken ? storageRefreshToken : null
  );
  const [userData, setUserData] = useState(
    storageUserData ? JSON.parse(storageUserData) : {}
  );
  const [studentData, setStudentData] = useState(
    storageStudentData ? JSON.parse(storageStudentData) : {}
  );

  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("questions")) || []
  );
  const [freeTestQuestions, setFreeTestQuestions] = useState(
    JSON.parse(localStorage.getItem("freequestions")) || []
  );
  const [selectedTest, setSelectedTest] = useState(
    JSON.parse(localStorage.getItem("selectedTest")) || null
  );
  const adminStorageToken = JSON.parse(localStorage.getItem("adminTokens"));
  const storageAdminData = localStorage.getItem("admin_data");

  const [adminTokens, setAdminTokens] = useState(
    adminStorageToken ? adminStorageToken : null
  );

  const [adminData, setAdminData] = useState(
    storageAdminData ? JSON.parse(storageAdminData) : {}
  );

  // free test timer autosubmit
  const [timeLeft, setTimeLeft] = useState(null);
  const [testDetails, setTestDetails] = useState(null);

  const [selectedTestId, setSelectedTestId] = useState(
    JSON.parse(localStorage.getItem("selectedTestId")) || null
  );

  // Persist in localStorage on change
  useEffect(() => {
    if (selectedTestId) {
      localStorage.setItem("selectedTestId", JSON.stringify(selectedTestId));
    } else {
      localStorage.removeItem("selectedTestId");
    }
  }, [selectedTestId]);

  const [examId, setExamId] = useState(
    JSON.parse(localStorage.getItem("examId")) || null
  );
  useEffect(() => {
    if (examId) {
      localStorage.setItem("examId", JSON.stringify(examId));
    } else {
      localStorage.removeItem("examId");
    }
  }, [examId]);
  const [examTitle, setExamTitle] = useState(
    JSON.parse(localStorage.getItem("examTitle")) || null
  );
  useEffect(() => {
    if (examTitle) {
      localStorage.setItem("examTitle", JSON.stringify(examTitle));
    } else {
      localStorage.removeItem("examTitle");
    }
  }, [examTitle]);
  const [isSuperAdminAuthenticated, setIsSuperAdminAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isSuperAdminAuthenticated")) || false
  );
  useEffect(() => {
    localStorage.setItem(
      "isSuperAdminAuthenticated",
      JSON.stringify(isSuperAdminAuthenticated)
    );
  }, [isSuperAdminAuthenticated]);
  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
        userData,
        setUserData,
        setRefreshtokens,
        refreshtokens,
        questions,
        setQuestions,
        selectedTest,
        setSelectedTest,
        setStudentData,
        studentData,
        freeTestQuestions,
        setFreeTestQuestions,
        adminTokens,
        setAdminTokens,
        adminData,
        setAdminData,
        testDetails,
        setTestDetails,
        timeLeft,
        setTimeLeft,
        selectedTestId,
        setSelectedTestId,
        examId,
        setExamId,
        examTitle,
        setExamTitle,
        isSuperAdminAuthenticated,
        setIsSuperAdminAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
