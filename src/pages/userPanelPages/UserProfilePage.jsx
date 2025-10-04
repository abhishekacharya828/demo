import React, { useContext } from "react";
import UserLayout from "../../layout/UserLayout";
import UserContact from "../../component/userPanel/userProfile/UserContact";
import UserProfile from "../../component/userPanel/userProfile/UserProfile";
import ExamRegistration from "../../component/userPanel/userProfile/ExamRegistration";
import { AuthContext } from "../../context/AuthContext";
import ExamRegistrationengineering from "../../component/userPanel/userProfile/ExamRegistrationengineering";
import UserProfileEngineering from "../../component/userPanel/userProfile/UserProfileEngineering";

const UserProfilePage = () => {
  const { userData } = useContext(AuthContext);

  return (
    <UserLayout>
      <div className="md:w-[80vw] w-full overflow-y-scroll scrollbar-hidden md:h-[95vh]  ">
        <UserContact />
        <UserProfile />
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;
