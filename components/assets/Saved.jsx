import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponentSaved = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#000"
        fillOpacity={0.54}
        d="M25 75h50a4.179 4.179 0 0 1 4.166 4.167A4.179 4.179 0 0 1 75 83.333H25a4.179 4.179 0 0 1-4.167-4.166A4.179 4.179 0 0 1 25 75Zm20.875-17.083a8.337 8.337 0 0 1-11.75-.042L25 48.75c-2.292-2.292-2.25-6 .125-8.208 2.25-2.167 5.833-2.084 8 .083L40 47.5 66.79 20.708a5.734 5.734 0 0 1 8.125 0l.167.167a5.747 5.747 0 0 1-.042 8.167L45.875 57.917Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h100v100H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponentSaved
