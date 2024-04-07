import React from 'react'
import { Logo } from '../assets'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <div className='w-full flex items-center justify-between border-top border-grey-300'>
            <div className='flex items-center justify-center gap-3 py-3'>
                <img src={Logo} className='w-8 h-auto object-contain' alt="logo" />
                <p> Expressume</p>
            </div>
            <div className='flex items-center justify-center gap-6'>
                <Link to={"/"} className='text-blue-700 text-sm'>HomeScreen</Link>
                <Link to={"/"} className='text-blue-700 text-sm'>Contact</Link>
                <Link to={"/"} className='text-blue-700 text-sm whitespace-nowrap'>Privacy Policy</Link>
            </div>
        </div>
    )
}
