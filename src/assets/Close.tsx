import * as React from "react";
import { FC, SVGProps } from "react";

const SvgClose: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    className="close_svg__feather close_svg__feather-x"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default SvgClose;
