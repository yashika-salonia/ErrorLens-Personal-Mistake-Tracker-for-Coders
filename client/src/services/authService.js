import API from "./api";

//Register
export const registerUser = async (formData) => {
  const res = await API.post("/users/register", formData);
  return res.data;
};

// Login
export const loginUser = async (formData) => {
  const res = await API.post("/users/login", formData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Get My Profile 
export const getMyProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

// Update Profile 
// body: { name?, codingLevel?, role? }
export const updateProfile = async (formData) => {
  const res = await API.put("/users/me", formData);
  return res.data;
};

// Change Password 
// body: { currentPassword, newPassword }
export const changePassword = async (formData) => {
  const res = await API.put("/users/me/password", formData);
  return res.data;
};
