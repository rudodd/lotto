import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function useAppSession() {
  const session = useSession();
  const [plays, setPlays] = useState({numbers: null, drawingDate: null});
  const [playsLoading, setPlaysLoading] = useState(false);
  const userId = useRef(null);

  const getPlay = useCallback(async () => {
    setPlaysLoading(true);
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
    setPlaysLoading(true);
    if (session.status === 'authenticated') {
      axios.put('/api/user-data', {id: userId.current, numbers: numbers, drawingDate: date})
        .then((res) => {
          if (res.data.acknowledged) {
            setPlays({numbers: numbers, drawingDate: date});
          }
        })
    } else {
      setPlays({numbers: numbers, drawingDate: date});
    }
  }, [session])

  useEffect(() => {
    if (session.status === 'authenticated') {
      getPlay();
    }
  }, [session])

  useEffect(() => {
    if (playsLoading && session.status !== 'loading') {
      setPlaysLoading(false);
    }
  }, [plays, session])

  return { session, plays, playsLoading, savePlays };
}