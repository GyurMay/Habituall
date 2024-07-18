import React, { createContext, useContext, useEffect, useState } from 'react';
import { backendAPI } from '../clientDotEnv';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';


const host = backendAPI;
// Create a context
const SharedContext = createContext();

// Create a provider component
const SharedProvider = ({ children }) => {
    let location = useLocation();
    const [navLinks, setNavLinks] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    let {isAuthenticated} = useAuth();
    // const [hi, ]
    useEffect(() => {
        let habits = [];

        fetch(host+'/api/habits', {credentials: "include"})
            .then(a => {
                if(!a.ok){
                    // setNavError(true); 
                    setFetchError(true);
                    console.log("fetchError");
                    // throw new Error('unable to fetch list of habits');
                    return {error: "habit list fetch error"}
                }
                return a.json();
            })
            .then(jsonObj => {
                console.log(jsonObj, "useEffect fetch api habits called")
                if(jsonObj.error) return Promise.resolve();
                // console.log(jsonObj, "useEffect fetch api habits resolved")
                /**
                 * response looks like this:
                 * {
                 * message: "docs fetched",
                 * _id: "",
                 * habits: {habits: [{..}, {..}], userId: "" }
                 * }
                 */

                habits = [...jsonObj.habits[0].habits]; 
                setNavLinks(habits);              
                
                console.log(jsonObj.habits, "sc", navLinks)
                //set 
            })
            .catch(e => {
                throw new Error(e);
            });
    }, [isAuthenticated, location.pathname.split("/habits/")[1]]);
useEffect(() =>{
console.log("href changed only")
},[location.pathname.split("/habits/")[1]])
    return (
        // <SharedContext.Provider value={{currHabitProvided: [currHabit, setCurrHabit]}}>
        <SharedContext.Provider value={{navLinks, setNavLinks}}>
            {children}
        </SharedContext.Provider>
    );
};

// Create a custom hook to use the context
const useSharedContext = () => {
    return useContext(SharedContext);
};

export {SharedProvider, useSharedContext}