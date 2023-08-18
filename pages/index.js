// import library functionality
import React, { useEffect, useState } from 'react';

// import custom functionality
import Numbers from '../utils/numbers';
import { empty, titleCase } from '../utils/helpers';

// import components
import Head from 'next/head'
import Button from '@mui/material/Button';
import NumberCard from '../components/NumerCard';
import PlayGeneratorModal from '../components/PlayGeneratorModal';

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [numbers, setNumbers] = useState(null);
  const [jackpot, setJackpot] = useState(null);
  const [cashValue, setCashValue] = useState(null);
  const [prevResults, setPrevResults] = useState([]);
  const [lastDrawing, setLastDrawing] = useState(null);
  const [nextDrawing, setNextDrawing] = useState(null);
  const [plays, setPlays] = useState([]);
  const [hot, setHot] = useState([]);
  const [cold, setCold] = useState([]);
  const [playModalOpen, setPlayModalOpen] = useState(false);

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

  const generatePlays = (patterns, exclusions) => {
    const includeRandom = patterns.includes('random');
    if (includeRandom) {
      patterns = patterns.filter((pattern) => pattern != 'random');
    }
    const generatedPlays = [];
    patterns.forEach((type) => {
      generatedPlays.push({
        numbers: numbers.generatePlay(type, exclusions),
        type: titleCase(type) + ' Dominant 3:2 Ratio',
        exclusions: !empty(exclusions) ? exclusions.map((name) => titleCase(name)).toString() : 'None'
      })
    })
    if (includeRandom) {
      generatedPlays.push({
        numbers: numbers.generatePlay(null, exclusions),
        type: 'Random Play (No Pattern)',
        exclusions: !empty(exclusions) ? exclusions.map((name) => titleCase(name)).toString() : 'None'
      })
    }
    window.localStorage.setItem('power-picker-plays', JSON.stringify(generatedPlays))
    setPlays(generatedPlays);
    closeModal();
  }

  const closeModal = () => {
    setPlayModalOpen(false);
  }

  useEffect(() => {
    if (!empty(prevResults)) {
      const numbers = new Numbers(prevResults);
      const stats = numbers.getStats();
      setLastDrawing({...numbers.lastDrawing, ...stats.data[0]});
      setHot(numbers.hot.map((number) => number.number));
      setCold(numbers.cold.map((number) => number.number));
      setNumbers(numbers);
    }
  }, [prevResults])

  useEffect(() => {
    if (
      !empty(prevResults) &&
      !empty(lastDrawing) &&
      !empty(nextDrawing) &&
      !empty(hot) &&
      !empty(cold)
    ) {
      setLoading(false);
    }
  }, [prevResults, nextDrawing, lastDrawing, hot, cold])

  useEffect(() => {
    const savedPlays = JSON.parse(window.localStorage.getItem('power-picker-plays'));
    if (!empty(savedPlays)) {
      setPlays(savedPlays);
    }
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
              <NumberCard play={lastDrawing} hot={hot} cold={cold} lastDrawing />
            }
            <div className="my-numbers">
              <h3>My Numbers</h3>
              {!empty(plays) ? (
                <>
                  {plays.map((play, key) => (
                    <NumberCard play={play} hot={hot} cold={cold} key={`generated-play-${key}`} />
                  ))}
                  <Button className="generate-plays-button" variant="contained" onClick={() => setPlayModalOpen(true)}>Generate Plays</Button>
                </>
              ) : (
                <Button className="generate-plays-button" variant="contained" onClick={() => setPlayModalOpen(true)}>Generate Plays</Button>
              )}
            </div>
          </main>

          <PlayGeneratorModal open={playModalOpen} close={closeModal} generatePlay={generatePlays} />

          <footer>

          </footer>
        </div>
      }
    </>
  )
}
