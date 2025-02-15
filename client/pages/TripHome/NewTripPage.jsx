/*
This page hasn't been tested by me personally, but the backend functionality is there to 
support the creation of a new trip given the correct information.
*/

import React, { useState } from "react";
import { redirect, Form } from "react-router-dom";
import '../../scss/NewTripPage.scss';
import RootLayout from "../../layouts/rootLayout";
import { useContext } from "react";
import { userContext } from "../../context";
//Will have access to userId
const newTripPage = () => {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [tripType, setTripType] = useState('');
    const [tripName, setTripName] = useState('');
    const { user, setUser } = useContext(userContext);

    const userId = user.user_id

    // handler function for the input fields
    const handleLocation = (e) => {
        setLocation(e.target.value);
    }
    const handleTripType = (e) => {
        setTripType(e.target.value);
    }
    const handleDate = (e) => {
        setDate(e.target.value);
    }
    const handleTripName = (e) => {
        setTripName(e.target.value);
    }

    // this functioin send a post request to the data base to grab the _id of
    // of the new trip that was created in the database and redirects the user
    // to the tripsHome page. From there you can add items and uers, etc with put/patch requests 

    // below neeeds user ID as a global variable to work
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // post request to server // need to get the userID 

        fetch(`/api/trip/create-trip/${userId}`, {
            method: "POST",
            body: JSON.stringify({location: location, tripType: tripType, date: date, tripName: tripName})
        })
        .then(res => res.json())
        .then((res) => {
            // this responses should have the _id of the new trips' database
            // id --> _id
            // reset the state of the page to force re-render
            setLocation('');
            setDate('');
            setTripType('');
            setTripName('');
            // grab the _id from the res -> also has
            
            //FixURL
            const URL = '/TripHomePage' + res.trip_id
            
        // invoke prop drilled setCurrentTrip, pass in trip object

        //     redirect to the trips home page
            return redirect(URL);
        })
        .catch((err) => {
            console.log(err);
            alert('Failed To Create Trip');
        }); 
    };

// <Form method={} action={} onSubmit={handleSubmit}> 
    return (
        // *** QUESTION: is the action leading to the correct page?
        <div>
            <RootLayout/>
        <main className='new-trip-page'>
              
            <p className='title'>       Start Planning Your Dream Trip!     </p>
            <div className='container'>
                {/* on submit right here activates the button */}
                <form onSubmit={handleSubmit}>
                    <label>
                        <span className='question'>Where are you going?</span>
                        <input className='new-trip-text' type="text" value={location} name="location" onChange={handleLocation}/>
                    </label>
                    <label>
                        <span className='question'>When are you going?</span>
                        <input className='new-trip-text' type="text" value={date} name="date" onChange={handleDate}/>
                    </label>
                    <label>
                        <span className='question'>What are you planning for?</span>
                        <input className='new-trip-text' type="text" value={tripType} name="tripType" onChange={handleTripType}/>
                    </label>
                    <label>
                        <span className='question'>What will you call this Epic Adventure?</span>
                        <input className='new-trip-text' type="text" value={tripName} name="tripName" onChange={handleTripName}/>
                    </label>
                    <button type="submit">Create Trip!</button>
                </form>
            </div>

        </main>
        </div>
    );
};

export default newTripPage;