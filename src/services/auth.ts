import { useEffect, useState } from 'react';
import api from './api';

function Authenticate(email: string, senha: string) {

  const [authData, setAuthData] = useState({});

  return ({ email, senha })

  useEffect(() => {
    api.post('usuario/authenticate', { email, senha })
      .then(response => {
        setAuthData(response.data);
      })
      .catch((err) => {
        return (`Falha ao autenticar o usuário (${err})`)
      })
  }, []);

  return authData;
}

export default Authenticate;
