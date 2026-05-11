/**
 * Validador de formato de e-mail básico.
 */
exports.isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validador de data no formato YYYY-MM-DD.
 */
exports.isValidDate = (dateString) => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Formato inválido
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // Data inválida
  return d.toISOString().slice(0, 10) === dateString;
};
