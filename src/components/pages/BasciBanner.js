import React, { useEffect, useState, useRef } from 'react';
import reactImageSize from 'react-image-size';
import ReactDOM from 'react-dom';

export default function BasicBanner(props) {
  const [diameter, setDiameter] = useState(25);
  const [diameter2, setDiameter2] = useState();
  const imageRef = useRef(null);
  const circle2Ref = useRef(null);

  const [left, setLeft] = useState(25);
  const [top, setTop] = useState(25);

  const [circle2VDirection, setCircle2VPosition] = useState('bottom');
  const [circle2HDirection, setCircle2HPosition] = useState('left');
  const [circle2VVal, setCircle2VVal] = useState(0);
  const [circle2HVal, setCircle2HVal] = useState(0);
  const [showCircle2, setShowCircle2] = useState(false);

  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(255);
  const [blue, setBlue] = useState(255);

  const verticalPosition = props.verticalPosition;
  const horizontalPosition = props.horizontalPosition;
  const index = props.index;

  function handleTextClick() {
    setLeft(Math.floor(Math.random() * 25));
    setTop(Math.floor(Math.random() * 25));
  }

  function handleImageClick() {
    setRed(Math.floor(Math.random() * 255));
    setGreen(Math.floor(Math.random() * 255));
    setBlue(Math.floor(Math.random() * 255));
  }

  function handleCircleClick() {
    props.onClick();
  }

  function calculateDistance(
    x1,
    y1,
    x2,
    y2,
    vDir,
    hDir,
    vVal,
    hVal,
    verticalPosition,
    horizontalPosition
  ) {
    if (hDir == 'left' && vDir == 'bottom' && vVal == 0) {
      if (horizontalPosition == 'right' && verticalPosition == 'bottom') {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    } else if (hDir == 'right' && vDir == 'bottom' && hVal == 0) {
      if (horizontalPosition == 'right' && verticalPosition == 'top') {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    } else if (hDir == 'right' && vDir == 'top' && vVal == 0) {
      if (horizontalPosition == 'left' && verticalPosition == 'top') {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    } else if (hDir == 'left' && vDir == 'top' && hVal == 0) {
      if (horizontalPosition == 'left' && verticalPosition == 'bottom') {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }
    }

    return Number.MAX_SAFE_INTEGER;
  }

  function getCoordinate(
    vDir,
    hDir,
    vVal,
    hVal,
    imgWidth,
    imgHeight,
    diameter2
  ) {
    let x, y;

    if (hDir == 'left' && vDir == 'bottom' && vVal == 0) {
      x = imgWidth - hVal;
      y = diameter2 / 2;
    }
    if (hDir == 'right' && vDir == 'bottom' && hVal == 0) {
      x = diameter2 / 2;
      y = imgHeight - vVal;
    }
    if (hDir == 'right' && vDir == 'top' && vVal == 0) {
      x = imgWidth - hVal;
      y = diameter2 / 2;
    }
    if (hDir == 'left' && vDir == 'top' && hVal == 0) {
      x = diameter2 / 2;
      y = imgHeight - vVal;
    }

    return { x, y };
  }

  function calculateNewPosition(
    vDir,
    hDir,
    vVal,
    hVal,
    imgWidth,
    imgHeight,
    diameter2,
    diameter,
    verticalPosition,
    horizontalPosition
  ) {
    const newPosition = {
      vDir,
      hDir,
      vVal,
      hVal,
    };

    if (hDir == 'left' && vDir == 'bottom' && vVal == 0) {
      //will go right
      if (imgWidth - hVal > 15 + diameter2) {
        newPosition['hVal'] = hVal + 15;
      } else {
        //will go top
        newPosition['vDir'] = 'bottom';
        newPosition['hDir'] = 'right';
        newPosition['vVal'] = 0;
        newPosition['hVal'] = 0;
      }
    }
    if (hDir == 'right' && vDir == 'bottom' && hVal == 0) {
      //will go top
      if (imgHeight - vVal > 15 + diameter2) {
        newPosition['vVal'] = vVal + 15;
      } else {
        //will go top
        newPosition['vDir'] = 'top';
        newPosition['hDir'] = 'right';
        newPosition['vVal'] = 0;
        newPosition['hVal'] = 0;
      }
    }
    if (hDir == 'right' && vDir == 'top' && vVal == 0) {
      //will go left
      if (imgWidth - hVal > 15 + diameter2) {
        newPosition['hVal'] = hVal + 15;
      } else {
        //will go top
        newPosition['vDir'] = 'top';
        newPosition['hDir'] = 'left';
        newPosition['vVal'] = 0;
        newPosition['hVal'] = 0;
      }
    }
    if (hDir == 'left' && vDir == 'top' && hVal == 0) {
      //will go bottom
      if (imgHeight - vVal > 15 + diameter2) {
        newPosition['vVal'] = vVal + 15;
      } else {
        //will go top
        newPosition['vDir'] = 'bottom';
        newPosition['hDir'] = 'left';
        newPosition['vVal'] = 0;
        newPosition['hVal'] = 0;
      }
    }

    return newPosition;
  }

  // useEffect will run on stageCanvasRef value assignment
  useEffect(() => {
    if (imageRef.current) {
      const imageWidth = imageRef.current.width;
      const imageHeight = Math.floor(
        (imageRef.current.naturalHeight * imageRef.current.width) /
          imageRef.current.naturalWidth
      );

      const shortestSide = imageHeight < imageWidth ? imageHeight : imageWidth;
      setDiameter(shortestSide / 2);
      setDiameter2(shortestSide / 10);
      setCircle2HVal(imageWidth / 2);
      setShowCircle2(true);
    }
  }, [imageRef]);

  useEffect(() => {
    const interval = setInterval(function () {
      if (imageRef.current) {
        const imageWidth = imageRef.current.width;
        const imageHeight = Math.floor(
          (imageRef.current.naturalHeight * imageRef.current.width) /
            imageRef.current.naturalWidth
        );

        const newPosition = calculateNewPosition(
          circle2VDirection,
          circle2HDirection,
          circle2VVal,
          circle2HVal,
          imageWidth,
          imageHeight,
          diameter2,
          diameter,
          verticalPosition,
          horizontalPosition
        );

        const x1 = diameter / 2;
        const y1 = diameter / 2;
        const { x: x2, y: y2 } = getCoordinate(
          newPosition.vDir,
          newPosition.hDir,
          newPosition.vVal,
          newPosition.hVal,
          imageWidth,
          imageHeight,
          diameter2
        );

        if (diameter && verticalPosition && horizontalPosition) {
          const shortestDistance = diameter / 2 + diameter2 / 2;
          const currentDistance = calculateDistance(
            x1,
            y1,
            x2,
            y2,
            newPosition.vDir,
            newPosition.hDir,
            newPosition.vVal,
            newPosition.hVal,
            verticalPosition,
            horizontalPosition
          );
          if (currentDistance <= shortestDistance && showCircle2) {
            console.log(
              `index: ${index}, currentDistance: ${currentDistance}, shortestDistance: ${shortestDistance}`
            );
            setShowCircle2(false);
          }
        }

        setCircle2VPosition(newPosition.vDir);
        setCircle2VVal(newPosition.vVal);

        setCircle2HPosition(newPosition.hDir);
        setCircle2HVal(newPosition.hVal);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    index,
    imageRef,
    circle2VDirection,
    circle2HDirection,
    circle2VVal,
    circle2HVal,
    diameter,
    diameter2,
    verticalPosition,
    horizontalPosition,
    showCircle2,
  ]);

  const circleStyles = {
    position: 'absolute',
    zIndex: 5,
    height: diameter + 'px',
    width: diameter + 'px',
    backgroundColor: 'green',
    borderRadius: '50%',
    display: 'inline-block',
  };

  circleStyles[props.verticalPosition] = 0;
  circleStyles[props.horizontalPosition] = 0;

  const circle2Styles = {
    position: 'absolute',
    zIndex: 6,
    height: diameter2 + 'px',
    width: diameter2 + 'px',
    backgroundColor: '#800080',
    borderRadius: '50%',
    display: 'inline-block',
  };
  circle2Styles[circle2VDirection] = circle2VVal;
  circle2Styles[circle2HDirection] = circle2HVal;

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid red',
        float: 'left',
        width: '49%',
      }}
    >
      {props.showCircle && (
        <span style={circleStyles} onClick={handleCircleClick}></span>
      )}
      {showCircle2 && <span ref={circle2Ref} style={circle2Styles}></span>}

      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          color: '#fff',
          display: 'block',
          left: left,
          top: top,
          width: '100%',
          textAlign: 'center',
          color: `rgb(${red}, ${green}, ${blue})`,
        }}
        onClick={handleTextClick}
      >
        <p>{props.text}</p>
      </div>
      <img
        style={{ position: 'absolute', zIndex: -1 }}
        style={{ width: '100%' }}
        src={props.background}
        onClick={handleImageClick}
        ref={imageRef}
      />
    </div>
  );
}
