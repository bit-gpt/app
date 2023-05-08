import React from 'react'
import Logo from "../../../assets/images/logo.svg";

const Header = () => {
  return (
    <header className="w-full">
      <img src={Logo} alt="logo"/>
    </header>
  )
}

export default Header