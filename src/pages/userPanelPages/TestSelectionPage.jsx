import React from 'react'
import InstructionsHeading from '../../component/userPanel/examInstructions/InstructionsHeading'
import Instructions from '../../component/userPanel/examInstructions/Instructions'
import TestSelection from '../../component/userPanel/freeTests/TestSelection'

const TestSelectionPage = () => {
  return (
    <div className='space-y-2 min-h-screen bg-[#F4F4F4]'>
        <InstructionsHeading/>
        <TestSelection/>
    </div>
  )
}

export default TestSelectionPage