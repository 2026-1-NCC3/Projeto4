const authService = require("../services/authService");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Senha incorreta") {
      return res.status(401).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, status, password, type } = req.body;
    const result = await authService.register(
      name,
      email,
      status,
      password,
      type
    );
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === "Email já cadastrado") {
      return res.status(409).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};
