import * as React from "react";
import { FC, SVGProps } from "react";

const SvgMinus: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    className="minus_svg__feather minus_svg__feather-minus"
  >
    <path d="M5 12h14" />
  </svg>
);

export default SvgMinus;
