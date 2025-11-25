import { FirestormId, FirestormModel } from "../firestorm-model";
import { logError, logWarn } from "../logging";
import { Type } from "../type";

/**
 * Class holding references to multiple items of the same collection that can be loaded or not.
 * 
 * The ids can be duplicated but the models are unique per id to avoid unecessary calls
 */
export class ToManyRelationship<T_target extends FirestormModel> {
    
    private _ids: string[] = []
    private _models = new Map<FirestormId, T_target>()

    constructor(public readonly type: Type<T_target>) {}

    /**
     * Adds the id of a document to the relationship
     * @param id The id to add
     * @returns this
     */
    public addId(id: string) {
        this._ids.push(id)
        return this
    }

    /**
     * Adds multiple document ids to the relationship
     * @param ids The ids to add
     * @returns this
     */
    public addIds(ids: Iterable<string>) {
        this._ids.push(...ids)
        return this
    }

    /**
     * Clears the current relationship and loaded models and add the ids provided in their place
     * @param ids The ids to add
     * @returns this
     */
    public setIds(ids: Iterable<string> | string) {
        this.clear()
        return this.addIds(ids)
    }

    /**
     * Adds a model to the relationship.
     * 
     * It adds the model's id to the list of ids tracked by the relationship. 
     * If you want to assign a model without changing the list, use {@link assignModel}
     * 
     * @param model Model to add
     * @returns this
     */
    public addModel(model: T_target) {

        if (!model.id) {
            logWarn("You cannot set an object that doesn't have a valid id. This item will be ignored", model)
            return this
        }

        this._ids.push(model.id)
        this._models.set(model.id, model)
        
        return this
    }

    /**
     * Adds multiple models to the relationship
     * 
     * It adds the models' ids to the list of ids tracked by the relationship. 
     * If you want to assign the models without changing the list, use {@link assignModels}
     * 
     * @param models Models to add
     * @returns this
     */
    public addModels(models: Iterable<T_target>) {

        for (const model of models) {
            this.addModel(model)
        }

        return this
    }

    /**
     * Assigns a model to the relationship if its id is tracked.
     * 
     * It only assigns a model if this model's id is already in the list of tracked ids.
     * If you want to add the model to the tracking, use {@link addModel}
     * 
     * @param model Model to assign
     * @returns this
     */
    public assignModel(model: T_target) {
        
        if (!model.id) {
            logWarn("You cannot assign an object that doesn't have a valid id. This will not be added", model)
            return this
        }

        const uids = new Set(this._ids)
        if (!uids.has(model.id)) {
            logWarn(`The id ${model.id} is not part of the ids tracked by this relationship. It will not be added.`)
            return this
        }

        this._models.set(model.id, model)

        return this
    }

    /**
     * Assigns models to the relationship if their ids are tracked.
     * 
     * It only assigns a model if this model's id is already in the list of tracked ids.
     * If you want to add the model to the tracking, use {@link addModels}
     * 
     * @param models Models to assign
     * @returns this
     */
    public assignModels(models: Iterable<T_target>) {

        const uids = new Set(this._ids)
        
        for (let model of models) {

            if (!model.id) {
                logWarn("You cannot assign an object that doesn't have a valid id. This will not be added", model)
                return this
            }
    
            if (!uids.has(model.id)) {
                logWarn(`The id ${model.id} is not part of the ids tracked by this relationship. It will not be added.`)
                return this
            }

            this._models.set(model.id, model)

        }


        return this
    }

    /**
     * Sets the models of the relationship.
     * The models must have an id.
     * 
     * It clears the relationship of any previous id tracking.
     * 
     * @param models Models to set
     */
    public setModels(models: Iterable<T_target>) {
        
        this.clear()

        this.addModels(models)

        return this
    }

    /**
     * Gets the ids of the relationship.
     * 
     * The ids are in order of insertion and is preserved in the document.
     */
    public get ids() {
        return [...this._ids]
    }

    /**
     * Gets the unique ids of the relationship
     * 
     * The ids are in order of insertion but the duplicates are removed
     */
    public get uniqueIds() {
        return [...new Set<string>(this.ids)]
    }

    /**
     * Gets the models currently in the relationship.
     * 
     * If 
     */
    public get models() {
        return [...this._models.values()]
    }


    /**
     * Gets a specific loaded item by its id
     * @param id Id of the item to retrieve
     * @returns The model if it exists or undefined if not loaded or not in the relationship at all.
     */
    public getById(id: FirestormId) {
        return this._models.get(id)
    }

    /**
     * Erase all the relationships stored
     */
    public clear() {
        this._ids = []
        this._models.clear()
    }

}