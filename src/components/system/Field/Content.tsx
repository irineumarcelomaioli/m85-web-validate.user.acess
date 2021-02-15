import React from 'react';
import './Content.css';

interface Props{
  text?: string;
  style?: string; // Primary, secondary, success, danger, warning, info, light, dark
  fontSize?: string; // large, medium, small, tiny
  title?: boolean;
  align?: string;
  bold?: boolean;
  background?: boolean;
}

const Content: React.FC<Props> = (props) => {
  return (
    <span
      className={`
      content-text
      content-font-${props.style} 
      content-font-size-${props.fontSize}
      ${props.title ? 'content-title' : ''}
      ${props.align ? 'content-align-' + props.align : 'content-align-left'}
      ${props.bold ? 'content-bold' : ''}
      `}>
      {props.text}
    </span>
  )
}

export default Content;
