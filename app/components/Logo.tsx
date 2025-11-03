import React from "react";
import styled from "styled-components";

const LogoWrapper = styled.div`
  display: inline-block;

  /* Desktop size */
  svg {
    width: 200px;
  }

  /* Mobile: reduce size at 600px */
  @media (max-width: 600px) {
    svg {
      width: 120px; /* smaller width for mobile */
    }
  }
`;

export const Logo = () => (
  <svg
    // width={size}
    // height={(size * 100) / 300} // keep proportions (curve area only ~100 tall)
    viewBox="0 40 300 100" // crop vertically to just the curve + text
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Curve path for text */}
      <path id="curve" d="M 50 120 Q 150 40 250 120" fill="transparent" />
    </defs>

    {/* Silver curve */}
    <path
      d="M 50 120 Q 150 40 250 120"
      stroke="silver"
      strokeWidth="2"
      fill="transparent"
    />

    {/* Gold text following the curve, lifted a little above */}
    <text
      fontSize="28"
      fill="#d4af37"
      fontFamily="sans-serif"
      textAnchor="middle"
      dy="-6"
    >
      <textPath href="#curve" startOffset="50%">
        HighEnd Cars
      </textPath>
    </text>

    {/* Car SVG placed below the curve */}
    <g
      transform="translate(100, 70) scale(1.1)" // position + scale car
      fill="#d4af37" // make the whole car gold
    >
      <path d="M 73.026 61.632 c -4.626 0 -8.389 -3.763 -8.389 -8.388 s 3.763 -8.388 8.389 -8.388 c 4.625 0 8.388 3.763 8.388 8.388 S 77.651 61.632 73.026 61.632 z M 73.026 47.856 c -2.972 0 -5.389 2.417 -5.389 5.388 c 0 2.971 2.417 5.388 5.389 5.388 c 2.971 0 5.388 -2.417 5.388 -5.388 C 78.414 50.273 75.997 47.856 73.026 47.856 z" />
      <path d="M 17.561 61.632 c -4.625 0 -8.388 -3.763 -8.388 -8.388 s 3.763 -8.388 8.388 -8.388 s 8.388 3.763 8.388 8.388 S 22.186 61.632 17.561 61.632 z M 17.561 47.856 c -2.971 0 -5.388 2.417 -5.388 5.388 c 0 2.971 2.417 5.388 5.388 5.388 s 5.388 -2.417 5.388 -5.388 C 22.948 50.273 20.531 47.856 17.561 47.856 z" />
      <path d="M 89.693 51.274 c -2.589 -6.317 -8.405 -10.768 -15.179 -11.615 L 54.25 37.125 c -3.872 -3.347 -8.927 -6.259 -15.056 -8.654 c -0.771 -0.302 -1.641 0.08 -1.943 0.851 c -0.302 0.771 0.08 1.642 0.851 1.943 c 4.992 1.951 9.207 4.247 12.589 6.834 c -2.125 0.696 -4.374 1.029 -6.585 0.972 l -14.129 -0.689 l -0.963 -3.386 c -0.227 -0.797 -1.058 -1.26 -1.853 -1.033 c -0.797 0.227 -1.259 1.056 -1.033 1.853 l 0.677 2.379 c -1.125 -0.104 -2.247 -0.259 -3.353 -0.477 l -8.809 -1.74 c -0.028 -0.005 -0.056 -0.004 -0.084 -0.008 c -0.062 -0.009 -0.125 -0.016 -0.189 -0.017 c -0.043 0 -0.085 0.004 -0.127 0.008 c -0.042 0.003 -0.084 0.001 -0.127 0.007 L 6 37.257 c -1.986 0.316 -3.603 1.85 -4.022 3.816 L 0.09 49.937 c -0.42 1.97 0.69 3.972 2.582 4.658 l 4.999 1.816 c -0.321 -0.999 -0.498 -2.063 -0.498 -3.167 c 0 -5.727 4.66 -10.388 10.388 -10.388 s 10.388 4.66 10.388 10.388 c 0 1.571 -0.361 3.056 -0.988 4.393 h 36.665 c -0.627 -1.336 -0.988 -2.821 -0.988 -4.393 c 0 -5.727 4.66 -10.388 10.389 -10.388 c 5.727 0 10.388 4.66 10.388 10.388 c 0 1.432 -0.292 2.798 -0.818 4.041 l 3.763 -0.409 c 1.286 -0.139 2.403 -0.856 3.065 -1.967 C 90.086 53.797 90.184 52.473 89.693 51.274 z" />
    </g>
  </svg>
);

export default function HeaderLogo() {
  return (
    <LogoWrapper>
      <Logo />
    </LogoWrapper>
  );
}
