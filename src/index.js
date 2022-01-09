import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import data from './data';
import './index.css';
import BasicBanner from './components/pages/BasciBanner';

function App({ task1to3, task4to6 }) {
  const [showCircle, setShowCircle] = useState(0);

  const initial_record = {};
  initial_record['background_0_v'] = 'top';
  initial_record['background_0_h'] = 'left';
  const [positionRecords, setPositionRecords] = useState(initial_record);

  function handleCircleClick() {
    const max = Object.keys(data.task4to6).length;
    const index = Math.floor(Math.random() * max);
    const record_v_key = `background_${index}_v`;
    const record_h_key = `background_${index}_h`;

    let record_h_val;
    let record_v_val;
    if (record_v_key in positionRecords) {
      record_v_val = positionRecords[record_v_key];
    } else {
      record_v_val =
        parseInt(Math.round(Math.random() * 1)) == 1 ? 'top' : 'bottom';
    }

    if (record_h_key in positionRecords) {
      record_h_val = positionRecords[record_h_key];
    } else {
      record_h_val =
        parseInt(Math.round(Math.random() * 1)) == 1 ? 'left' : 'right';
    }

    console.log('index: ' + index + ', max: ' + max);
    setShowCircle(index);

    const newPositions = (positionRecords) => {
      const obj = { ...positionRecords };
      obj[record_v_key] = record_v_val;
      obj[record_h_key] = record_h_val;
      return obj;
    };

    setPositionRecords(newPositions);
  }

  return (
    <div className="app">
      {task4to6.map((item, index) => {
        return (
          <BasicBanner
            key={index}
            index={index}
            showCircle={showCircle == index}
            text={item.text}
            background={item.image}
            verticalPosition={
              showCircle == index
                ? positionRecords[`background_${index}_v`]
                : null
            }
            horizontalPosition={
              showCircle == index
                ? positionRecords[`background_${index}_h`]
                : null
            }
            onClick={handleCircleClick}
          />
        );
      })}
    </div>
  );
}

ReactDOM.render(<App {...data} />, document.getElementById('app'));
