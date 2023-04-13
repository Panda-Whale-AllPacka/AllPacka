import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../scss/rootLayoutNav.scss';

const RootLayout = () => {
  return (
    <header className="root-layout">
      {/* <h1>Root Layout</h1> */}
      <nav id="main-nav">
        <NavLink to="/UserHomePage" className="nav-link">
          {' '}
          User Home Page{' '}
        </NavLink>
        <NavLink to="/NewTripPage" className="nav-link">
          {' '}
          New Trip Page{' '}
        </NavLink>
        <NavLink to="/TripHomePage" className="nav-link">
          {' '}
          Trip Home Page{' '}
        </NavLink>
      </nav>
    </header>
  );
};

export default RootLayout;
