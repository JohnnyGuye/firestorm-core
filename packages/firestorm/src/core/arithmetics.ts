/**
 * Arithmetic modulo returning a value between [0;mod[
 * 
 * @param value 
 * @param mod 
 * @returns 
 */
export function modulo(value: number, mod: number) {
    return ((value % mod) + mod) % mod
}