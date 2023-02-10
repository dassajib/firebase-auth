import './App.css';
import firebaseInitalizeApp from './components/firebase.initialize';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState } from 'react';
import { Box, TextField } from '@mui/material';

firebaseInitalizeApp();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");

  const auth = getAuth();

  const googleAccountHandle = () => {
    // google auth
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const {displayName, email, photoURL} = result.user;

        const loggedUser = {
          name : displayName,
          email : email,
          photo : photoURL
        }
        setUser(loggedUser);
        // Mail verification function
        verifyEmail();
      }).catch(error => {
        console.log(error.message);
      })
  }

  const githubHandle = () => {
    // Github auth
    signInWithPopup(auth, githubProvider)
    .then(result => {
      const {displayName, email, photoURL} = result.user;

      const loggedUser = {
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(loggedUser);
    }).catch(error => {
      console.log(error.message);
    })
  }

  // verification email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  // Sign Out
  const handleLogOut = () => {
    signOut(auth).then(() => {
      setUser({});
    }).catch((error) => {
      console.log(error.message);
    });
  }

  // form email field
  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  // form password field
  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  // form
  const handleSignIn = (e) => {
    // method called for no loading while submit pressed.
    e.preventDefault();
    //pass authentication
    if (password.length < 6) {
      // setting error
      setPassError("Password should be SIX(6) caracter's long for security purpose.")
      return;
    } 

    if(!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setPassError("Password should be contain 2 CAPITAL letter")
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      }).catch(error => {
        console.log(error.message);
      })
  }

  

  return (
    <div className="App">
        <Box
          onClick={handleSignIn}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              onBlur={handleEmail}
              required
              id="outlined-required"
              label="Name"
            />
            
            <TextField
              onBlur={handlePassword}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <div>
            {passError}
          </div>
          <button type="submit">Registration</button>
        </Box>
      <div>-----------------------</div>
      <br />
      <br />
      <br />
      <button onClick={googleAccountHandle}>Use Google</button>
      <button onClick={githubHandle}>Use Github</button>
      <button onClick={handleLogOut}>Log out</button>
      <br />
      <br />
      
      {
        user.name && <div>
            <h1>Welcome Mr./Mrs : {user.name}</h1>
            <h6>Your email id : {user.email}</h6>
            <img src={user.photoURL} alt="" />
          </div>
      }

    </div>
  );
}

export default App;
