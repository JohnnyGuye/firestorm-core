# Decorators

Most decorators in this library are tools to specify how to translate a model into a document and the other way around.

____

## @Collection

It has to be added on a class that is meant to be a model.
It also enables you to specify the default direct collection path.

## @Ignore

You must add it on the property of the model that you don't want in the document or don't want to parse from the document.

```ts
@Collection({ collection: "tracks" })
class Track {

  @Ignore()
  id: string

  title: string | null = null

  length: number = 0

  author: string | null = null

  @Ignore()
  get isLongTrack() {
    return this.length > (5 * 60)
  }

  @Ignore()
  get hasAuthor() {
    return !!this.author
  }

}
```

The document matching this model will be of the form below:

```json
{
  "title": "My track's title",
  "author": "My awesome author",
  "length": "182"
}
```

## @MapTo

Maps the model's property to a data with an other key in the document.

```ts
@Collection({ collection: "tracks" })
class Track {

  id: string

  @MapTo("name")
  title: string | null = null

  @MapTo({ target: "duration" })
  length: number = 0

  author: string | null = null

}
```

The document matching this model will be of the form below:

```json
{
  "name": "My track's title",
  "author": "My awesome author",
  "duration": "182"
}
```

## @ComplexeType

It enables you to create an object out of datas in the document or parse differently than the basic value type conversion.

### @DateType

Date type is an already implemented ComplexeType for properties that are a Date object.

## @SubCollection

Marks a property as a subcollection with enables queries from repositories and ignore the property in the document-model parsing.