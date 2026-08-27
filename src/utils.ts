export function defaultValueForType(typeName: string): number | string | boolean {
  switch (typeName) {
    case "inteiro": return 0;
    case "real": return 0;
    case "decimal": return 0;
    case "caractere": return "";
    case "texto": return "";
    case "logico": return false;
    case "vetor": return 0;
    case "matriz": return 0;
    default: return 0;
  }
}
