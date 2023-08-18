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

// Import icons
import ReplayIcon from '@mui/icons-material/Replay';

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [numbers, setNumbers] = useState(null);
  const [jackpot, setJackpot] = useState(null);
  const [cashValue, setCashValue] = useState(null);
  const [prevResults, setPrevResults] = useState([]);
  const [lastDrawing, setLastDrawing] = useState(null);
  const [nextDrawing, setNextDrawing] = useState(null);
  const [plays, setPlays] = useState([]);
  const [playDate, setPlayDate] = useState(null);
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
    window.localStorage.setItem('power-picker-plays', JSON.stringify({plays: generatedPlays, playDate: nextDrawing}))
    setPlays(generatedPlays);
    setPlayDate(nextDrawing);
    closeModal();
  }

  const closeModal = () => {
    setPlayModalOpen(false);
  }

  const replay = () => {
    window.localStorage.setItem('power-picker-plays', JSON.stringify({plays: plays.plays, playDate: nextDrawing}))
    setPlayDate(nextDrawing);
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
      setPlays(savedPlays.plays);
      setPlayDate(savedPlays.playDate);
    }
    fetchLottResults();
    getNextDrawing();
  }, [])

  return (
    <>
      {!loading &&
        <div>
          <Head>
            <title>Power Patterns</title>
            <meta name="description" content="Powerball combinatorial number generator" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="apple-touch-icon" sizes="57x57" href="/img/icon/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/img/icon/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/img/icon/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/img/icon/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/img/icon/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/img/icon/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/img/icon/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/img/icon/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/img/icon/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192"  href="/img/icon/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/img/icon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/img/icon/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/img/icon/favicon-16x16.png" />
            <link rel="manifest" href="/img/icon/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/img/icon/ms-icon-144x144.png" />
            <meta name="theme-color" content="#ffffff" />
          </Head>

          <main>
            <div className="logo">
              <h1><span>P</span><span>o</span><span>w</span><span>e</span><span>r</span> Patterns</h1>
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
              <div className="my-numbers-title-block">
                <h3>My Numbers</h3>
                {new Date(nextDrawing) > new Date(playDate) &&
                  <Button 
                    className="replay-button" 
                    variant="outlined" 
                    size="small" 
                    startIcon={<ReplayIcon />}
                    onClick={() => replay()}
                  >
                    Play Again
                  </Button>
                }
              </div>
              {!empty(plays) ? (
                <>
                  <p>For the {playDate} drawing</p>
                  {plays.map((play, key) => (
                    <NumberCard 
                      play={play} 
                      hot={hot} 
                      cold={cold} 
                      key={`generated-play-${key}`} 
                      winningNumbers={!empty(prevResults.filter((drawing) => drawing.date.toDateString() == playDate)) ? prevResults.filter((drawing) => drawing.date.toDateString() == playDate)[0].numbers : []} 
                    />
                  ))}
                  <Button className="generate-plays-button" variant="contained" onClick={() => setPlayModalOpen(true)}>Generate New Plays</Button>
                </>
              ) : (
                <>
                  <div className="empty-card">
                    <p>You have not generated any numbers.</p>
                  </div>
                  <Button className="generate-plays-button" variant="contained" onClick={() => setPlayModalOpen(true)}>Generate Plays</Button>
                </>
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
