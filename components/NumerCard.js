// Import library functionality
import React, {useState, useEffect} from 'react';

// import components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

// Import icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function NumberCard(props) {

  const { numbers, hot, cold } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="play-card">
      <CardContent className="play-container">
        <div className="number-container">
          {numbers.map((number, key) => (
            <div className={`number${hot.includes(number) ? ' hot' : cold.includes(number) ? ' cold' : ''}`} key={`odd-high-${number}-${key}`}>
              {number}
            </div>
          ))}
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton size="small" onClick={()=> setExpanded(!expanded)} className="card-expand-button">
          <ExpandMoreIcon className={expanded ? 'flipped' : null} />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <h2>Odd Dominant 3:2 Ratio</h2>
        </CardContent>
      </Collapse>
    </Card>
  )
}