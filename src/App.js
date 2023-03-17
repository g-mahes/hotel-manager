import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore';
import { MainContext } from "./MainContext"
import LandingPage from './LandingPage'
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



function App() {
  const context = useContext(MainContext);
  const [user] = useAuthState(context.auth);
  const [email, setEmail] = useState("")
  const valid = [""]; // list of valid emails
  
  // not using valid email to access web app
  if ((user && !valid.includes(email) && email !== "")) {
    return (
      <section>
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
    <div style={{
      fontFamily: "sans-serif",
      textAlign: "center",
      margin: "0 auto",
      padding: "20px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      borderRadius: "10px",
      overflowY: "auto"
    }}>
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LandingPage />

      </section>

    </div >
  );
}

export default App;
