import React from "react";

import VerifyToken from "../../services/verifyToken";
import Navbar from "../../components/system/SystemNavbar";

const Tabela = () => {
  let tokenData = VerifyToken();

  return (
    <div>
      <Navbar
        title="Tabela"
        pageDirection="/systemhome"
        userName={tokenData?.name}
      />
    </div>
  );
};

export default Tabela;
