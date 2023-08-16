// import library functionality
import React, { useEffect, useState } from 'react';

// import custom functionality
import Numbers from '../utils/numbers';
import { empty } from '../utils/helpers';

// import components
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {

  const numbers = new Numbers();
  const [oddHigh, setOddHigh] = useState([]);
  const [evenHigh, setEvenHigh] = useState([]);
  const [oddLow, setOddLow] = useState([]);
  const [evenLow, setEvenLow] = useState([]);
  const [prevResults, setPrevResults] = useState([]);

  const fetchLottResults = () => {
    fetch('/api/lotto-results')
      .then((res) => {
        console.log(res);
        res.json()
          .then((json) => {
            const last100 = json.data.map((draw) => {
              return {
                date: new Date(draw[8]),
                numbers: draw[9].split(' ').map((number) => Number(number))
              }
            }).sort((a,b) => b.date - a.date);
            last100.length = 100;
            setPrevResults(last100);
          });
      })
  }

  useEffect(() => {
    if (numbers) {
      setOddHigh(numbers.generatePlay(3,2,3,2));
      setOddLow(numbers.generatePlay(3,2,2,3));
      setEvenHigh(numbers.generatePlay(2,3,3,2));
      setEvenLow(numbers.generatePlay(2,3,2,3));
    }
    fetchLottResults();
  }, [])

  return (
    <div>
      <Head>
        <title>Combinatorial Lotto Numbers</title>
        <meta name="description" content="Powerball combinatorial number generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Combinatorial Lotto Numbers</h1>
        {!empty(oddHigh) &&
          <div className="play-container">
            <h2>Odd / High Dominant</h2>
            <div className="number-container">
              {oddHigh.map((number, key) => (
                <div className="number" key={`odd-high-${number}-${key}`}>
                  {number}
                </div>
              ))}
            </div>
          </div>
        }
        {!empty(oddLow) &&
          <div className="play-container">
            <h2>Odd / Low Dominant</h2>
            <div className="number-container">
              {oddLow.map((number, key) => (
                <div className="number" key={`odd-high-${number}-${key}`}>
                  {number}
                </div>
              ))}
            </div>
          </div>
        }
        {!empty(evenHigh) &&
          <div className="play-container">
            <h2>Even / High Dominant</h2>
            <div className="number-container">
              {evenHigh.map((number, key) => (
                <div className="number" key={`odd-high-${number}-${key}`}>
                  {number}
                </div>
              ))}
            </div>
          </div>
        }
        {!empty(evenLow) &&
          <div className="play-container">
            <h2>Even / Low Dominant</h2>
            <div className="number-container">
              {evenLow.map((number, key) => (
                <div className="number" key={`odd-high-${number}-${key}`}>
                  {number}
                </div>
              ))}
            </div>
          </div>
        }
      </main>

      <footer>

      </footer>
    </div>
  )
}
