const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticação usando JWT
 * 
 * Lê o token do header Authorization (formato: "Bearer <token>"),
 * valida a assinatura e injeta os dados do usuário em req.user
 * Se o token for invélido ou ausente, retorna 401 Unauthorized
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Verifica se o header existe e começa com "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1]; // Extrai o token após "Bearer "

    try {
        // Verifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Injeta os dados do usuário decodificados em req.user
        req.user = decoded;
        next(); // Continua para a próxima função de middleware ou rota
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
}

/**
 * Middleware de autorização por tipo de usuário
 * 
 * Uso: adminOnly como segundo middleware numa rota.
 * Bloqueia acesso de profissionais (type 2) a rotas exclusivas para admins (type 1)
 */
function adminOnly(req, res, next) {
    if (req.user?.type !== 1) {
        return res.status(403).json({message: "Acesso restrito a administradores."})
}
next();
}

module.exports = { authMiddleware, adminOnly };