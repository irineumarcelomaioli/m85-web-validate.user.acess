import React from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

import "./Button.css";
import Content from "./Field/Content";

interface Props {
  text?: string;
  type?: React.HTMLProps<HTMLButtonElement> | any;
  name?: string;
  id?: string;
  style?: string;
  linkTo?: string;
  onClick?: (Event: React.MouseEvent<HTMLButtonElement>) => void;
  value?: any;
  show?: boolean;
}

interface PropsAcessRelease extends Props {
  dataRegisterCode?: number;
  dataTable?: number;
  dataOption?: string;
  dataValue?: number;
  dataPosition?: number;
  icon?: any;
}

const large: React.FC<Props> = (props) => {
  return (
    <button
      type={props.type}
      className={`${
        props.show || props.show === undefined
          ? `button-container button-large button-background-${props.style}`
          : "hidden"
      }`}
      onClick={props.onClick}
      name={props.name}
      id={props.id}
      value={props.value}
    >
      <Content text={props.text} fontSize="medium" align="center" />
    </button>
  );
};

const medium: React.FC<Props> = (props) => {
  return (
    <button
      type={props.type}
      className={`${
        props.show || props.show === undefined
          ? `button-container button-medium button-background-${props.style}`
          : "hidden"
      }`}
      onClick={props.onClick}
      name={props.name}
      id={props.id}
      value={props.value}
    >
      <Content text={props.text} fontSize="small" align="center" />
    </button>
  );
};

const small: React.FC<Props> = (props) => {
  return (
    <button
      type={props.type}
      className={`${
        props.show || props.show === undefined
          ? `button-container button-small button-background-${props.style}`
          : "hidden"
      }`}
      onClick={props.onClick}
      name={props.name}
      id={props.id}
      value={props.value}
    >
      <Content text={props.text} fontSize="tiny" align="center" />
    </button>
  );
};

const tiny: React.FC<Props> = (props) => {
  return (
    <button
      type={props.type}
      className={`${
        props.show || props.show === undefined
          ? `button-container button-tiny button-background-${props.style}`
          : "hidden"
      }`}
      onClick={props.onClick}
      name={props.name}
      id={props.id}
      value={props.value}
    >
      <Content text={props.text} fontSize="tiny" align="center" />
    </button>
  );
};

const home: React.FC<Props> = (props) => {
  return (
    <Link
      to={`${props.linkTo}`}
      className={`${
        props.show || props.show === undefined ? "" : "hidden"
      } button-home-link`}
    >
      <button
        className={`button-home-container`}
        onClick={props.onClick}
        name={props.name}
        id={props.id}
      >
        <Content text={props.text} fontSize="small" align="center" />
      </button>
    </Link>
  );
};

const close: React.FC<Props> = (props) => {
  return (
    <button
      className={`${
        props.show || props.show === undefined
          ? `button-close-container button-background-${props.style}`
          : "hidden"
      }`}
      onClick={props.onClick}
      name={props.name}
      id={props.id}
    >
      <FiX />
    </button>
  );
};

const acessRelease: React.FC<PropsAcessRelease> = (props) => {
  return (
    <div
      className={`${
        props.show || props.show === undefined
          ? "button-acess-container"
          : "hidden"
      }`}
    >
      <button
        className={`${
          props.dataValue !== 0 ? "button-acess" : "button-acess-disabled"
        }`}
        type={props.type}
        onClick={props.onClick}
        name={props.name}
        id={props.id}
        data-registercode={props.dataRegisterCode}
        data-table={props.dataTable}
        data-option={props.dataOption}
        data-value={props.dataValue}
        data-position={props.dataPosition}
      >
        <div
          id={`icon-${props.id}`}
          className={
            props.dataValue === 0
              ? "icon-noAction"
              : props.dataValue === 1
              ? "icon-noRelease"
              : "icon-release"
          }
        >
          {props.icon}
        </div>
      </button>
    </div>
  );
};

export default {
  large,
  medium,
  small,
  tiny,
  home,
  close,
  acessRelease,
};
