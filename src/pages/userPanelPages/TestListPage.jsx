import React, { useContext } from "react";
import UserLayout from "../../layout/UserLayout";
import UserContact from "../../component/userPanel/userProfile/UserContact";
import UserProfile from "../../component/userPanel/userProfile/UserProfile";
import ExamRegistration from "../../component/userPanel/userProfile/ExamRegistration";
import { AuthContext } from "../../context/AuthContext";
import ExamRegistrationengineering from "../../component/userPanel/userProfile/ExamRegistrationengineering";
import UserProfileEngineering from "../../component/userPanel/userProfile/UserProfileEngineering";
import Test from "../../component/userPanel/exam/Test";

const TestListPage = () => {
  const { userData } = useContext(AuthContext);

  return (
    <UserLayout>
      <div className=" w-full  ">
        <UserContact />
        <Test />
      </div>
    </UserLayout>
  );
};

export default TestListPage;
