// Library
import React, { MouseEvent, ChangeEvent, useEffect, useState } from "react";
import ReactDom from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

// icons
import { CgCheckR, CgCloseR } from "react-icons/cg";
import {
  RiLightbulbLine,
  RiLightbulbFlashFill,
  RiLightbulbFlashLine,
} from "react-icons/ri";

// Extension
import "./Usuario.css";
import api from "../../services/api";
import VerifyToken from "../../services/verifyToken";
import Navbar from "../../components/system/SystemNavbar";
import Field from "../../components/system/Field/Field";
import Button from "../../components/system/Button";
import Tooltip from "../../components/system/Tooltip";
import Content from "../../components/system/Field/Content";

// Interface
interface PropsTable {
  codigo: number;
  nome: string;
  email: string;
  senha: string;
  programador: boolean;
  situacao: number;
  dataCriacao: Date;
  usuarioCodigo: number;
  usuarioNome: string;
}

interface PropsTabela {
  codigo: number;
  nome: string;
  direcionamento: string;
  tela: boolean;
  inserir: boolean;
  alterar: boolean;
  deletar: boolean;
  visualizar: boolean;
  acessar: boolean;
  show: boolean;
  situacao: number;
  dataCriacao: Date;
  usuarioCodigo: number;
}

interface PropsTabelaUsuario {
  codigo: number;
  tabelaCodigo: number;
  usuarioAcessoCodigo: number;
  tela: number;
  inserir: number;
  alterar: number;
  deletar: number;
  visualizar: number;
  acessar: number;
  situacao: number;
  dataCriacao: Date;
  usuarioCodigo: number;
  usuarioNome: string;
  tabelaNome: string;
  tabelaShow: boolean;
  usuarioAcessoNome: string;
}

const Usuario = () => {
  // START->VERIFY->ACCESS
  let tokenData = VerifyToken();
  const [buttonEnabled, setButtonEnabled] = useState({
    inserir: false,
    visualizar: false,
    alterar: false,
    deletar: false,
    acessar: false,
  });
  // END->VERIFY->ACCESS
  const [erroServer, setErroServer] = useState("");

  // START->SEARCH->TABLE
  const [tableData, setTableData] = useState<PropsTable[]>([]);
  const [dadoTabela, setDadoTabela] = useState<PropsTabela[]>([]);
  const [dadoTabelaUsuario, setDadoTabelaUsuario] = useState<
    PropsTabelaUsuario[]
  >([]);

  const [acessReleaseCode, setAcessReleaseCode] = useState("");
  const [acessSubmit, setAcessSubmit] = useState<any[]>([]);

  const [fieldSearch, setFieldSearch] = useState({
    field: "nome",
    value: "",
    anywhere: false,
  });

  const [formMessage, setFormMessage] = useState({
    message: <></>,
    style: "",
    show: false,
  });

  const handleInputSearch = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();
    const { name, value } = event.target;

    if (name === "searchOption") {
      setFieldSearch({ ...fieldSearch, field: `${value}` });
    } else if (name === "searchText") {
      setFieldSearch({ ...fieldSearch, value });
    } else if (name === "anywhere") {
      setFieldSearch({
        ...fieldSearch,
        anywhere: value === "0" ? false : true,
      });
    }
  };

  const handleChangeField = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();
    setFormMessage({ ...formMessage, message: <></>, style: "", show: false });
    let { name } = event.currentTarget;
    setFormUpdate({ ...formUpdate, [name]: true });
  };

  const handleChangeAcessRelease = (event: MouseEvent<HTMLButtonElement>) => {
    setFormMessage({
      message: <></>,
      show: false,
      style: "",
    });

    let fieldOption: any = event.currentTarget.dataset.option;
    let fieldId = event.currentTarget.id;
    let fieldValue: any = event.currentTarget.dataset.value;
    let tableCode = Number(event.currentTarget.dataset.table);
    let registerCode = event.currentTarget.dataset.registercode;

    if (fieldValue === "0") {
      return;
    }

    let node = document.getElementById(`${fieldId}-icon`);

    if (node?.parentNode) {
      node.parentNode.removeChild(node);
    }

    if (fieldValue === "1") {
      document.getElementById(fieldId)?.setAttribute("data-value", "2");
      ReactDom.render(
        <RiLightbulbFlashFill className="icon-release" />,
        document.getElementById(`icon-${fieldId}`)
      );
    } else if (fieldValue === "2") {
      document.getElementById(fieldId)?.setAttribute("data-value", "1");
      ReactDom.render(
        <RiLightbulbFlashLine className="icon-noRelease" />,
        document.getElementById(`icon-${fieldId}`)
      );
    }

    setAcessSubmit([
      ...acessSubmit,
      {
        codigo: registerCode,
        tabelaCodigo: tableCode,
        fieldOption: {
          field: fieldOption,
          value: fieldValue === "1" ? "2" : "1",
        },
        usuarioAcessoCodigo: Number(getValues("usuarioAcessoCodigo")),
        situacao: 1,
        dataCriacao: new Date(),
        usuarioCodigo: tokenData.code,
      },
    ]);
  };

  useEffect(() => {
    // tabelaCodigo = 1 - USUÁRIO.
    if (tokenData.code) {
      let dataSearch: any = {
        data: {
          tabelaCodigo: 1, // 1 - USUÁRIO
          usuarioAcessoCodigo: tokenData.code,
        },
        anywhere: false,
      };
      api.post(`tabelausuario/index`, dataSearch).then((response) => {
        if (response.data.validation.validate) {
          if (Object(response.data)[0].tela !== 2) {
            window.location.replace("/systemhome");
          }
          setButtonEnabled({
            inserir: Object(response.data)[0].inserir === 2 ? true : false,
            visualizar:
              Object(response.data)[0].visualizar === 2 ? true : false,
            alterar: Object(response.data)[0].alterar === 2 ? true : false,
            deletar: Object(response.data)[0].deletar === 2 ? true : false,
            acessar: Object(response.data)[0].acessar === 2 ? true : false,
          });
          setErroServer("");
        } else {
          setErroServer(
            response.data.validation.message + tokenData.programmer
              ? `(tabelausuario/index -> ${response.data.validation.pathway})`
              : ""
          );
        }
      });
    } else {
      setErroServer(`
        "Carregando configuração..." (${
          tokenData.programmer ? "tabelausuario/index" : ""
        })`);
    }
  }, [tokenData]);

  useEffect(() => {
    if (!fieldSearch.value) {
      api
        .post("usuario/index")
        .then((response) => {
          if (response.data.validation.validate) {
            setTableData(Object.values(response.data));
            setErroServer("");
          } else {
            setErroServer(
              response.data.validation.message + tokenData.programmer
                ? `(usuario/index -> ${response.data.validation.pathway})`
                : ""
            );
          }
        })
        .catch((err) => {
          setErroServer(
            `Falha de comunicação com o servidor (${
              tokenData.programmer ? err : "Entre em contato com o suporte."
            })` + tokenData.programmer
              ? "(usuario/index)"
              : ""
          );
        });
    } else {
      let dataSearch: any = {
        data: {
          [fieldSearch.field]: fieldSearch.value,
        },
        anywhere: fieldSearch.anywhere,
      };
      api
        .post(`usuario/index`, dataSearch)
        .then((response) => {
          setTableData(Object.values(response.data));
          if (response.data.validation.validate) {
            setErroServer("");
          }
        })
        .catch((err) => {
          setErroServer(
            `Falha de comunicação com o servidor (${
              tokenData.programmer ? err : "Entre em contato com o suporte."
            })` + tokenData.programmer
              ? "(usuario/index)"
              : ""
          );
        });
    }
  }, [fieldSearch]);

  useEffect(() => {
    if (dadoTabela[0] === undefined) {
      api
        .get("generic/index/tabela")
        .then((response) => {
          if (response.data.validation.validate) {
            setDadoTabela(Object.values(response.data));
            setErroServer("");
          } else {
            setErroServer(
              response.data.validation.message + tokenData.programmer
                ? `(generic/index/tabela -> ${response.data.validation.pathway}`
                : ""
            );
          }
        })
        .catch((err) => {
          setErroServer(
            `Falha de comunicação com o servidor (${
              tokenData.programmer
                ? `generic/index/tabela -> ` + err
                : "Entre em contato com o suporte."
            })`
          );
        });
    }
  }, []);

  useEffect(() => {
    if (acessReleaseCode !== "") {
      let dataSearch: any = {
        data: { usuarioAcessoCodigo: acessReleaseCode },
      };
      api
        .post(`tabelausuario/index`, dataSearch)
        .then((response) => {
          if (response.data.validation.validate) {
            setDadoTabelaUsuario(Object.values(response.data));
            setErroServer("");
          } else {
            setErroServer(
              response.data.validation.message + tokenData.programmer
                ? " tabelausuario/index ->" + response.data.validation.pathway
                : ""
            );
          }
        })
        .catch((err) => {
          setErroServer(
            `Falha de comunicação com o servidor 
            (${
              tokenData.programmer
                ? "tabelausuario/index->" + err
                : "Entre em contato com o suporte."
            })`
          );
        });
    }
  }, [acessReleaseCode]);

  // END->SEARCH->TABLE

  // START->SUBMIT
  // START->SUBMIT->VALIDATION
  const schema = yup.object().shape({
    nome: yup.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
    email: yup
      .string()
      .required("Informe um e-mail válido. (Ex.: nome_email@dominio.com)")
      .email("Informe um e-mail válido. (Ex.: nome_email@dominio.com)"),
    senha: yup.string().min(6, "A Senha deve ter no mínimo 6 caracteres"),
  });
  // END->SUBMIT->VALIDATION

  const [formAction, setFormAction] = useState("");

  // START->UPDATE->MODAL
  const [formUpdate, setFormUpdate] = useState({
    nome: false,
    email: false,
    senha: false,
    programador: false,
    situacao: false,
  });
  // END->UPDATE->MODAL

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    errors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    setFormMessage({
      message: <></>,
      show: false,
      style: "",
    });

    let dataSubmit: any;

    if (formAction === "insert") {
      dataSubmit = {
        nome: getValues("nome").toUpperCase(),
        email: getValues("email"),
        senha: getValues("senha"),
        programador: getValues("programador"),
        dataCriacao: Date,
        usuarioCodigo: getValues("usuarioCodigo"),
      };

      await api
        .post("usuario/insert", dataSubmit)
        .then((response) => {
          if (response.data.validation.validate) {
            dadoTabela.map((data) => {
              dataSubmit = "";
              if (data.codigo) {
                dataSubmit = {
                  tabelaCodigo: data.codigo,
                  usuarioAcessoCodigo: response.data.codigo,
                  tela: data.tela,
                  inserir: data.inserir,
                  alterar: data.alterar,
                  deletar: data.deletar,
                  visualizar: data.visualizar,
                  acessar: data.acessar,
                  usuarioCodigo: tokenData.code,
                };
              }
              if (dataSubmit.tabelaCodigo !== undefined) {
                api
                  .post("tabelausuario/insert", dataSubmit)
                  .then((response) => {
                    if (response.data.validation.validate) {
                      setFormMessage({
                        message: (
                          <span> {response.data.validation.message} </span>
                        ),
                        show: true,
                        style: "success",
                      });
                    } else {
                      api.delete(
                        `generic/delete/usuario?codigo=${response.data.codigo}`
                      );
                      setFormMessage({
                        message: (
                          <span>
                            {response.data.validation.message} <br />
                            {tokenData.programmer
                              ? "tabelausuario/insert->" +
                                response.data.validation.pathway
                              : ""}
                          </span>
                        ),
                        show: true,
                        style: "danger",
                      });
                    }
                  })
                  .catch((err) => {
                    setFormMessage({
                      message: (
                        <span>
                          Falha ao gravar o registro. <br />
                          {tokenData.programmer
                            ? err
                            : "Entre em contato com o suporte."}
                        </span>
                      ),
                      show: true,
                      style: "dark",
                    });
                    return;
                  });
              }
            });
            setFieldSearch({ ...fieldSearch, anywhere: false });
            reset();
          } else {
            setFormMessage({
              message: (
                <span>
                  {response.data.email.validation.message} <br />
                  {tokenData.programmer
                    ? "usuario/insert"
                    : "Entre em contato com o suporte."}
                </span>
              ),
              show: true,
              style: "danger",
            });
            return;
          }
        })
        .catch((err) => {
          setFormMessage({
            message: (
              <span>
                Falha ao gravar o registro. <br />{" "}
                {tokenData.programmer ? err : "Entre em contato com o suporte."}
              </span>
            ),
            show: true,
            style: "dark",
          });
          return;
        });
    } else if (formAction === "update") {
      dataSubmit = { ...dataSubmit, codigo: getValues("codigo") };
      if (formUpdate.nome) {
        dataSubmit = { ...dataSubmit, nome: getValues("nome") };
      }
      if (formUpdate.email) {
        dataSubmit = { ...dataSubmit, email: getValues("email") };
      }
      if (formUpdate.senha) {
        dataSubmit = { ...dataSubmit, senha: getValues("senha") };
      }
      if (formUpdate.programador) {
        dataSubmit = { ...dataSubmit, programador: getValues("programador") };
      }
      if (formUpdate.situacao) {
        dataSubmit = { ...dataSubmit, situacao: getValues("situacao") };
      }

      await api
        .put("usuario/update", dataSubmit)
        .then((response) => {
          console.log(response.data);
          if (response.data.validation.validate) {
            setFormMessage({
              message: <span> {response.data.validation.message} </span>,
              show: true,
              style: "success",
            });
            setFieldSearch({ ...fieldSearch, anywhere: false });
          } else {
            setFormMessage({
              message: (
                <span>
                  {response.data.validation.message} <br />
                  {tokenData.programmer
                    ? "usuario/update->" + response.data.validation.pathway
                    : ""}
                </span>
              ),
              show: true,
              style: "danger",
            });
            return;
          }
        })
        .catch((err) => {
          console.log("erro server update");
          setFormMessage({
            message: (
              <span>
                Falha ao alterar o registro. <br />
                {tokenData.programmer ? err : "Entre em contato com o suporte."}
              </span>
            ),
            show: true,
            style: "dark",
          });
          return;
        });
    } else if (formAction === "delete") {
      await api
        .delete(`generic/delete/usuario?codigo=${getValues("codigo")}`)
        .then((response) => {
          if (response.data.validation.validate) {
            setFormMessage({
              message: <span> {response.data.validation.message}</span>,
              show: true,
              style: "success",
            });
            reset();
          } else {
            setFormMessage({
              message: (
                <span>
                  {response.data.validation.message} <br />
                  <br />
                  {tokenData.programmer
                    ? `(generic/delete/usuario->${response.data.validation.erro})`
                    : ""}
                </span>
              ),
              show: true,
              style: "danger",
            });
            return;
          }
        })
        .catch((err) => {
          setFormMessage({
            message: (
              <span>
                Falha ao deletar o registro. <br />
                {tokenData.programmer ? err : "Entre em contato com o suporte."}
              </span>
            ),
            show: true,
            style: "dark",
          });
          return;
        });
    } else if (formAction === "acessRelease") {
      acessSubmit.map((acess) => {
        dataSubmit = {
          codigo: acess.codigo,
          tabelaCodigo: acess.tabelaCodigo,
          [acess.fieldOption.field]: acess.fieldOption.value,
          usuarioAcessoCodigo: acess.usuarioAcessoCodigo,
          situacao: acess.situacao,
          dataCriacao: acess.dataCriacao,
          usuarioCodigo: acess.usuarioCodigo,
        };

        api
          .put("tabelausuario/update", dataSubmit)
          .then((response) => {
            if (response.data.validation.validate) {
              setAcessReleaseCode(getValues("usuarioAcessoCodigo"));
              setFormMessage({
                message: <span> {response.data.validation.message} </span>,
                show: true,
                style: "success",
              });
            } else {
              setFormMessage({
                message: (
                  <span>
                    {response.data.validation.message} <br />
                    {tokenData.programmer
                      ? "tabelausuario/update->" +
                        response.data.validation.pathway
                      : "Entre em contato com o suporte"}
                  </span>
                ),
                show: true,
                style: "danger",
              });
            }
          })
          .catch((err) => {
            setFormMessage({
              message: (
                <span>
                  Falha de comunicação com o servidor. <br />
                  {tokenData.programmer
                    ? err
                    : "Entre em contato com o suporte."}
                </span>
              ),
              show: true,
              style: "dark",
            });
            setErroServer(
              `Falha de comunicação com o servidor. (${
                tokenData.programmer ? err : "Entre em contato com o suporte."
              })`
            );
            return;
          });
      });
    }

    setFieldSearch({ ...fieldSearch, anywhere: false });
  };

  // END->SUBMIT

  // START->CUSTOMER->MODAL
  const [modalShow, setModalShow] = useState(false);
  const [modalFormActionShow, setModalFormActionShow] = useState(false);
  const [modalStyle, setModalStyle] = useState("");
  const [formFieldShow, setFormFieldShow] = useState({
    codigo: false,
    nome: false,
    email: false,
    senha: false,
    programador: false,
    situacao: false,
    dataCriacao: false,
    usuarioCodigo: false,
    usuarioAcessoCodigo: false,
  });

  const [formFieldDisable, setFormFieldDisable] = useState({
    codigo: false,
    nome: false,
    email: false,
    senha: false,
    programador: false,
    situacao: false,
    dataCriacao: false,
    usuarioCodigo: false,
    usuarioAcessoCodigo: false,
  });

  const [modalConfig, setModalConfig] = useState({
    modalTitle: "",
    btnText: "",
    btnShow: false,
    btnName: "",
  });

  const [modalDefault] = useState({
    style: modalStyle,
    formFieldShow: { ...formFieldShow },
    formFieldDisable: { ...formFieldDisable },
    config: { ...modalConfig },
    acessSubmit: { ...acessSubmit },
  });

  const handleModalConfig = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let { name, textContent, value } = event.currentTarget;

    setModalFormActionShow(true);
    if (name === "acessRelease") {
      setModalFormActionShow(false);
    }

    setFormAction(name);
    if (name !== "insert") {
      let dataTable: PropsTable = JSON.parse(value);
      setValue("codigo", dataTable.codigo);
      setValue("nome", dataTable.nome);
      setValue("email", dataTable.email);
      setValue("senha", dataTable.senha);
      setValue("programador", dataTable.programador);
      setValue("situacao", dataTable.situacao);
      setValue(
        "dataCriacao",
        moment(dataTable.dataCriacao)
          .locale("pt-br")
          .format("DD/MM/YYYY, hh:mm:ss a")
      );
      setValue("usuarioCodigo", Number(dataTable.usuarioCodigo));
      setValue("usuarioNome", dataTable.usuarioNome);

      setValue("usuarioAcessoCodigo", dataTable.codigo);
      setValue("usuarioAcessoNome", dataTable.nome);
    } else {
      reset();
      setValue("programador", "0");
      setValue("situacao", "1");
      setValue("usuarioCodigo", Number(tokenData.code));
      setValue("usuarioNome", tokenData.name);
      setValue("dataCriacao", Date);
    }

    setFormMessage({ ...formMessage, message: <></>, show: false, style: "" });
    setModalShow(true);
    setModalStyle(modalDefault.style);
    setModalConfig({ ...modalDefault.config });
    setFormFieldShow({ ...modalDefault.formFieldShow });
    setFormFieldDisable({ ...modalDefault.formFieldDisable });

    if (name === "insert") {
      setModalStyle("success");
      setModalConfig({
        ...modalDefault.config,
        modalTitle: String(textContent),
        btnText: "Gravar",
        btnShow: true,
        btnName: name,
      });
      setFormFieldShow({
        ...modalDefault.formFieldShow,
        nome: true,
        email: true,
        senha: true,
        programador: Boolean(tokenData?.programmer) ? true : false,
      });
      setFormFieldDisable({ ...modalDefault.formFieldDisable });
      //
    } else if (name === "view") {
      setModalStyle("info");
      setModalConfig({
        ...modalDefault.config,
        modalTitle: `${String(textContent)} Registro`,
        btnShow: false,
        btnName: name,
      });
      setFormFieldShow({
        ...modalDefault.formFieldShow,
        codigo: true,
        nome: true,
        email: true,
        programador: Boolean(tokenData?.programmer) ? true : false,
        situacao: true,
        dataCriacao: true,
        usuarioCodigo: true,
      });
      setFormFieldDisable({
        ...modalDefault.formFieldDisable,
        codigo: true,
        nome: true,
        email: true,
        programador: true,
        situacao: true,
        dataCriacao: true,
        usuarioCodigo: true,
      });
      //
    } else if (name === "update") {
      setModalStyle("warning");
      setModalConfig({
        ...modalDefault.config,
        modalTitle: `${String(textContent)} Registro`,
        btnText: String(textContent),
        btnShow: true,
        btnName: name,
      });
      setFormFieldShow({
        ...modalDefault.formFieldShow,
        codigo: true,
        nome: true,
        email: true,
        senha: true,
        programador: tokenData?.programmer ? true : false,
        situacao: true,
      });
      setFormFieldDisable({ ...modalDefault.formFieldDisable, codigo: true });
    } else if (name === "delete") {
      setModalStyle("danger");
      setModalConfig({
        ...modalDefault.config,
        modalTitle: `${String(textContent)} Registro`,
        btnText: String(textContent),
        btnShow: true,
        btnName: name,
      });
      setFormFieldShow({
        ...modalDefault.formFieldShow,
        codigo: true,
        nome: true,
      });
      setFormFieldDisable({
        ...modalDefault.formFieldDisable,
        codigo: true,
        nome: true,
      });
    } else if (name === "acessRelease") {
      setModalStyle("secondary");
      setModalConfig({
        ...modalDefault.config,
        modalTitle: String(textContent),
        btnText: "Liberar Acesso",
        btnShow: true,
        btnName: name,
      });
      setFormFieldShow({
        ...modalDefault.formFieldShow,
        usuarioAcessoCodigo: true,
      });
      setFormFieldDisable({
        ...modalDefault.formFieldDisable,
        usuarioAcessoCodigo: true,
      });
      setAcessReleaseCode(getValues("usuarioAcessoCodigo"));
    }
  };
  // END->CUSTOMER->MODAL

  return (
    <section>
      <Navbar
        title="Usuário"
        pageDirection="/systemhome"
        userName={`${tokenData?.name} ${
          tokenData.programmer ? "/ Programador" : ""
        }`}
        erroServer={erroServer}
      />
      <div className="usuario-container">
        <div className="usuario-search-container">
          <div className="usuario-search-field-option">
            <Field.SelectOption
              type="text"
              name="searchOption"
              label="Opção de pesquisa"
              onChange={handleInputSearch}
              option={[
                { value: "nome", description: "Nome" },
                { value: "email", description: "E-mail" },
              ]}
              defaultValue="nome"
            />
          </div>
          <div className="usuario-search-field-anywhere">
            <Field.SelectOption
              type="text"
              name="anywhere"
              label="Em qualquer parte"
              onChange={handleInputSearch}
              option={[
                { value: "0", description: "Não" },
                { value: "1", description: "Sim" },
              ]}
              defaultValue={"0"}
            />
          </div>
          <div className="usuario-search-field-text">
            <Field.Text
              type="text"
              name="searchText"
              label="Pesquisar por"
              onChange={handleInputSearch}
              placeholder="Digite sua pesquisa aqui"
            />
          </div>
          <div className={`usuario-search-button-insert`}>
            <Button.small
              type="button"
              style={"success"}
              text="Novo Registro"
              name="insert"
              id="insert"
              onClick={handleModalConfig}
              show={buttonEnabled.inserir}
            />
          </div>
        </div>
        <div className="usuario-table-container">
          <table className="table-data">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Situação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => {
                let icon =
                  data.situacao === 1 ? (
                    <CgCheckR className="icon-active" />
                  ) : data.situacao === 2 ? (
                    <CgCloseR className="icon-inactive" />
                  ) : (
                    ""
                  );

                let iconTooltipText =
                  data.situacao === 1
                    ? "ATIVO"
                    : data.situacao === 2
                    ? "INATIVO"
                    : "";

                let iconTooltipStyle =
                  data.situacao === 1
                    ? "success"
                    : data.situacao === 2
                    ? "danger"
                    : "";
                if (
                  data.codigo &&
                  (!data.programador || tokenData.programmer)
                ) {
                  return (
                    <tr
                      key={index}
                      data-datatable={data}
                      id={"row-" + data.codigo}
                    >
                      <td>{data.codigo}</td>
                      <td>{data.nome.toUpperCase()}</td>
                      <td>{data.email.toLowerCase()}</td>
                      <td className="table-icon">
                        <Tooltip
                          object={icon}
                          text={iconTooltipText}
                          style={iconTooltipStyle}
                        />
                      </td>
                      <td className="table-button">
                        <div className={`table-button-container`}>
                          <Button.tiny
                            type="button"
                            style="info"
                            text="Visualizar"
                            onClick={handleModalConfig}
                            name="view"
                            id="view"
                            value={JSON.stringify(data)}
                            show={buttonEnabled.visualizar}
                          />
                          <Button.tiny
                            type="button"
                            style="warning"
                            text="Alterar"
                            onClick={handleModalConfig}
                            name="update"
                            id="update"
                            value={JSON.stringify(data)}
                            show={buttonEnabled.alterar}
                          />
                          <Button.tiny
                            type="button"
                            style="danger"
                            text="Excluir"
                            onClick={handleModalConfig}
                            name="delete"
                            id="delete"
                            value={JSON.stringify(data)}
                            show={buttonEnabled.deletar}
                          />
                          <Button.tiny
                            type="button"
                            style="secondary"
                            text="Liberar Acesso"
                            onClick={handleModalConfig}
                            name="acessRelease"
                            id="acessRelease"
                            value={JSON.stringify(data)}
                            show={buttonEnabled.acessar}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`modal-container ${
          modalShow ? "modal-container-show" : "modal-container-hidden"
        }`}
      >
        <div className="modal-content">
          <div className={`modal-header background-${modalStyle}`}>
            <div className="modal-header-title">
              <Content
                text={modalConfig.modalTitle}
                fontSize="medium"
                title={true}
                align="left"
              />
            </div>
            <div className="modal-header-close">
              <Button.close
                style={modalStyle}
                onClick={() => setModalShow(false)}
              />
            </div>
          </div>
          <div className="modal-body">
            <form
              className={`modal-form-container modal-form-action-${
                modalFormActionShow ? "show" : "hidden"
              }`}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div
                className={`modal-form-field-${
                  formFieldShow.codigo ? "show" : "hidden"
                }`}
              >
                <Field.Text
                  type="text"
                  name="codigo"
                  id="codigo"
                  label="Código"
                  direction="row"
                  disable={formFieldDisable.codigo}
                  register={register}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.nome ? "show" : "hidden"
                }`}
              >
                <Field.Text
                  type="text"
                  name="nome"
                  id="nome"
                  label="Nome"
                  direction="row"
                  disable={formFieldDisable.nome}
                  register={register}
                  error={errors.nome?.message}
                  textTransform="uppercase"
                  onChange={handleChangeField}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.email ? "show" : "hidden"
                }`}
              >
                <Field.Text
                  type="text"
                  name="email"
                  id="email"
                  label="E-mail"
                  direction="row"
                  disable={formFieldDisable.email}
                  register={register}
                  error={errors.email?.message}
                  textTransform="lowercase"
                  onChange={handleChangeField}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.senha ? "show" : "hidden"
                }`}
              >
                <Field.Text
                  type="password"
                  name="senha"
                  id="senha"
                  label="Senha"
                  direction="row"
                  disable={formFieldDisable.senha}
                  register={register}
                  error={errors.senha?.message}
                  textTransform="uppercase"
                  onChange={handleChangeField}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.programador ? "show" : "hidden"
                }`}
              >
                <Field.SelectOption
                  name="programador"
                  id="programador"
                  label="Programador"
                  direction="row"
                  placeholder={"Selecione uma opção..."}
                  option={[
                    { value: "0", description: "NÃO" },
                    { value: "1", description: "SIM" },
                  ]}
                  defaultValue={"0"}
                  disable={formFieldDisable.programador}
                  register={register}
                  error={errors.programador?.message}
                  onChange={handleChangeField}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.situacao ? "show" : "hidden"
                }`}
              >
                <Field.SelectOption
                  type="text"
                  name="situacao"
                  id="situacao"
                  label="Situação"
                  direction="row"
                  placeholder={"Selecione uma opção..."}
                  option={[
                    { value: "1", description: "ATIVO" },
                    { value: "2", description: "INATIVO" },
                  ]}
                  defaultValue={"1"}
                  disable={formFieldDisable.situacao}
                  register={register}
                  error={errors.situacao?.message}
                  onChange={handleChangeField}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.dataCriacao ? "show" : "hidden"
                }`}
              >
                <Field.Text
                  type="text"
                  name="dataCriacao"
                  id="dataCriacao"
                  label="Data Criação"
                  direction="row"
                  disable={formFieldDisable.dataCriacao}
                  register={register}
                  error={errors.dataCriacao?.message}
                />
              </div>
              <div
                className={`modal-form-field-${
                  formFieldShow.usuarioCodigo ? "show" : "hidden"
                }`}
              >
                <Field.Composite
                  name="usuarioCodigo"
                  nameDescription="usuarioNome"
                  id="usuarioCodigo"
                  type="number"
                  label="Criado por"
                  direction="row"
                  disable={formFieldDisable.usuarioCodigo}
                  register={register}
                  error={errors.usuarioCodigo?.message}
                  defaultValue={tokenData.code}
                  textTransform={"uppercase"}
                />
              </div>
              <div
                className={`modal-form-button-container modal-form-button-${
                  modalConfig.btnShow ? "show" : "hidden"
                }`}
              >
                <Button.large
                  text={modalConfig.btnText}
                  type="submit"
                  name={modalConfig.btnName}
                  style={modalStyle}
                />
              </div>
              <div
                className={`
                  modal-form-message 
                  background-${formMessage.style} 
                  ${formMessage.show ? "show" : "hidden"}
                `}
              >
                {formMessage.message}
              </div>
            </form>

            <form
              className={`modal-form-container modal-form-action-${
                !modalFormActionShow ? "show" : "hidden"
              }`}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={`modal-form-field-show`}>
                <Field.Composite
                  name="usuarioAcessoCodigo"
                  nameDescription="usuarioAcessoNome"
                  id="usuarioAcessoCodigo"
                  type="number"
                  label="Usuário"
                  disable={formFieldDisable.usuarioAcessoCodigo}
                  register={register}
                />
              </div>

              <div className="modal-form-acess-release-container">
                <table className="table-data-acess-release">
                  <thead>
                    <tr>
                      <th className="table-data-acess-release-name">Tabela</th>
                      <th className="table-data-acess-release-option">
                        <Content text="Tela" style="ligth" />
                      </th>
                      <th className="table-data-acess-release-option">
                        <Content text="Novo" style="success" />
                      </th>
                      <th className="table-data-acess-release-option">
                        <Content text="Visualizar" style="info" />
                      </th>
                      <th className="table-data-acess-release-option">
                        <Content text="Alterar" style="warning" />
                      </th>
                      <th className="table-data-acess-release-option">
                        <Content text="Excluir" style="danger" />
                      </th>
                      <th className="table-data-acess-release-option">
                        <Content text="Acesso" style="secondary" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadoTabelaUsuario.map((tableAcess, index) => {
                      if (
                        tableAcess.tabelaNome &&
                        (tableAcess.tabelaShow || tokenData.programmer)
                      ) {
                        return (
                          <tr key={index}>
                            <td>{tableAcess.tabelaNome}</td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="tela"
                                id={`tela-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="tela"
                                dataValue={tableAcess.tela}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.tela === 0 ? (
                                    <div
                                      id={`tela-${tableAcess.tabelaCodigo}-icon`}
                                    >
                                      <RiLightbulbLine />
                                    </div>
                                  ) : tableAcess.tela === 1 ? (
                                    <div
                                      id={`tela-${tableAcess.tabelaCodigo}-icon`}
                                    >
                                      <RiLightbulbFlashLine />
                                    </div>
                                  ) : (
                                    <div
                                      id={`tela-${tableAcess.tabelaCodigo}-icon`}
                                    >
                                      <RiLightbulbFlashFill />
                                    </div>
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              ></Button.acessRelease>
                            </td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="inserir"
                                id={`inserir-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="inserir"
                                dataValue={tableAcess.inserir}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.inserir === 0 ? (
                                    <RiLightbulbLine
                                      id={`inserir-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : tableAcess.inserir === 1 ? (
                                    <RiLightbulbFlashLine
                                      id={`inserir-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : (
                                    <RiLightbulbFlashFill
                                      id={`inserir-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              />
                            </td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="visualizar"
                                id={`visualizar-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="visualizar"
                                dataValue={tableAcess.visualizar}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.visualizar === 0 ? (
                                    <RiLightbulbLine
                                      id={`visualizar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : tableAcess.visualizar === 1 ? (
                                    <RiLightbulbFlashLine
                                      id={`visualizar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : (
                                    <RiLightbulbFlashFill
                                      id={`visualizar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              />
                            </td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="alterar"
                                id={`alterar-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="alterar"
                                dataValue={tableAcess.alterar}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.alterar === 0 ? (
                                    <RiLightbulbLine
                                      id={`alterar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : tableAcess.alterar === 1 ? (
                                    <RiLightbulbFlashLine
                                      id={`alterar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : (
                                    <RiLightbulbFlashFill
                                      id={`alterar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              />
                            </td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="deletar"
                                id={`deletar-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="deletar"
                                dataValue={tableAcess.deletar}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.deletar === 0 ? (
                                    <RiLightbulbLine
                                      id={`deletar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : tableAcess.deletar === 1 ? (
                                    <RiLightbulbFlashLine
                                      id={`deletar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : (
                                    <RiLightbulbFlashFill
                                      id={`deletar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              />
                            </td>
                            <td className="table-data-acess-release-option">
                              <Button.acessRelease
                                name="acessar"
                                id={`acessar-${tableAcess.tabelaCodigo}`}
                                dataRegisterCode={tableAcess.codigo}
                                dataTable={tableAcess.tabelaCodigo}
                                dataOption="acessar"
                                dataValue={tableAcess.acessar}
                                dataPosition={index}
                                type="button"
                                icon={
                                  tableAcess.acessar === 0 ? (
                                    <RiLightbulbLine
                                      id={`acessar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : tableAcess.acessar === 1 ? (
                                    <RiLightbulbFlashLine
                                      id={`acessar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  ) : (
                                    <RiLightbulbFlashFill
                                      id={`acessar-${tableAcess.tabelaCodigo}-icon`}
                                    />
                                  )
                                }
                                onClick={handleChangeAcessRelease}
                              />
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
              <div className="form-table-legend-container">
                <div className="form-table-legend">
                  <RiLightbulbLine className="icon-noAction" />
                  <Content text="Sem opção" style="dark" />
                </div>
                <div className="form-table-legend">
                  <RiLightbulbFlashLine className="icon-noRelease" />
                  <Content text="Não Liberado" />
                </div>
                <div className="form-table-legend">
                  <RiLightbulbFlashFill className="icon-release" />
                  <Content text="Liberado" />
                </div>
              </div>

              <div
                className={`modal-form-button-container modal-form-button-${
                  modalConfig.btnShow ? "show" : "hidden"
                }`}
              >
                <Button.large
                  text={modalConfig.btnText}
                  type="submit"
                  name={modalConfig.btnName}
                  style={modalStyle}
                />
              </div>
              <div
                className={`
                  modal-form-message 
                  background-${formMessage.style} 
                  ${formMessage.show ? "show" : "hidden"}
                `}
              >
                {formMessage.message}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Usuario;
