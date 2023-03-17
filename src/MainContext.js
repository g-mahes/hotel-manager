import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

export const MainContext = React.createContext();
firebase.initializeApp({

})

const auth = firebase.auth();
const firestone = firebase.firestore();
function MainContextProvider({ children }) {
    const [managementView, setManagementView] = useState(false);
    const [housekeepingView, setHousekeepingView] = useState(false);

    return (
        <MainContext.Provider
            value={{
                auth,
                firestone,
                managementView,
                housekeepingView,
                setManagementView,
                setHousekeepingView
            }}>
            {children}
        </MainContext.Provider>
    )
}

export default MainContextProvider