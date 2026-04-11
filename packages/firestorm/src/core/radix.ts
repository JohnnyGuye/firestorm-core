/**
 * Converter of integers in different bases
 */
class Base {

  private readonly _base: string
  private readonly _baseToValueMap: Map<string, number>
  private readonly _valueToBaseMap: Map<number, string>

  /**
   * Radix of the base (amount of digits in the base)
   */
  public get radix() {
    return this._base.length
  }

  /**
   * String containing all the individual digits of the base in order
   */
  public get base() {
    return this._base
  }

  /**
   * Creates a converter of the base given
   * @param base String containing all the individual digits of the base in order
   */
  constructor(base: string) {
    
    this._base = base
    this._baseToValueMap = new Map(this._base.split("").map((v, i) => { return [v, i] }))
    this._valueToBaseMap = new Map(this._base.split("").map((v, i) => { return [i, v] }))

  }

  /**
   * Compare two strings representing numbers.
   * 
   * It's a lexicographic comparison meaning that it compares the digits one by one instead of the number represented.
   * 
   * @param lhs Left number
   * @param rhs Right number
   * @returns 
   * - (-1) : if lhs < right
   * - (+1) : if lhs > right
   * -   0  : if lhs == right 
   */
  public compareLexicographic(lhs: string, rhs: string) {

    for (let i = 0; i < lhs.length && i < rhs.length; i++ ) {
      const lv = this.charToValue(lhs[i])
      const rv = this.charToValue(rhs[i])

      if (lv < rv) return -1
      if (lv > rv) return 1

    }

    if (lhs.length < rhs.length) return -1
    if (lhs.length > rhs.length) return 1

    return 0
  }

  /**
   * Compare two strings representing numbers.
   * 
   * @param lhs Left number
   * @param rhs Right number
   * @returns 
   * - (-1) : if lhs < right
   * - (+1) : if lhs > right
   * -   0  : if lhs == right 
   */
  public compareNumeric(lhs: string, rhs: string) {

    const lv = this.stringToValue(lhs)
    const rv = this.stringToValue(rhs) 

    if (lv < rv) return -1
    if (lv > rv) return 1
    
    return 0
  }

  /**
   * LERP of a starting number to an ending number lexicographically.
   * 
   * If the two numbers do not have the same amount of chars, it pads them with the lowest value of the base
   * 
   * LERP stands for Linear intERPolation
   * 
   * @param start Starting number
   * @param end Ending number
   * @param nominator Nominator of the LERP ratio. Must be an integer
   * @param denominator Denominator of the LERP ratio. Must be an integer
   * @returns The LERPed value
   */
  public lerpLexicographic(start: string, end: string, nominator: number, denominator: number): string {

    const ascending = this.compareLexicographic(start, end) < 0

    // Get the smallest and largest of two numbers
    let [first, last] = ascending ? [start, end] : [end, start]

    // Pad the smallest with the smallest value in the base
    if (first.length < end.length) first = first.padEnd(last.length, this.valueToChar(0))
    // Pad the largest with the largest value in the base
    if (last.length < start.length) last = last.padEnd(first.length, this.valueToChar(0))

    // Reassign the padded values
    ;[start, end] = ascending ? [first, last] : [last, first]

    return this.lerp(start, end, nominator, denominator)
  }

  /**
   * LERP of a starting number to an ending number
   * 
   * LERP stands for Linear intERPolation
   * 
   * @param start Starting number
   * @param end Ending number
   * @param nominator Nominator of the LERP ratio. Must be an integer
   * @param denominator Denominator of the LERP ratio. Must be an integer
   * @returns The LERPed value
   */
  public lerp(start: string, end: string, nominator: number, denominator: number): string {
    const sv = this.stringToValue(start)
    const ev = this.stringToValue(end)

    const diff = ev - sv

    const lerpedValue = diff * BigInt(nominator) / BigInt(denominator) + sv

    return this.valueToString(lerpedValue)
  }

  /**
   * Converts a string to the integer it represents.
   * @param str String to convert
   * @returns Value of the string
   */
  public stringToValue(str: string): bigint {
    
    const bigBl = BigInt(this.radix)
    let value = 0n;
    for (let i = 0; i < str.length; i++) {
      value *= bigBl
      const cv = this.charToValue(str[i])
      value += BigInt(cv)
    }
    return value
  }

  /**
   * Converts a value to the string representing it in this base
   * @param value Value to convert
   * @returns String representing the value
   */
  public valueToString(value: number | bigint): string {

    const bigBl = BigInt(this.radix)

    let bigValue: bigint = typeof value === "bigint" ? value : BigInt(value)
    let res = ""

    while(bigValue > 0n) {
      const v = bigValue % bigBl
      res = this.valueToChar(Number(v)) + res
      bigValue -= v
      bigValue /= bigBl
    }

    return res
  }

  /**
   * Converts a char to its integer value
   * @param char Char to convert
   * @returns The integer in base 10 represented by the char
   */
  public charToValue(char: string): number {

    const v = this._baseToValueMap.get(char)
    if (v !== undefined) return v
    else return this.radix
      
  }

  /**
   * Converts an integer to its char value
   * @param value Value to convert
   * @param clamp Whether or not to clamp the value to the base if it's out of bound. if unset and out of bound it throws.
   * @returns The char representing the value
   */
  public valueToChar(value: number, clamp: boolean = true): string {
    
    const c = this._valueToBaseMap.get(value)
    if (c !== undefined) return c
    
    if (clamp) {
      if (value < 0) return this._base[0]
      if (value > this.radix) return this._base[this.radix - 1]
    }
    
    throw new Error(`Cannot convert the value ${value} value.`)
  }

}

/**
 * Converter of firestorm ids to integers
 */
class FirestoreIdBase extends Base {
  
  constructor() {
    super("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_")
  }

}