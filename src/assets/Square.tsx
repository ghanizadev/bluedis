import * as React from "react";
import { FC, SVGProps } from "react";

const SvgSquare: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="square_svg__feather square_svg__feather-square"
  >
    <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
  </svg>
);

export default SvgSquare;
