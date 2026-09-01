/**
 * Returns the default value for a given Algori type.
 *
 * Used during variable declaration to initialize variables with appropriate default values:
 * - Integer types (inteiro, real, decimal): 0
 * - Text types (caractere, texto): empty string
 * - Logical type (logico): false
 * - Array types (vetor, matriz): empty array
 *
 * @param {string} typeName - The type name in Algori (e.g., 'inteiro', 'texto', 'logico')
 * @returns {number | string | boolean | unknown[]} The default value for the type
 *
 * @example
 * defaultValueForType('inteiro') // returns 0
 * defaultValueForType('texto') // returns ''
 * defaultValueForType('logico') // returns false
 */
export function defaultValueForType(typeName: string): number | string | boolean | unknown[] {
  switch (typeName) {
    case "inteiro": return 0;
    case "real": return 0;
    case "decimal": return 0;
    case "caractere": return "";
    case "texto": return "";
    case "logico": return false;
    case "vetor": return [];
    case "matriz": return [];
    default: return 0;
  }
}
