import React, { useEffect, useState } from 'react'
import useUser from '../hooks/useUser'
import { AnimatePresence } from "framer-motion";
import TemplateDesignPin from '../components/TemplateDesignPin';
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';
import { NoData } from '../assets';
import { useQuery } from 'react-query';
import { getSavedResumes } from '../api';
import MainSpinner from '../components/MainSpinner';


export default function UserProfile() {

  const { data: user } = useUser();

  const [activeTab, setActiveTab] = useState("collections");

  const { data: templates, isLoading : temp_isLoading, isError: temp_isError } = useTemplates();

  const navigate = useNavigate();

  const { data: savedResumes } = useQuery(["savedResumes", () =>
    getSavedResumes(user?.uid)]
  );

  if(temp_isLoading) {
    return <MainSpinner />
  }

  // useEffect(() => {
  //   //if we dont have any user it will navigate the user to the auth route
  //   if (!user) {
  //     navigate("/auth", { replace: true });
  //   }
  // }, []);

  return (
    <div className='w-full flex flex-col items-center justify-start py-12'>
      <div className='w-full h-72 bg-blue-50'>
        <img src="https://cdn.pixabay.com/photo/2020/12/23/14/41/forest-5855196_1280.jpg"
          alt=""
          className='w-full h-full object-cover'
        />

        <div className='flex items-center justify-center flex-col gap-4 '>
          {user?.photoURL ? (
            <>
              <img src={user?.photoURL}
                alt=""
                className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
                referrerPolicy='no-referrer'
                loading='lazy'
              />

            </>
          ) : (
            <>
              <img src={"https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-499.jpg"}
                alt=""
                className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
                referrerPolicy='no-referrer'
                loading='lazy'
              />
            </>
          )}

          <p className='text-2xl text-txtDark'>{user?.displayName}</p>
        </div>

        {/* tabs */}
        <div className='flex items-center justify-center mt-12'>
          <div
            onClick={() => setActiveTab("collections")}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer`}>
            <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'collections' && "bg-white shadow-md text-blue-600"}`}>Collections</p>
          </div>

          <div
            onClick={() => setActiveTab("resumes")}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 cursor-pointer`}>
            <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'resumes' && "bg-white shadow-md text-blue-600"}`}>My Resumes</p>
          </div>
        </div>

        {/* tab content */}
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-2'>
          <AnimatePresence>
            {activeTab === 'collections' && (<>
              {user?.collections.length > 0 && user?.collections ? (
                <RenderATemplate templates={templates?.filter((temp) =>
                  user?.collections?.includes(temp?._id)
                )} />
              ) : (
                <div className='col-span-12 w-full flex flex-col items-center justify-center gap-3'>
                  <img
                    className='w-32 h-auto object-contain'
                    src={NoData}
                    alt="" />
                  <p>No Data</p>
                </div>
              )}
            </>
            )}


            {activeTab === 'resumes' && (<>
              {savedResumes?.length > 0 && savedResumes ? (
                <RenderATemplate templates={savedResumes} />
              ) : (
                <div className='col-span-12 w-full flex flex-col items-center justify-center gap-3'>
                  <img
                    className='w-32 h-auto object-contain'
                    src={NoData}
                    alt="" />
                  <p>No Data</p>
                </div>
              )}
            </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const RenderATemplate = (({ templates }) => {
  return (
    <>
      {/* {console.log(templates, templates.length)} */}
      {templates && templates.length > 0 && (
        <>
          <AnimatePresence>
            {templates && templates.map((template, index) => (
              <TemplateDesignPin key={template?._id} data={template} index={index} />
            ))}
          </AnimatePresence>
        </>
      )}
    </>
  )
})
