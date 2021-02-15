import React from "react";

import "./Input.css";

interface Props {
  type: string;
  name: string;
  id?: string;
  placeholder?: string;
  register?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  disable?: boolean;
  textTransform?: string; //uppercase;lowercase;capitalize;
}

const Input: React.FC<Props> = (props) => {
  return (
    <input
      className={`input-container text-${props.textTransform}`}
      type={props.type}
      name={props.name}
      id={props.id}
      ref={props.register}
      onChange={props.onChange}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      disabled={props.disable ? props.disable : false}
    />
  );
};

export default Input;
