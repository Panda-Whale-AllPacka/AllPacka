import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import '../scss/rootLayoutNav.scss';

const RootLayout = () => {

  return (
    <div className="root-layout">
      <header>
        {/* <h1>Root Layout</h1> */}
        <nav id='main-nav'>

          <NavLink to='/UserHomePage'className='nav-link'> User Home Page </NavLink>
          <NavLink to='/NewTripPage'className='nav-link'> New TripPage </NavLink>
          <NavLink to='/TripHomePage'className='nav-link'> Trip Home Page </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )

};

export default RootLayout;