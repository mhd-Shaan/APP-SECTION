import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const sections = [
    { title: "Name", value: user.name, action: "Edit" },
    { title: "Email", value: user.email, action: "Edit" },
    {
      title: "Password",
      value: "******",
      action: "Forget",
      warning: true,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 mt-10">
        <h1 className="text-2xl font-semibold mb-6">Login and Security</h1>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="font-medium">{section.title}</p>
                <p
                  className={`text-sm ${
                    section.warning ? "text-yellow-600" : "text-gray-600"
                  } mt-1`}
                >
                  {section.value}
                </p>
              </div>
              <button
                onClick={() => navigate("/forgot-password")}
                className="bg-gray-100 hover:bg-gray-200 text-sm font-semibold px-4 py-1 rounded border border-gray-300"
              >
                {section.action}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
