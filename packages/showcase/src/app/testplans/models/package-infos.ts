import { Collection, Ignore } from "@jiway/firestorm-core";

@Collection("configurations")
export class PackageInfosEntity {

    @Ignore()
    id: string = ""

    name: string = ""

    description: string = ""

    version: string = ""
    
}