import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleAction = (title) => {
    if (title === "Password") {
      navigate("/forgot-password");
    } else if (title === "Email") {
      navigate("/update-email");
    } else if (title === "Name") {
      setIsDialogOpen(true);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put('http://localhost:5000/update-name', { name: newName },
        {withCredentials:true}
      );

      toast.success("Name updated successfully");
      setIsDialogOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.err || "Failed to update name");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
                onClick={() => handleAction(section.title)}
                className="bg-gray-100 hover:bg-gray-200 text-sm font-semibold px-4 py-1 rounded border border-gray-300"
              >
                {section.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleNameUpdate} disabled={loading} variant="contained" color="primary">
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default Profile;
