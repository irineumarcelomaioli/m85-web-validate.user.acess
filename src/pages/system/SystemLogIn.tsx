import React, { useState } from "react";
import "./SystemLogIn.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import schema from "../../validation/login.validation";
import api from "../../services/api";

import Content from "../../components/system/Field/Content";
import Field from "../../components/system/Field/Field";
import Button from "../../components/system/Button";

interface PropsInput {
  email: string;
  senha: string;
}

function Login() {
  const { register, handleSubmit, errors } = useForm<PropsInput>({
    resolver: yupResolver(schema),
  });

  const [serverErrors, setServerErrors] = useState({
    emailMessage: "",
    senhaMessage: "",
    servidorMessage: "",
  });

  const onSubmit = async (FormData: PropsInput) => {
    await api
      .post("usuario/authenticate", FormData)
      .then((response) => {
        console.log(response.data);
        if (!response.data.auth) {
          if (
            !response.data?.email?.validation.validate &&
            response.data.email
          ) {
            setServerErrors({
              ...serverErrors,
              emailMessage: response.data.email.validation.message
                ? response.data.email.validation.message
                : "",
            });
          }
          if (
            !response.data?.senha?.validation.validate &&
            response.data.senha
          ) {
            setServerErrors({
              ...serverErrors,
              senhaMessage: response.data.senha.validation.message
                ? response.data.senha.validation.message
                : "",
            });
          }
        } else {
          localStorage.setItem("@m85.tech:token", response.data.token);
          window.location.replace("/systemhome");
        }
      })
      .catch((err) => {
        setServerErrors({
          ...serverErrors,
          senhaMessage: `Falha no servidor. (${err})`,
        });
        return;
      });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fieldMessage = `${event.currentTarget.name}Message`;
    setServerErrors({ ...serverErrors, [fieldMessage]: "" });
  };

  return (
    <section className="system-login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="system-login-form">
        <img
          src={process.env.PUBLIC_URL + "/images/store.web.png"}
          alt="Logo"
          className="system-login-logo"
        />
        <Content
          text="Login"
          style="dark"
          fontSize="large"
          title={true}
          align="center"
        />
        <div className="system-login-form-input">
          <Field.Text
            label="E-mail"
            type="text"
            name="email"
            id="email"
            register={register}
            onChange={onChange}
            textTransform="lowercase"
          />
          <Content
            text={errors.email?.message || serverErrors.emailMessage}
            style="danger"
            fontSize="tiny"
            bold={true}
          />
          <Field.Text
            label="Senha"
            type="password"
            name="senha"
            id="senha"
            register={register}
            onChange={onChange}
            textTransform="uppercase"
          />
          <Content
            text={errors.senha?.message || serverErrors.senhaMessage}
            style="danger"
            fontSize="tiny"
            bold={true}
          />
        </div>
        <div className="system-login-form-button">
          <Button.large text="Entrar" type="submit" style="dark" />
        </div>
      </form>
      <Content
        text={serverErrors.servidorMessage}
        style="danger"
        fontSize="tiny"
        bold={true}
      />
    </section>
  );
}

export default Login;
