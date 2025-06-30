"use client";

import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <>
    <footer className='bg-dark py-4 px-5'>
        <div className='footer-box'>
            <Image src={assets.logo_light} className='footer-logo' alt='footer logo'/>
            <p className='text-white text-center mb-0'> All rigths reserved. copyright @blogger </p>
            <ul className='ps-0 d-flex align-items-center justify-content-center mb-0'>
                <li><Link href="#"><Image alt='footer social media icons' src={assets.facebook_icon}/></Link></li>
                <li><Link href="#"><Image alt='footer social media icons' src={assets.twitter_icon}/></Link></li>
                <li><Link href="#"><Image alt='footer social media icons' src={assets.googleplus_icon}/></Link></li>
            </ul>
        </div>
    </footer>
    </>
  )
}

export default Footer