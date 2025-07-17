"use client";
import Header from './Header'
import Footer from './Footer'

const LayoutClientShell = ({ children }) => {
  return (

    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default LayoutClientShell