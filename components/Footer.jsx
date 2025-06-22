import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <>
    <footer className='bg-dark py-4 px-5'>
        <div className='footer-box'>
            <Image src={assets.logo_light} className='footer-logo'/>
            <p className='text-white text-center mb-0'> All rigths reserved. copyright @blogger </p>
            <ul className='d-flex align-items-center justify-content-center mb-0'>
                <li><Link href="#" onClick={(e)=>e.preventDefault()}><Image src={assets.facebook_icon}/></Link></li>
                <li><Link href="#" onClick={(e)=>e.preventDefault()}><Image src={assets.twitter_icon}/></Link></li>
                <li><Link href="#" onClick={(e)=>e.preventDefault()}><Image src={assets.googleplus_icon}/></Link></li>
            </ul>
        </div>
    </footer>
    </>
  )
}

export default Footer