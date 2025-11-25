import { FirestormId, FirestormModel } from "../firestorm-model";
import { logError, logWarn } from "../logging";
import { Type } from "../type";

export class ToManyRelationship<T_target extends FirestormModel> {
    
    private _models = new Map<FirestormId, T_target>()

    constructor(public readonly type: Type<T_target>) {}

    /**
     * Sets the models of the relationship.
     * The models must have an id.
     * 
     * @param models Models to set
     */
    public setModels(models: Iterable<T_target>) {
        
        const newModels = new Map<FirestormId, T_target>()

        for (const model of models) {

            if (!model.id) {
                logWarn("You cannot set an object that doesn't have a valid id. This item will be ignored", model)
                continue;
            }

            newModels.set(model.id, model)
        }

        this._models = newModels

    }

    /**
     * Gets the models currently in the relationship
     */
    public get models() {
        return this._models.values()
    }

    /**
     * Gets the ids of the relationship
     */
    public get ids() {
        return this._models.keys()
    }

    /**
     * Gets a specific loaded item by its id
     * @param id 
     * @returns 
     */
    public getById(id: FirestormId) {
        return this._models.get(id)
    }

}