import React from "react";

import "./Field.css";
import Label from "./Label";
import Input from "./Input";
import Select from "./Select";
import Content from "./Content";

interface PropsOption {
  value: any;
  description: string;
}

interface Props {
  direction?: string; //column;row;
  label?: string;
  type?: string;
  name: string;
  nameDescription?: string;
  id?: string;
  placeholder?: string;
  register?: any;
  onChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocusSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  option?: PropsOption[];
  defaultValue?: any;
  defaultValueDescription?: any;
  disable?: boolean;
  error?: string;
  textTransform?: string; //uppercase;lowercase;capitalize;
}

interface PropsField {
  direction?: string; //column;row;
  label?: string;
  type?: string;
  name: string;
  id?: string;
  placeholder?: string;
  register?: any;
  defaultValue?: any;
  disable?: boolean;
  error?: string;
  textTransform?: string; //uppercase;lowercase;capitalize;
}

interface PropsInput extends PropsField {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface PropsSelect extends PropsField {
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  option?: PropsOption[];
}

interface PropsComposite extends PropsField {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nameDescription?: string;
  defaultValueDescription?: any;
}

const Text: React.FC<PropsInput> = (props) => {
  return (
    <div
      className={`field-container field-direction-${
        props.direction ? props.direction : "column"
      }`}
    >
      <div
        className={`field-label ${
          props.direction === "row" ? "field-label-row" : ""
        }`}
      >
        <Label text={props.label} fontSize="tiny"></Label>
      </div>
      <div
        className={`field-input ${
          props.direction === "row" ? "field-input-row" : ""
        }`}
      >
        <Input
          type={props.type ? props.type : "text"}
          name={props.name}
          id={props.id}
          register={props.register}
          onChange={props.onChange}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          disable={props.disable}
          textTransform={props.textTransform}
        />
        {props.error ? (
          <div className="field-input-error">
            <Content
              text={props.error}
              style="danger"
              fontSize="tiny"
              bold={true}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const SelectOption: React.FC<PropsSelect> = (props) => {
  return (
    <div
      className={`field-container field-direction-${
        props.direction ? props.direction : "column"
      }`}
    >
      <div
        className={`field-label ${
          props.direction === "row" ? "field-label-row" : ""
        }`}
      >
        <Label text={props.label} fontSize="tiny"></Label>
      </div>
      <div
        className={`field-input ${
          props.direction === "row" ? "field-select-row" : ""
        }`}
      >
        <Select
          name={props.name}
          id={props.id}
          register={props.register}
          onChange={props.onChange}
          placeholder={props.placeholder}
          option={props.option}
          defaultValue={props.defaultValue}
          disable={props.disable}
          textTransform={props.textTransform}
        />
        {props.error ? (
          <div className="field-input-error">
            <Content
              text={props.error}
              style="danger"
              fontSize="tiny"
              bold={true}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const Composite: React.FC<PropsComposite> = (props) => {
  return (
    <div
      className={`field-container field-direction-${
        props.direction ? props.direction : "column"
      }`}
    >
      <div
        className={`field-label ${
          props.direction === "row" ? "field-composite-label-row" : ""
        }`}
      >
        <Label text={props.label} fontSize="tiny"></Label>
      </div>
      <div className="field-input">
        <div className="field-composite">
          <div className="field-composite-code">
            <Input
              type={props.type ? props.type : "text"}
              name={props.name}
              id={props.id}
              register={props.register}
              onChange={props.onChange}
              placeholder={props.placeholder}
              defaultValue={props.defaultValue}
              disable={props.disable}
              textTransform={props.textTransform}
            />
          </div>
          <div className="field-composite-description">
            <Input
              type="text"
              name={`${props.nameDescription}`}
              register={props.register}
              defaultValue={props.defaultValueDescription}
              disable={true}
              textTransform={props.textTransform}
            />
          </div>
        </div>
        {props.error ? (
          <div className="field-input-error">
            <Content
              text={props.error}
              style="danger"
              fontSize="tiny"
              bold={true}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

let Field = {
  Text,
  SelectOption,
  Composite,
};

export default Field;
