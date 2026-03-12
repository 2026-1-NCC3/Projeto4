/**
 * Funções utilitárias de validação de entrada.
 * Retornam { valid: boolena, message: string }.
 * Usadas nos controllers antes de chamar os services
 */

/** Verifica se um e-mail tem formato válido */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/** Verifica se uma data está no formato YYYY-MM-DD */
function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateStr);
}

/** Verifica se um nível de dor está entre 0 e 10 */
function isValidPainLevel(level) {
    const n = Number(level)
    return Number.isInteger(n) && n >= 0 && n <= 10;
}

/** Verifica se um tipo de mídia é válido */
function isValidMediaType(type) {
    return ['video', 'image'].includes(type);
}

module.exports = { isValidEmail, isValidDate, isValidPainLevel, isValidMediaType };