
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

/**
 * Transforms a singular string in a plural string
 * @param word 
 * @returns 
 */
export function stringSingularToPlural(word: string) {

  let endingReplacementRegexp = /$/
  let ending = "s"

  if ((word.length >= 1) && word.toLocaleLowerCase().endsWith("y")) {
    endingReplacementRegexp = /[yY]$/
    ending = "ies"
  }

  const lastChar = word.charAt(word.length - 1)
  const endsLowerCase = lastChar.toLocaleLowerCase() === lastChar

  return word.replace(
      endingReplacementRegexp, 
      endsLowerCase 
      ? ending.toLocaleLowerCase()
      : ending.toLocaleUpperCase()
    )
}

/**
 * Builds a path object by agregating a collection of chunk of path
 * @param pathArray 
 * @returns 
 */
export function buildPath(...pathArray: string[]) {
    return pathArray.join("/")
}

export declare const Type: FunctionConstructor;

export declare interface Type<T> extends Function {
    new (...args: any[]): T;
}