import React from 'react'
import InstructionsHeading from '../../component/userPanel/examInstructions/InstructionsHeading'
import Instructions from '../../component/userPanel/examInstructions/Instructions'

const ExamInstructionPage = () => {
  return (
    <div className='space-y-2 min-h-screen bg-[#F4F4F4]'>
        <InstructionsHeading/>
        <Instructions/>
    </div>
  )
}

export default ExamInstructionPage