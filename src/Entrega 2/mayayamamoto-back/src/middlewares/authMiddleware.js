const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, type }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.type === 1 || req.user.type === 2)) {
    // 1 e 2 são considerados administradores (médicos/fisioterapeutas)
    next();
  } else {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }
};

module.exports = { authMiddleware, adminOnly };
