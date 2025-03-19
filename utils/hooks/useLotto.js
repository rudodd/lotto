// import library functionality
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function useLotto() {
  const [jackpotLoading, setJackpotLoading] = useState(true);
  const [jackpot, setJackpot] = useState(null);
  const [cashValue, setCashValue] = useState(null);
  const [numbersLoading, setNumbersLoading] = useState(true);
  const [numbers, setNumbers] = useState(null);

  const fetchJackpot = useCallback( async () => {
    if (!jackpotLoading) {
      setJackpotLoading(true);
    }
    axios.get('/api/jackpot')
      .then((res) => {
        setJackpot(res.data.jackpot);
        setCashValue(res.data.cash);
        setJackpotLoading(false);
      })
  }, []);

  const fetchResults = useCallback( async () => {
    if (!numbersLoading) {
      setNumbersLoading(true);
    }
    axios.get('/api/lotto-results')
      .then((res) => {
        const lastNumbers = res.data.data.map((drawing) => {
          return {
            date: new Date(drawing[8]),
            numbers: drawing[9].split(' ').map((number) => Number(number))
          }
        }).sort((a,b) => b.date - a.date);
        lastNumbers.length = 100;
        setNumbers(lastNumbers);
        setNumbersLoading(false);
      })
  }, [])

  useEffect(() => {
    fetchJackpot();
    fetchResults();
  }, [])

  return { loading: (jackpotLoading || numbersLoading), jackpot, cashValue, numbers }
}