import React, { useState, useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function CreateAccount() {
  const [email, setEmail] = useState(null);
  const [validEmail, setValidEmail] = useState(true);
  const [password, setPassword] = useState(null);
  const [passwordTwo, SetPasswordTwo] = useState(null)
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validForm, setValidForm] = useState(false);

  useEffect(() => {
    setValidEmail(email === null || email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ))
  }, [email])

  useEffect(() => {
    setPasswordsMatch(password === null || passwordTwo === null || password === passwordTwo);
  }, [password, passwordTwo])

  useEffect(() => {
    setValidForm(password !== null && passwordTwo !== null && email !== null && passwordsMatch && validEmail);
  }, [password, passwordTwo, email, passwordsMatch, validEmail])

  return (
    <AppContainer title="Create Account">
      <h2>Create Account</h2>
      <Paper elevation={0}>
        <div className="create-form-container">
          <TextField 
            id="filled-basic" 
            label="Email" 
            variant="filled" 
            onBlur={(e) => setEmail(e.target.value)}
            error={!validEmail}
            helperText={!validEmail ? 'Email is not valid' : null}
          />
          <TextField 
            id="pasword" 
            label="Password" 
            variant="filled" 
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField 
            id="password-two" 
            label="Re-type password" 
            variant="filled" 
            onChange={(e) => SetPasswordTwo(e.target.value)}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? 'Passwords do not match' : null}
          />
          <Button variant="contained" disabled={!validForm}>Create Account</Button>
        </div>
      </Paper>
    </AppContainer>
  )
}