
/**
 * Converts a string in pascal or camel case to a string in snake case
 * @param pascalCaseString 
 * @returns 
 */
export function pascalToSnakeCase(pascalCaseString: string) {
  return pascalCaseString
    .replace(/([A-Z])/g, (s) => `_${s.toLowerCase()}`)
    .replace(/^_/, "")
}