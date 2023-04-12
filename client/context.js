import { createContext, useState } from 'react';

// need to edit and change how create context is used, i beleive this is wrong

export const userContext = createContext({ user: 'null', setUser: () => { } });
export const tripContext = createContext({ currentTrip: 'null', setCurrentTrip: () => { } });