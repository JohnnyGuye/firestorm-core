import { MissingIdentifierError } from "../../errors"
import { FirestormModel } from "../firestorm-model"
import { Type } from "../type"

/**
 * Class holding a reference to an item that can be loaded or not
 */
export class ToOneRelationship<T_target extends FirestormModel> {

  /**
   * 
   */
  private _id: string | null = null
  private _model?: T_target

  /**
   * Creates a ToOneRelationship
   * @param type Type of the model
   * @param id Id of the linked model
   */
  constructor(public readonly type: Type<T_target>, id?: string) {
    this._id = id || null
    this._model = undefined
  }

  /**
   * Gets the id of the document for this relationship.
   */
  public get id() : string | null {
    return this._id
  }

  /**
   * Sets the id for this relation.
   * 
   * If there is a model already loaded and the newid makes the relationship invalid, 
   * it will remove the model aswell.
   * 
   * @param newId Id to assign.
   */
  public set id(newId: string | null | undefined) {

    if (!newId) newId = null

    this._id = newId
    if (this.invalid) {
      this._model = undefined
    }
  }

  /**
   * The loaded model
   */
  public get model() {
    return this._model
  }

  /**
   * Sets the model of the relationship. 
   * The model must have an id.
   * 
   * It will update the id of the relationship.
   * @param model Model to set 
   */
  public setModel(model: T_target) {
    if (!model.id) throw new MissingIdentifierError()
    this._id = model.id
    this._model = model
  }

  /**
   * Gets the model if it is validated against the id, or undefined otherwise.
   */
  get modelIfValid() {
    if (this.valid) return this.model
    return undefined
  }

  /**
   * Whether or not the id and the model match.
   * 
   * If the id is falsy, the value must be falsy too to be valid.
   * If there is an id, then the model must be loaded and have the same id.
   */
  public get valid() {
    if (!this.id) return !this.model
    return this.id === this.model?.id
  }

  /**
   * Whether or not the id and the model are mismatched.
   * 
   * @see valid
   */
  public get invalid() {
    return !this.valid
  }

}
