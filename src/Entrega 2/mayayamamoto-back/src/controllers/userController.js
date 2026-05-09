const userService = require("../services/userService");

exports.getUsers = async (req, res) => {
  try {
    console.log("controller: getUsers"); // Log para verificar se a função está sendo chamada
    const result = await userService.getUsers();
    return res.status(200).json(result);
  } catch (error) {
    console.error("ERRO DETALHADO:", error); //
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message }); // <- e isso temporariamente
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const result = await userService.getDoctors();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar médicos", error: error.message });
  }
};

exports.getPacientes = async (req, res) => {
  try {
    console.log("controller: getPacientes"); // Log para verificar se a função está sendo chamada
    const result = await userService.getPacientes();
    return res.status(200).json(result);
  } catch (error) {
    console.error("ERRO DETALHADO:", error); //
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message }); // <- e isso temporariamente
  }
};
