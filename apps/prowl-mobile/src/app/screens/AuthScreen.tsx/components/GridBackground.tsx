import React from 'react';
import Svg, { Line } from 'react-native-svg';

const GridBackground = ({ width, height, lineColor, lineWidth }) => {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const numberOfLines = Math.max(
    Math.floor(width / 50),
    Math.floor(height / 50)
  );

  return (
    <Svg
      height={height}
      width={width}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {[...Array(numberOfLines)].map((_, i) => (
        <Line
          key={`h-${i}`}
          x1="0"
          y1={i * 50}
          x2={width}
          y2={i * 50}
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
      ))}
      {[...Array(numberOfLines)].map((_, i) => (
        <Line
          key={`v-${i}`}
          x1={i * 50}
          y1="0"
          x2={i * 50}
          y2={height}
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
      ))}
    </Svg>
  );
};

export default GridBackground;
