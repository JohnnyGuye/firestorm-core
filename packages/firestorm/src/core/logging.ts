/**
 * Logs information messages in firestorm
 * @param params Informations to print
 */
export function logInfo(...params: unknown[]) {
  console.log(...params)
}

/**
 * Logs warning messages in firestorm
 * @param params Informations to print
 */
export function logWarn(...params: unknown[]) {
  console.warn(...params)
}

/**
 * Logs error message in firestorm
 * @param params Informations to print
*/
export function logError(...params: unknown[]) {
  console.error(...params)
}