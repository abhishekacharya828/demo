import React from "react";
import FreeTest from "../../component/userPanel/freeTests/FreeTest";
import TestName from "../../component/userPanel/freeTests/TestName";

const FreeTestPage = () => {
  return (
    <div className=" space-y-2  h-screen flex flex-col overflow-hidden">
      <div className="">
        <TestName />
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full flex-1  overflow-hidden ">
        <FreeTest />
      </div>
    </div>
  );
};

export default FreeTestPage;
