import { useEffect, useState } from "react";
import { loginuser, logoutuser } from "../redux/userslice.js"; // ✅ Fixed Path
import { useDispatch } from "react-redux";
import axios from "axios";

function useCheckAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/userdetails", {
          withCredentials: true,
        });
        if (res.status === 200) {
          dispatch(loginuser(res.data));
        } else {
          dispatch(logoutuser());
        }
      } catch (error) {
        console.log(error);
        dispatch(logoutuser());
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [dispatch]); 

  return { loading }; 
}

export default useCheckAuth;
