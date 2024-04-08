import React from 'react'
import { TemplatesData } from '../utils/helper'
import {Route, Routes} from 'react-router-dom';


export default function CreateResume() {
  return (
    <div className='w-full flex flex-col items-center justify-start py-4'>
      <Routes>
        {TemplatesData.map((template) => (
          <Route 
          key={template?.id} 
          path={`/${template.name}`}
          Component={template.component}
          />
        ))}
      </Routes>
    </div>
  )
}
