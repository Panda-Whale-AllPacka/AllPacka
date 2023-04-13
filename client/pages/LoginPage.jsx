/*
This page is fully functional! Logging in will authenticate a user's existance in the database,
that database fetch will return a user document without the password and store that in global context
so the user can be accessed from other pages. If authentication is successful, you'll be redirected
to UserHomePage and that globally stored context user data will be used to render info on that page.
*/

import React, { useState, useContext } from 'react';
import { useNavigate, Form, redirect } from 'react-router-dom';
import { userContext } from '../context';
import '../scss/LoginPage.scss';
import alpaca from '../assets/alpaca_cool.jpg';
import yosemite from '../assets/yosemite.jpg';
import { useSubmit } from 'react-router-dom';

const LoginPage = (props) => {
  const { user, setUser } = props.user;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const {user,setUser} = useContext(userContext);
  const navigate = useNavigate();
  // const {user, setUser} = useUserContext('')

  ////////////////////////////////////////////
  // makes a fetch to the backend to authenticate the credentials on submit
  async function handleSubmit(e) {
    try {
      e.preventDefault();

      // Send the username and password to the server for authentication
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(response.status);
      if (response.status === 200) {
        const res = await response.json();
        console.log(res.verified);

        if (res.verified) {
          console.log('Authentication successful!');

          console.log('context', user);
          // console.log('response: ', res.user)
          setUser(res.user);
          console.log('is context updated? ', user);
          setUsername('');
          setPassword('');
          // console.log('user context: ',userContext)

          navigate(`/UserHomePage`);
        } else {
          console.log(res.verified);
          alert('Invalid username or password');
        }
        // return redirect(`/SignUpPage`); // TOD redirect
      } else {
        alert('Server fail');
      }
    } catch (error) {
      console.error(error);
    }
  }
  /////////////////////////////////////////////////

  const redirectToSignupPage = () => {
    return navigate(`/SignUpPage`);
  };

  return (
    <main className="page user-entrance-bg">
      <h1 className="all-headers black-text title">Welcome to AllPacka!</h1>
      {/* IMAGE OF AN ALPACA */}
      <img src={alpaca} alt={'alpaca'} className="alpaca-image" />
      {/* <h2 className="all-headers black-text">Log into AllPacka!</h2> */}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="username-section">
            <input
              type="text"
              placeholder="username"
              // placeholder="What's a good nickname?..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="password-section">
            <input
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </div>
          <button type="submit">Login!</button>
          <h2 className="all-headers">OR...</h2>
          <button onClick={redirectToSignupPage}>Sign-Up!</button>
        </form>

        {/* redirect to sign up page with the this button */}
      </div>
    </main>
  );
};

export default LoginPage;
