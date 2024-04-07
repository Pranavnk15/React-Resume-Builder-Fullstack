import React, { Suspense } from 'react'
import { Route, Routes } from "react-router-dom";
import HomeScreen from '../pages/HomeScreen';
import Authentication from '../pages/Authentication';

import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

// different routs home route, auth route


export default function App() {
  
  const queryClient = new QueryClient()

  return (
    //     <Suspense> is a React component used for handling loading states while waiting for a component to load asynchronously.
    // The fallback prop specifies the content to display while the suspended component is loading. In this case, if the component wrapped by <Suspense> is not yet loaded, it will display the <div>Loading...</div> content.
    <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/*' element={<HomeScreen /> } />
        <Route path='/auth' element={<Authentication />} />
      </Routes>
    </Suspense>
    <ToastContainer position='top-right' theme='dark'/>
    <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}
