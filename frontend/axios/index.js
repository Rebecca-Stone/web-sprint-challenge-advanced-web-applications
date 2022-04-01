// ✨ implement axiosWithAuth
import React from "react";
import axios from "axios";

function axiosWithAuth() {
  const token = window.localStorage.getItem("token");
  return axios.create({
    headers: {
      Authorization: token,
    },
  });
}

export default axiosWithAuth;