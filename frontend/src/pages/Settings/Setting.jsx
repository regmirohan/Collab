import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


const Setting = () => {
  const navigate = useNavigate();
  const [resetSetting, setResetSetting] = useState({
    name: "",
    email: "",
  })
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    message: ""

  });
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const getUserData = async () => {
        const response  = await axios.get('http://localhost:3000/api/users/getUser', {
          withCredentials: true
        })
        if(response.data.success){
         console.log("data: ", response.data)
         setSettings({
          name: response.data.result[0].name,
          email: response.data.result[0].email,
         })
         setResetSetting({
          name: response.data.result[0].name,
          email: response.data.result[0].email,
         })
        }
    }
    getUserData()
  }, [])

  // Update settings state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    if(settings.password != settings.confirmPassword){
      setErrors({match: 'password do not match'})
      return
    }
    alert("Settings saved successfully!");
    const response = await axios.put('http://localhost:3000/api/users/updateProfile', {
      name: settings.name, email: settings.email, password: settings.password
    },{
      withCredentials: true
    })
    if(response.data.success){
      navigate('/signin')
    }
  };

  const handleCancel = () => {
    alert("Changes canceled.");
    
    setSettings({
      name: resetSetting.name,
      email: resetSetting.email,
      password: "",
      confirmPassword: ""
    });
  };

  const handleSendMessage = async () => {
  
     
    const response = await axios.post('http://localhost:3000/api/users/sendMail',{
      message: settings.message
    },{
      withCredentials: true
    })
    if(response.data.success){
      setSettings({...settings,message: ""})
      console.log(settings.message) 
    }
  }

  return (
    <div className="bg-white flex p-6 w-full gap-12">
        {/* <Sidebar /> */}
        <div className="w-[50%]">
        <h1 className="bg-[#044c69] w-full text-white text-2xl font-bold py-4 px-6 mb-6">Settings</h1>

      {/* General Settings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-6">
      <h1 className="text-lg font-semibold mb-4">Change Password</h1>
      <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={settings.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Account Preferences */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Enable Dark Mode</label>
          </div>
          <div>
            <label className="block font-medium mb-1">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Notification Settings */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Enable Email Notifications</label>
        </div>
      </div> */}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-[#044c69] text-white px-4 py-2  hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="bg-white text-black px-4 py-2  hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
        </div>
        {/* contact */}
        <div className="flex flex-col justify-center gap-4 w-[50%]">
          <h1 className="text-2xl font-semibold">Contact Us</h1>
          <div className="flex flex-col gap-4">
            <textarea
            name="message"
            value={settings.message}
            onChange={handleChange} 
            className="p-2 h-[200px] border border-gray-500 "
            placeholder="send your queries ..."
            type="text" />
            <div>
            <button 
            onClick={handleSendMessage}
            className="bg-[#044c69] px-6 py-3 text-white">Send Message</button>
            </div>
            
          </div>
        </div>
    </div>
  );
};

export default Setting;
