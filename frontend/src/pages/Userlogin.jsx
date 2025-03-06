import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { Navigate } from "react-router-dom";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
 const {email,password} =formData
  try {
    const response = await axios.post("http://localhost:5000/loginusers",{email,password},{withCredentials:true})
   alert('welcome back')
   console.log(response.data);
     navigate('/home'); // ✅ Redirect after successful login
  } catch (error) {
    alert(error.response.data.error)
    console.log(error)
  }

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg p-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
           
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>
           {/* Signup Link */}
           <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
       
        </CardContent>
      </Card>

    </div>
  );
};

export default UserLogin;
