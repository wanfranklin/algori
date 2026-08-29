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
