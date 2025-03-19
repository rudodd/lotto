// Import library functionality
import React, { useEffect, useState, useMemo } from 'react';

// Import custom functionality
import Numbers from '../utils/numbers';
import useAppSession from '../utils/hooks/useAppSession';
import { empty, titleCase } from '../utils/helpers';

// Import components
import AppContainer from '../components/AppContainer';
import AppSkeleton from '../components/AppSkeleton';
import Button from '@mui/material/Button';
import NumberCard from '../components/NumberCard';
import PlayGeneratorModal from '../components/PlayGeneratorModal';

// Import icons
import ReplayIcon from '@mui/icons-material/Replay';
import AppHead from '../components/AppHead';
import useLotto from '../utils/hooks/useLotto';

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [plays, setPlays] = useState([]);
  const [playDate, setPlayDate] = useState(null);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const { session, plays: dbPlays, savePlays }= useAppSession();
  const { loading: lottoLoading, numbers: prevResults, cashValue, jackpot } = useLotto();

  const numbers = useMemo(() => {
    return !empty(prevResults) ? new Numbers(prevResults): null;
  }, [prevResults])

  const lastDrawing = useMemo(() => {
    const stats = !empty(numbers) ? numbers.getStats() : null;
    return !empty(stats) ? {...numbers.lastDrawing, ...stats.data[0]} : {};
  }, [numbers])

  const hot = useMemo(() => {
    return !empty(numbers) ? numbers.hot.map((number) => number.number) : [];
  }, [numbers])

  const cold = useMemo(() => {
    return !empty(numbers) ? numbers.cold.map((number) => number.number) : [];
  }, [numbers])

  // Determine the next drawing date based on the date - drawings are Mon, Wed, Sat
  const nextDrawing = useMemo(() => {
    const today = new Date().getDay();
    const drawingDays = [1, 3, 6];
    const oneDay = [0, 2, 5];
    const daysBetween = drawingDays.includes(today) ? 0 : oneDay.includes(today) ? 1 : 2;
    const next = new Date();
    next.setDate(next.getDate() + daysBetween)
    return next.toDateString();
  }, [])

  // Use the Numbers class to generate plays based on inputs - called from PlayGeneratorModal component
  const generatePlays = (patterns, exclusions) => {
    setPlays([]);
    setPlayDate(null);
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
    savePlays(generatedPlays, nextDrawing);
    window.localStorage.setItem('power-picker-plays', JSON.stringify({plays: generatedPlays, playDate: nextDrawing}))
    setPlays(generatedPlays);
    setPlayDate(nextDrawing);
    setPlayModalOpen(false);
  }

  // Function to reuse the same pay from the last drawing for the next drawing
  const replay = () => {
    window.localStorage.setItem('power-picker-plays', JSON.stringify({plays: plays.plays, playDate: nextDrawing}))
    setPlayDate(nextDrawing);
  }

  useEffect(() => {
    if ( !empty(prevResults) && !empty(lastDrawing) ) {
      setTimeout(() => {
        setLoading(false); // Use setTimeout to avoid skeleton flashing
      }, 500)
    }
  }, [prevResults, lastDrawing])

  useEffect(() => {
    const savedPlays = JSON.parse(window.localStorage.getItem('power-picker-plays'));
    if (!empty(savedPlays)) {
      setPlays(savedPlays.plays);
      setPlayDate(savedPlays.playDate);
    }
  }, [])

  return (
    <>
      {loading ? (
        <>
          <AppHead />
          <AppSkeleton />
        </>
      ) : (
        <>
          <AppContainer session={session}>
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
                {!empty(plays) && (new Date(nextDrawing) > new Date(playDate)) &&
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
          </AppContainer>
          <PlayGeneratorModal open={playModalOpen} close={() => setPlayModalOpen(false)} generatePlay={generatePlays} />
        </>
      )}
    </>
  )
}
