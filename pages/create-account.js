import React from 'react';
import AppContainer from '../components/AppContainer';

export default function CreateAccount() {

  return (
    <AppContainer title="Create Account">
      <input type="text" id="email" placeholder="Email" />
      <input type="text" id="password" placeholder="Password" />
      <input type="text" id="password-two" placeholder="Re-type password" />
    </AppContainer>
  )
}