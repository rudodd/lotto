// Import library functionality
import React, {useEffect, useState } from 'react';

// import custom functionality
import { empty } from '../utils/helpers';

// import components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

// Import icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function NumberCard(props) {

  const { play, hot, cold, lastDrawing, winningNumbers } = props;
  const [expanded, setExpanded] = useState(false);
  const [powerBall, setPowerBall] = useState(100);
  const [regularNumbers, setRegularNumbers] = useState([100]);

  useEffect(() => {
    if (!empty(winningNumbers)) {
      setPowerBall(winningNumbers[5]);
      const tempNums = [...winningNumbers];
      tempNums.length = 5;
      setRegularNumbers(tempNums);
    }

    console.log(winningNumbers);
  }, [winningNumbers])

  return (
    <Card className="play-card">
      <CardContent className={`play-container${lastDrawing ? ' last-drawing' : ''}`}>
        {lastDrawing &&
          <>
            <h3>Last Drawing</h3>
            <p>{play.date.toDateString()}</p>
          </>
        }
        <div className="number-container">
          {play.numbers.map((number, index) => (
            <div 
              className={`number${index === 5 ? ' powerball' : hot.includes(number) ? ' hot' : cold.includes(number) ? ' cold' : ''}${!lastDrawing && ((index < 5 && regularNumbers.includes(number)) || (index === 5 && powerBall === number)) ? ' check' : ''}`} 
              key={`odd-high-${number}-${index}`}
            >
              {number}
            </div>
          ))}
          <div className="card-actions">
            <IconButton size="small" onClick={()=> setExpanded(!expanded)} className="card-expand-button">
              <ExpandMoreIcon className={expanded ? 'flipped' : null} />
            </IconButton>
          </div>
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {lastDrawing ? (
            <>
              <h4>Matching patterns:</h4>
              <div className="pattern-list">
                {Object.entries(play.stats).map((stat, key) => (
                  <div className="pattern" key={`pattern-${key}`}>
                    <div>{stat[1] ? <CheckCircleIcon className="checked" fontSize="small" /> : <RadioButtonUncheckedIcon className="unchecked" fontSize="small" />}</div>
                    {
                      stat[0] === 'isOddDom' ? 'Odd Dominant 3:2 Ratio' 
                      : stat[0] === 'isEvenDom' ? 'Even Dominant 3:2 Ratio'
                      : stat[0] === 'isHighDom' ? 'High Dominant 3:2 Ratio'
                      : stat[0] === 'isLowDom' ? 'Low Dominant 3:2 Ratio'
                      : 'In Balanced Sum Range (130 - 221)'
                    }
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4>Play info:</h4>
              <div className="play-info">
                <p><strong>Type:</strong> {play.type}</p>
                <p><strong>Exclusions:</strong> {play.exclusions}</p>
                <p><strong>Sum:</strong> {play.numbers.filter((play, index) => index != 5).reduce((a,b) => a + b)}</p>
              </div>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}