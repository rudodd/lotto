// import library functionality
import React, { useEffect, useState } from 'react';

// import custom functionality
import Numbers from '../utils/numbers';
import { empty } from '../utils/helpers';

// import components
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {

  let numbers;
  const [prevResults, setPrevResults] = useState([]);
  const [lastDrawing, setLastDrawing] = useState(null);
  const [odd, setOdd] = useState([]);
  const [even, setEven] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);

  const fetchLottResults = () => {
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
      setLastDrawing(numbers.lastDrawing);
      setOdd(numbers.generatePlay('odd'));
      setEven(numbers.generatePlay('even'));
      setHigh(numbers.generatePlay('high'));
      setLow(numbers.generatePlay('low'));
      console.log(numbers.getStats());
    }
  }, [prevResults])

  useEffect(() => {
    fetchLottResults();
  }, [])

  return (
    <>
      {!empty(prevResults) &&
        <div>
          <Head>
            <title>Combinatorial Lotto Numbers</title>
            <meta name="description" content="Powerball combinatorial number generator" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main>
            <h1>Combinatorial Lotto Numbers</h1>
            {!empty(lastDrawing) &&
              <div className="last-drawing">
                <div className="play-container">
                  <h2>Last Drawing</h2>
                  <div className="number-container">
                    {lastDrawing.numbers.map((number, key) => (
                      <div className="number" key={`odd-high-${number}-${key}`}>
                        {number}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
            {!empty(odd) &&
              <div className="play-container">
                <h2>Odd Dominant</h2>
                <div className="number-container">
                  {odd.map((number, key) => (
                    <div className="number" key={`odd-high-${number}-${key}`}>
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            }
            {!empty(even) &&
              <div className="play-container">
                <h2>Even Dominant</h2>
                <div className="number-container">
                  {even.map((number, key) => (
                    <div className="number" key={`odd-high-${number}-${key}`}>
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            }
            {!empty(high) &&
              <div className="play-container">
                <h2>High Dominant</h2>
                <div className="number-container">
                  {high.map((number, key) => (
                    <div className="number" key={`odd-high-${number}-${key}`}>
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            }
            {!empty(low) &&
              <div className="play-container">
                <h2>Low Dominant</h2>
                <div className="number-container">
                  {low.map((number, key) => (
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
      }
    </>
  )
}
