import { useEffect, useState } from "react";
import { loginuser, logoutuser, updateUserCity } from "../redux/userslice.js";
import { useDispatch } from "react-redux";
import axios from "axios";

function useCheckAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/userdetails", {
          withCredentials: true,
        });

        

        if (res.status === 200) {
          dispatch(loginuser(res.data));
          
          if (res.data.city) {
            dispatch(updateUserCity(res.data.city));            
          }
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
