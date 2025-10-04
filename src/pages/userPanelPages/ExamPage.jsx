import React from "react";
import ExamSecurityWrapper from "../../utils/ExamSecurityWrapper";
import ExamComponent from "../../component/userPanel/freeTests/ExamComponent";
import TestName from "../../component/userPanel/freeTests/TestName";

const ExamPage = () => {
  return (
    <ExamSecurityWrapper>
      <div className="space-y-2 md:h-screen flex flex-col overflow-hidden">
        <div>
          <TestName />
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full flex-1 md:overflow-hidden">
          <ExamComponent />
        </div>
      </div>
    </ExamSecurityWrapper>
  );
};

export default ExamPage;
