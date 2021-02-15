import { useEffect, useState } from 'react';
import api from './api';

const Authenticate = () => {
  const [tokenData, setTokenData] = useState({
    auth: "",
    message: "",
    code: 0,
    name: "",
    programmer: '',
  });

  useEffect(() => {
    api.post('usuario/verifytoken', {
      token: String(localStorage.getItem("@m85.tech:token")),
    }).then(response => {
      setTokenData(response.data);
    }).catch((err) => {
      window.location.replace("/systemlogin");
      return ('Falha ao validar o usuário' + err);
    })
  }, [tokenData.auth === '']);

  if (tokenData.auth !== "" && !tokenData.auth) {
    window.location.replace("/systemlogin");
  }
  return tokenData;
}

export default Authenticate;