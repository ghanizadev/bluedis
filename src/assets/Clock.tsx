import * as React from "react";

const SvgClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="clock_svg__feather clock_svg__feather-clock"
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 6v6l4 2" />
  </svg>
);

export default SvgClock;
