# Overview

Welcome to FirestORM.
This documentation explains the logic of Firestorm, if you are looking for a more comprehensive doc, the [JSDoc is here](https://firestorm-doc.vercel.app/)

## Model

A model is a typescript class that is meant to match a document in the database.
You need two things:
- it has to have a `id: string` property
- you must decorate it with the `Collection` decorator

Id is a special property because you always need it and it will always be filled based on the id of the document you get BUT you it doesn't have to be in the document. More of this in the [decorators page](/doc/decorators)

```ts
@Collection({ collection: "tracks" })
class Track {

    id: string

    title: string | null = null

    length: number = 0

    author: string | null = null

}
```

It matches documents of a collection under the path `tracks` that looks like this json object:
```json
{
    id: "ihjfezhi",
    title: "My track's title",
    author: "My awesome author",
    length: "182"
}
```

By default, the property is matched to the same property name in the document

You can add more details to the model, notably ignore some properties, map to an other property, have a more complex parsing than the default provided through value types.
To do that, you need to add [Decorators](/doc/decorators)

This is a paragraph
Well