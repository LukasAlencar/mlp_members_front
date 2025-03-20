import { Outlet, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { LoaderScreen } from '../LoaderScreen';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      navigate("/");
    }
  }, [auth, navigate]);

  if (auth === null) {
    return <LoaderScreen/>
  }

  return auth ? <Outlet /> : null;
};

export default ProtectedRoute;
