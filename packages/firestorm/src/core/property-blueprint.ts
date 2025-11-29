/**
 * Describes how a property of a model is gonna be turned in a document.
 * @deprecated Not ready for use.
 */
export interface PropertyBluePrint {

  /**
   * The name of the property within the model
   */
  modelProperty: string
  /**
   * Whether or not this property will be ignored in the document
   */
  ignored: boolean
  /**
   * The default field name in the document
   */
  defaultMapping: string
  /**
   * The actual field name in the document
   */
  documentField: string
  /**
   * Whether or not this property has a custom conversion
   */
  complexType: boolean

}