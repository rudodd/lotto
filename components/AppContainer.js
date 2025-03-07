import React, { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

// import components
import AppHead from './AppHead';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';

export default function AppContainer(props) {
  const { title } = props;
  const session = useSession();

  useEffect(() => {
    console.log(session);
  }, [session])

  return (
    <div>
      <AppHead title={title} />
      <main>
        <div className="header">
          <div className="logo">
            <h1><span>P</span><span>o</span><span>w</span><span>e</span><span>r</span> Patterns</h1>
          </div>
          <div className="login">
            {session?.status === 'authenticated' && session?.data?.user?.image ? (
              <button onClick={() => signOut()} className="avatar">
                <Avatar alt={session?.data?.user?.name} src={session?.data?.user?.image} sx={{ width: 30, height: 30 }} />
              </button>
            ) : (
              <button onClick={() => signIn('google')} className="avatar">
                <AccountCircleIcon sx={{ width: 30, height: 30 }} />
              </button>
            )}
          </div>
        </div>
        {props.children}
      </main>
    </div>
  )
}