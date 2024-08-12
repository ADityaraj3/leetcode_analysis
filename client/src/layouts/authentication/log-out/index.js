import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearCookie } from "utlis/cookieUtils";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearCookie("userName");
    console.log("logged out")
    navigate("/authentication/sign-in");
    window.location.reload();
  }, [navigate]);

  return null;
}

export default Logout;
