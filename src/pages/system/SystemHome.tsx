import React, { useEffect, useState } from "react";
import "./SystemHome.css";

import Navbar from "../../components/system/SystemNavbar";
import VerifyToken from "../../services/verifyToken";
import Button from "../../components/system//Button";
import api from "../../services/api";

interface PropsUserAcess {
  tabelaId: number;
  usuarioAcessoId: number;
  tela: number;
  inserir: number;
  alterar: number;
  deletar: number;
  visualizar: number;
  situacao: number;
  dataCriacao: Date;
  usuarioId: number;
  tabelaNome: string;
  tabelaDirecionamento: string;
  tabelaShow: boolean;
  usuarioAcessoNome: string;
  usuarioNome: string;
}

const SystemHome = () => {
  let tokenData = VerifyToken();

  const [tableUserAcess, setTableUserAcess] = useState<PropsUserAcess[]>([]);
  const [erroServer, setErroServer] = useState("");

  useEffect(() => {
    api
      .post("usuario/useracesstable", { usuarioAcessoCodigo: tokenData?.code })
      .then((response) => {
        console.log(response.data);
        if (response.data.validation.validate) {
          setTableUserAcess(Object.values(response.data));
          setErroServer("");
        } else {
          setErroServer(`${response.data.validation.message}`);
          return;
        }
      })
      .catch((err) => {
        setErroServer(`Falha ao acessar o servidor (${err})`);
      });
  }, [tokenData?.code]);

  return (
    <>
      <section className="systemhome-container">
        <Navbar
          title="Página inicial"
          pageDirection="/systemlogin"
          userName={`${tokenData?.name} ${
            tokenData.programmer ? "/ Programador" : ""
          }`}
          erroServer={erroServer}
        />
        <div className="home-container">
          {tableUserAcess.map((data, index) => {
            return data.tela === 2 ? (
              <Button.home
                key={index}
                text={data.tabelaNome}
                type="button"
                linkTo={data.tabelaDirecionamento}
              />
            ) : (
              ""
            );
          })}
        </div>
      </section>
    </>
  );
};

export default SystemHome;
