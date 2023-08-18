// Import library components
import React, { useState, useEffect } from 'react';

// import components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';

// Import icons
import CloseIcon from '@mui/icons-material/Close';

export default function PlayGeneratorModal(props) {

  const { open, close, generatePlay } = props;
  const [patterns, setPatterns] = useState([]);
  const [exclusions, setExclusions] = useState([])

  const togglePattern = (status, name) => {
    if (status && !patterns.includes(name)) {
      setPatterns([...patterns, name]);
    } else if (!status && patterns.includes(name)) {
      setPatterns(patterns.filter((pattern) => pattern != name));
    }
  }

  const toggleExclusion = (status, name) => {
    if (status && !exclusions.includes(name)) {
      setExclusions([...exclusions, name]);
    } else if (!status && exclusions.includes(name)) {
      setExclusions(exclusions.filter((exclusion) => exclusion != name));
    }
  }

  const handleGenerate = () => {
    generatePlay(patterns, exclusions);
    setPatterns([]);
    setExclusions([]);
  }

  return (
    <Modal
      open={open}
      onClose={() => close()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="play-generator-box">
        <IconButton className="close-modal-button" onClick={() => close()}>
          <CloseIcon />
        </IconButton>
        <div className="modal-content">
          <h3 id="parent-modal-title">Generate your plays</h3>
          <p id="parent-modal-description">Select the patterns and options for your generated plays.</p>
          <form>
            <FormGroup className="modal-form-section checkbox">
              <h4>Patterns</h4>
              <FormControlLabel control={<Checkbox onChange={(e) => togglePattern(e.target.checked, 'odd')} />} label="Odd Dominant 3:2 Ratio" />
              <FormControlLabel control={<Checkbox onChange={(e) => togglePattern(e.target.checked, 'even')} />} label="Even Dominant 3:2 Ratio" />
              <FormControlLabel control={<Checkbox onChange={(e) => togglePattern(e.target.checked, 'high')} />} label="High Dominant 3:2 Ratio" />
              <FormControlLabel control={<Checkbox onChange={(e) => togglePattern(e.target.checked, 'low')} />} label="Low Dominant 3:2 Ratio" />
              <FormControlLabel control={<Checkbox onChange={(e) => togglePattern(e.target.checked, 'random')} />} label="None (Pure random generation)" />
            </FormGroup>
            <FormGroup className="modal-form-section switch">
              <h4>Exclusions</h4>
              <FormControlLabel control={<Switch onChange={(e) => toggleExclusion(e.target.checked, 'hot')} />} label="Exclude Hot Numbers" />
              <FormControlLabel control={<Switch onChange={(e) => toggleExclusion(e.target.checked, 'cold')}/>} label="Exclude Cold Numbers" />
            </FormGroup>
          </form>
          <Button onClick={()=> handleGenerate()} className="generate-plays-button" variant="contained">Generate</Button>
        </div>
      </Box>
    </Modal>
  )
}