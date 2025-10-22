import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "@/config/api";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ Supabase API
  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(`${API_URL}/auth/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      // 🚨 แนะนำให้เพิ่ม: ถ้าดึงข้อมูลล้มเหลว ให้ลบ access_token ทิ้ง
      localStorage.removeItem("access_token");
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(
        `${API_URL}/auth/login`,
        data
      );
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);

      // 🚨 แก้ไข: ย้าย await fetchUser() ขึ้นมาอยู่ก่อน setState และ navigate
      await fetchUser(); // 🚨 AWAIT: รอจนกว่า state.user จะถูกอัปเดตเรียบร้อย

      // ดึงและตั้งค่าข้อมูลผู้ใช้
      setState((prevState) => ({ ...prevState, loading: false, error: null }));

      // 🚨 1. รวม Logic การ Redirect (Clean-up Referrer) เข้ามาใน AuthProvider
      let referrerPath = localStorage.getItem("referrer_path");

      if (referrerPath === "/login" || referrerPath === "/sign-up") {
        referrerPath = "/";
      }
      referrerPath = referrerPath || "/";

      localStorage.removeItem("referrer_path");

      navigate(referrerPath, { replace: true });

    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(`${API_URL}/auth/register`, data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Registration failed",
      }));
      return { error: state.error };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = () => {
    localStorage.removeItem("access_token");
    setState({ user: null, error: null, loading: null });
    navigate("/", { replace: true }); // เพิ่ม { replace: true } เพื่อให้แน่ใจว่าไม่มีประวัติเก่าค้างอยู่
  };

  // อัปเดตข้อมูลผู้ใช้
  const updateUser = async (userData) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      // อัปเดตข้อมูลผู้ใช้ใน state โดยตรง (ไม่ต้องเรียก API เพราะข้อมูลถูกอัปเดตแล้ว)
      setState((prevState) => ({
        ...prevState,
        user: { ...prevState.user, ...userData },
        loading: false,
        error: null,
      }));
      
      return userData;
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || "Failed to update profile",
      }));
      throw error;
    }
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        fetchUser,
        updateUser,
        user: state.user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับใช้งาน AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
