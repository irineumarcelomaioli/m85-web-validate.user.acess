import React from 'react';

import Content from './Content';
import './Label.css';

interface Props{
  text?: string;
  fontSize?: string;
}

const Label: React.FC<Props> = (props) => {
  return (
    <label className='label-container'>
      <Content text={props.text} fontSize={props.fontSize} />
    </label>
  )
}

export default Label
