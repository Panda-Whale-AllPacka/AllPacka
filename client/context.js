import { createContext, useState } from 'react';

// need to edit and change how create context is used, i beleive this is wrong

// export const userContext = createContext({ user: 'null', setUser: () => {user} });

export const userContext = createContext();
const setUser = (input) => {
    userInformation.user = input;
    console.log('user: ', userInformation)
}
export const userInformation = {
    user: '',
    setUser
}
export const tripContext = createContext({ currentTrip: 'null', setCurrentTrip: () => { } });
