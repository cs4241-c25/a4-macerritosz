import React, { createContext, useState, useEffect } from 'react';

const CredContext = createContext();

export const CredentialsProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    //instead, use a get request to /profile to get the user as context, and pass down from here to all child components
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/profile');
                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUsername(data.username);
                    setLoggedIn(true);

                } else {
                    setLoggedIn(false);
                }
            } catch (e) {
                console.log("Error getting user profile", e);
                setLoggedIn(false);

            }
        }
        fetchUser();
    }, []);
    //logout here handles change in state, should only be called form Header where logout takes place
    const logIn = (user) => {
        setLoggedIn(true);
        setUsername(user);
    }
    const logOut = () => {
        setLoggedIn(false);
        setUsername("");
    }

    return (
        <CredContext.Provider value={{loggedIn, username, logOut, logIn}}>
            {children}
        </CredContext.Provider>
    )
}

export default CredContext;