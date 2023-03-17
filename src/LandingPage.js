import React, { useContext, useState } from 'react'
import { MainContext } from './MainContext';
import ManagementView from './Views/ManagementView';
import HousekeepingView from './Views/HousekeepingView'
import firebase from 'firebase/compat/app'
import { useAuthState } from 'react-firebase-hooks/auth'

import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

// sign out component
function SignOut() {
    const context = useContext(MainContext);
    return context.auth.currentUser && (

        <Button size="small" color="primary" style={{ borderRadius: '3px', backgroundColor: 'lightblue', margin: '5px' }}
            onClick={() => context.auth.signOut()}
        >Try Again</Button>
    )
}

// sign in component using Google Auth
function SignIn(props) {
    const context = useContext(MainContext);
    const { setEmail } = props;

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        context.auth.signInWithPopup(provider)
            .then((userCredential) => {
                setEmail(userCredential.user.email);
                console.log(userCredential.user.email)
            });
    }
    return (
        <Button size="small" color="primary" style={{ borderRadius: '3px', backgroundColor: 'lightblue', padding: '1em' }}
            onClick={signInWithGoogle}
        >Sign in with Google</Button>
    );
}


function LandingPage() {
    const { managementView, setManagementView, housekeepingView, setHousekeepingView, auth } = useContext(MainContext);


    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("")
    const valid = [""]; // list of valid emails

    if ((user && !valid.includes(email) && email !== "")) {
        return (
            <section style={{ backgroundColor: "#edf1fc", borderRadius: "5px" }}>
                {(user && !valid.includes(email)) &&
                    <div style={{
                        backgroundColor: "#ffe3e3",
                        color: "#b00020",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "20px",
                    }}>
                        <b style={{ marginRight: "10px" }}>Please use right email address!</b>
                        <SignOut></SignOut>
                    </div>}
            </section>
        )
    }
    return (
        <div >
            {managementView && <ManagementView></ManagementView>}
            {housekeepingView && <HousekeepingView></HousekeepingView>}
            {!managementView && !housekeepingView &&
                <>
                    <div style={{ marginTop: '10%' }}>
                        <Typography variant="h4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: "center", color: "navy" }}>
                            American Inn Housekeeping and Maintenance Manager
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10%' }}>
                            {(user && valid.includes(email)) && (
                                <>
                                    <Button size="small" color="primary" style={{ borderRadius: '3px', backgroundColor: 'lightblue', padding: '1em' }}
                                        onClick={() => { setHousekeepingView(true) }}
                                    >Housekeeping</Button>
                                    <Button size="small" color="primary" style={{ borderRadius: '3px', backgroundColor: 'lightblue', padding: '1em' }}
                                        onClick={() => { setManagementView(true) }}
                                    >Management</Button>
                                </>
                            )}
                            {!valid.includes(email) && <SignIn setEmail={setEmail} />}
                        </div>
                    </div>
                </>
            }

        </div >


    )
}

export default LandingPage
