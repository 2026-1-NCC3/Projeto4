const userService = require("../services/userService");

/** GET /users */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error("[userController.getUsers]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /users/:id */
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    return res.status(200).json(user);
  } catch (err) {
    if (err.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[userController.getUserById]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PUT /users/:id */
exports.updateUser = async (req, res) => {
  try {
    const { name, status, type } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nome é obrigatório." });
    }
    const result = await userService.updateUser(Number(req.params.id), name, status, type);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[userController.updateUser]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** DELETE /users/:id */
exports.deleteUser = async (req, res) => {
  try {
    // Impede que o usuário delete a própria conta
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "Você não pode remover sua própria conta." });
    }
    const result = await userService.deleteUser(Number(req.params.id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[userController.deleteUser]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};