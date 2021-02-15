import React from "react";
import "./Tooltip.css";

interface PropsTooltip {
  object: any;
  text: string;
  style?: string;
}

const Tooltip: React.FC<PropsTooltip> = (props) => {
  return (
    <div className={`tooltip`}>
      <div className={`tooltip-text tooltip-${props.style}`}>{props.text}</div>
      {props.object}
    </div>
  );
};

export default Tooltip;
