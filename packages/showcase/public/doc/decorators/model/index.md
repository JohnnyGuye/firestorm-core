# @Collection() decorator

This decorator is a `class` decorator. 

The model class that corresponds to a document in your DB must have this decorator.
Additionnaly, a model class must implement the `interface IFirestormModel` so this means that they must have a property `id: string`.

```ts

// This isn't a model class. And it cannot be one, even with the decorator.
class AClassicClass {

  fieldA: string = ""

  fieldB: number = 0

}

// This class can be promoted to a FirestormModel BUT it needs the @Collection decorator
class AClassThatCanBeAModel {

  id: string = "__id__"

  fieldA: number = 0
}

// This class is a firestorm model
@Collection({ collection: "a-model" })
class AModel {
  
  id: string = "__id__"

  fieldA: number = 8

}
```

If you try to create a document using `AModel` it should create a document under the path `a-model/__id__` that looks like this :

```json
// Located at a-model/__id__
{
  "id": "__id__",
  "field_a": 8
}
```

