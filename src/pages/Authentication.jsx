import React, { useEffect } from 'react'
import { Logo } from "../assets";
import Footer from '../containers/Footer';
import AuthButtonWithProvider from '../components/AuthButtonWithProvider';

import { FaGoogle, FaGithub } from 'react-icons/fa6';
import useUser from '../hooks/useUser';
import {useNavigate} from "react-router-dom"
import MainSpinner from '../components/MainSpinner';

// import {toast} from "react-toastify";

export default function Authentication() {

    const {data, isLoading, isError} = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && data) {
            navigate("/", {replace: true});
        }
    }, [isLoading, data]);

    if(isLoading) {
        return <MainSpinner/>
    }

    return (
        <div className='w-full h-screen overflow-hidden flex flex-col items-start justify-start px-6 py-4 gap-6'>
            {/* //top section */}
            <img src={Logo} className='w-12 h-auto object-contain' alt='logo' />

            {/* main section 
            flex-1 takes complete availabel length in it
         */}

            <div className='w-full flex flex-1 flex-col items-center justify-center gap-6 '>
                <h1 className='text-3xl lg:text-4xl text-blue-700'>CareerCanvas</h1>
                <p className=' text-base text-gray-600 '>painting your professional masterpiece</p>
                <h2 className='text-2xl text-gray-600'>Authenticate</h2>
                <div className='w-full lg:w-96 rounded-md  p-2 flex flex-col items-center justify-start gap-6'>
                    {/* here we are sending the Icon component as a reference instead of as a component  */}
                    <AuthButtonWithProvider
                        Icon={FaGoogle}
                        label="Signin with Google" provider={"GoogleAuthProvider"}
                    />
                    <AuthButtonWithProvider
                        Icon={FaGithub}
                        label="Signin with GitHub" provider={"GithubAuthProvider"}
                    />
                </div>
            </div>


            {/* Footer section */}
            <Footer />
        </div>
    )
}
