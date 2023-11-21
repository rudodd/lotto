import React from 'react';
import AppHead from './AppHead';

export default function AppContainer(props) {
  const { title } = props;

  return (
    <div>
      <AppHead title={title} />
      <main>
        <div className="logo">
          <h1><span>P</span><span>o</span><span>w</span><span>e</span><span>r</span> Patterns</h1>
        </div>
        {props.children}
      </main>
    </div>
  )
}