// Import library functionality
import React, {useState, useEffect} from 'react';

// Import custom functionality
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

  const { numbers, hot, cold, lastDrawing } = props;
  const [expanded, setExpanded] = useState(false);
  console.log(lastDrawing);

  return (
    <Card className="play-card">
      <CardContent className={`play-container${!empty(lastDrawing) ? ' last-drawing' : ''}`}>
        {!empty(lastDrawing) &&
          <>
            <h3>Last Drawing</h3>
            <p>{lastDrawing.date.toDateString()}</p>
          </>
        }
        <div className="number-container">
          {numbers.map((number, index) => (
            <div className={`number${index === 5 ? ' powerball' : !empty(lastDrawing) ? '' : hot.includes(number) ? ' hot' : cold.includes(number) ? ' cold' : ''}`} key={`odd-high-${number}-${index}`}>
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
          {!empty(lastDrawing) ? (
            <>
              <h4>Matching patterns:</h4>
              <div className="pattern-list">
                {Object.entries(lastDrawing.stats).map((stat) => (
                  <div className="pattern">
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
            <h2>Odd Dominant 3:2 Ratio</h2>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}