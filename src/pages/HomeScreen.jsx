import React, { Suspense } from 'react'
import Header from '../components/Header'
import MainSpinner from "../components/MainSpinner";
import HomeContainer from '../containers/HomeContainer';
import { Route, Routes } from 'react-router-dom';
import CreateTemplates from './CreateTemplates';
import UserProfile from './UserProfile';
import CreateResume from './CreateResume';
import TemplateDesignPinDetails from './TemplateDesignPinDetails';

export default function HomeScreen() {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      {/* header section  */}
      <Header />
      <main className='w-full'>
        {/* custom routes */}
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplates />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
            <Route path="/resume/*" element={<CreateResume />} />
            <Route path="/resumeDetail/:templateID" element={<TemplateDesignPinDetails />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
