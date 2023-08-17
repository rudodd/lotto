// import library functionality
import React, { useEffect, useState } from 'react';

// import custom functionality
import Numbers from '../utils/numbers';
import { empty } from '../utils/helpers';

// import components
import Head from 'next/head'
import NumberCard from '../components/NumerCard';

export default function Home() {

  let numbers;
  const [loading, setLoading] = useState(true);
  const [jackpot, setJackpot] = useState(null);
  const [cashValue, setCashValue] = useState(null);
  const [prevResults, setPrevResults] = useState([]);
  const [lastDrawing, setLastDrawing] = useState(null);
  const [nextDrawing, setNextDrawing] = useState(null);
  const [odd, setOdd] = useState([]);
  const [even, setEven] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);
  const [hot, setHot] = useState([]);
  const [cold, setCold] = useState([]);

  const getNextDrawing = () => {
    const today = new Date().getDay();
    const drawingDays = [1, 3, 6];
    const oneDay = [0, 2, 5];
    const daysBetween = drawingDays.includes(today) ? 0 : oneDay.includes(today) ? 1 : 2;
    const nextDrawing = new Date();
    nextDrawing.setDate(nextDrawing.getDate() + daysBetween)
    setNextDrawing(nextDrawing.toDateString());
  }

  const fetchLottResults = () => {

    // Fetch the current jackpot
    fetch('/api/jackpot')
      .then((res) => {
        res.json()
          .then((res) => {
            setJackpot(res.jackpot);
            setCashValue(res.cash);
          })
      })

    // Fetch winning mumber history
    fetch('/api/lotto-results')
      .then((res) => {
        res.json()
          .then((json) => {
            const last = json.data.map((draw) => {
              return {
                date: new Date(draw[8]),
                numbers: draw[9].split(' ').map((number) => Number(number))
              }
            }).sort((a,b) => b.date - a.date);
            last.length = 100;
            setPrevResults(last);
          });
      })
  }

  useEffect(() => {
    if (!empty(prevResults)) {
      numbers = new Numbers(prevResults);
      const stats = numbers.getStats();
      setLastDrawing({...numbers.lastDrawing, ...stats[0]});
      setOdd(numbers.generatePlay('odd'));
      setEven(numbers.generatePlay('even'));
      setHigh(numbers.generatePlay('high'));
      setLow(numbers.generatePlay('low'));
      setHot(numbers.hot.map((number) => number.number));
      setCold(numbers.cold.map((number) => number.number));
    }
  }, [prevResults])

  useEffect(() => {
    if (
      !empty(prevResults) &&
      !empty(lastDrawing) &&
      !empty(nextDrawing) &&
      !empty(odd) &&
      !empty(even) &&
      !empty(high) &&
      !empty(low) &&
      !empty(hot) &&
      !empty(cold)
    ) {
      setLoading(false);
    }

    if (    
      !empty(odd) &&
      !empty(even) &&
      !empty(high) &&
      !empty(low)
    ) {
      window.localStorage.setItem('numbers', JSON.stringify({
        date: new Date(),
        odd: odd,
        even: even,
        high: high,
        low: low
      }))
    }
  }, [prevResults, nextDrawing, lastDrawing, odd, even, high, low, hot, cold])

  useEffect(() => {
    fetchLottResults();
    getNextDrawing();
  }, [])

  return (
    <>
      {!loading &&
        <div>
          <Head>
            <title>Power Picker</title>
            <meta name="description" content="Powerball combinatorial number generator" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
          </Head>

          <main>
            <div className="logo">
              <h1>Power Picker</h1>
            </div>
            <div className="current-info">
              <p>Next drawing: {nextDrawing}</p>
              <h1>{jackpot}</h1>
              <h3><span>Est. Cash Value:</span> {cashValue}</h3>
            </div>
            {!empty(lastDrawing) &&
              <NumberCard numbers={lastDrawing.numbers} hot={hot} cold={cold} lastDrawing={lastDrawing} />
            }
            <div className="my-numbers">
              <h3>My Numbers</h3>
              {!empty(odd) &&
                <NumberCard numbers={odd} hot={hot} cold={cold} />
              }
              {!empty(even) &&
                <NumberCard numbers={even} hot={hot} cold={cold} />
              }
              {!empty(high) &&
                <NumberCard numbers={high} hot={hot} cold={cold} />
              }
              {!empty(low) &&
                <NumberCard numbers={low} hot={hot} cold={cold} />
              }
            </div>
          </main>

          <footer>

          </footer>
        </div>
      }
    </>
  )
}
