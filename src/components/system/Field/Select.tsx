import React from "react";

import "./Select.css";

interface PropsOption {
  value: any;
  description: string;
}

interface Props {
  name: string;
  id?: string;
  placeholder?: string;
  register?: any;
  option?: PropsOption[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: any;
  disable?: boolean;
  textTransform?: string; //uppercase;lowercase;capitalize;
}

const Select: React.FC<Props> = (props) => {
  return (
    <select
      className={`select-container text-${props.textTransform}`}
      name={props.name}
      id={props.id}
      ref={props.register}
      onChange={props.onChange}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue ? props.defaultValue : ""}
      disabled={props.disable ? props.disable : false}
    >
      {!props.defaultValue ? (
        <option disabled value="">
          {props.placeholder}
        </option>
      ) : (
        ""
      )}
      {props.option?.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {option.description}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
