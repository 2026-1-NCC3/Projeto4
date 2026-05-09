const userModel = require("../models/userModel.js");

exports.getUsers = async () => {
  console.log("services: getUsers");
  const users = await userModel.getUsers();
  console.log(users);
  return users;
};

exports.getDoctors = async () => {
  return await userModel.getUsersByType(2);
};

exports.getPacientes = async () => {
  console.log("services: getPacientes");
  const users = await userModel.getPacientes();
  console.log(users);
  return users;
};
