import React from 'react'
import Filters from '../components/Filters'
import useTemplates from '../hooks/useTemplates'
import MainSpinner from '../components/MainSpinner';
import TemplateDesignPin from '../components/TemplateDesignPin';
import { AnimatePresence} from "framer-motion";


export default function HomeContainer() {
  
  const {data: templates, isError: temp_isError, isLoading: temp_isLoading, refetch: temp_refetch} = useTemplates();

  if(temp_isLoading) {
    return <MainSpinner/>
  }
  
  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start'>
      
      {/* filter section */}
      <Filters/>

      {/* render those templates - resume pin */}
      {temp_isError ? (
        <>
          <p className='text-lg text-txtDark'>
          Something went wrong...Please try again later
          </p>
        </>
      ) : (
        <>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
            <RenderATemplate templates={templates}/>
          </div>
        </>
      )}
    </div>
  )
}

const RenderATemplate = ((templates) => {
  return (
    <>
      {templates && templates.length > 0 ? (
        <>
          <AnimatePresence>
            {templates && templates.map((template, index) => (
              <TemplateDesignPin key={template?._id} data={template} index={index} />
            ))}
          </AnimatePresence>
        </>
      ) : (
        <>
          <p>No Data found</p>
        </>
      )}
    </>
  )
})
