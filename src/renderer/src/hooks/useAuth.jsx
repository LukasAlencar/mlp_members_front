import { useEffect, useState } from "react";
import axios from "axios";

const useAuth = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.post("http://localhost:3001/verifySession", {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setAuth(res.data.authenticated);
      } catch {
        setAuth(false);
      }
    };

    verifySession();
  }, []);

  return auth;
};

export default useAuth;
