import { Model, Ignore } from "@jiway/firestorm-core";

@Model("configurations")
export class PackageInfosEntity {

    @Ignore()
    id: string = ""

    name: string = ""

    description: string = ""

    version: string = ""
    
}