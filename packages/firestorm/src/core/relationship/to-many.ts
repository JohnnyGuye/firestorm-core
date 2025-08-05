import { FirestormModel } from "../firestorm-model";
import { Type } from "../type";

export class ToManyRelationship<T_target extends FirestormModel> {

    private _ids?: string[]
    private _models?: T_target

    constructor(public readonly type: Type<T_target>) {
        this._models = undefined
        this._ids = []
    }

}