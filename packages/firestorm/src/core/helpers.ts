
/**
 * Converts a string in pascal or camel case to a string in snake case
 * @param pascalCaseString The string to converts from pascalCase to snake_case
 * @returns snake_cased string
 */
export function pascalToSnakeCase(pascalCaseString: string) {
  return pascalCaseString
    .replace(/([A-Z])/g, (s) => `_${s.toLowerCase()}`)
    .replace(/^_/, "")
}

/**
 * Transforms a singular string in a plural string
 * 
 * It's not englishly accurate, but at least it's consistant in a dev's world
 * 
 * @param word The world to pluralize
 * @returns The pluralized word
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
 * Builds a path object by agregating a collection of segments
 * @param segments Segments to aggregate
 * @returns Path aggregated
 */
export function buildPath(...segments: string[]) {
    return segments.join("/")
}

/**
 * Describes a function that can generate an object
 */
export declare const Type: FunctionConstructor;

/**
 * Newable function of T
 * @template T Type of the object
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export declare interface Type<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
}