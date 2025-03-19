import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function useAppSession() {
  const session = useSession();
  const [plays, setPlays] = useState({numbers: null, drawingDate: null});
  const userId = useRef(null);

  const getPlay = useCallback(async () => {
    if (session.data.user.email) {
      axios.post('/api/user-data', {email: session.data.user.email})
        .then((res) => {
          if (res.data.plays !== null) {
            setPlays({numbers: res.data.plays.numbers, drawingDate: res.data.plays.drawingDate})
          }
          userId.current = res.data.user._id;
        })
    }
  }, [session])

  const savePlays = useCallback(async (numbers, date)=> {
    axios.put('/api/user-data', {id: userId.current, numbers: numbers, drawingDate: date})
      .then((res) => {
        if (res.data.acknowledged) {
          setPlays({numbers: numbers, drawingDate: date});
        }
      })
  }, [])

  useEffect(() => {
    if (session.status === 'authenticated') {
      getPlay();
    }
  }, [session])

  return { session, plays, savePlays };
}