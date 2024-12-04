# @Ignore() decorator

This decorator removes the property from the document generated and fetched from Firestore.

It can, and should be added to model properties that you don't want in the document sent to the db.

```ts
const FIVE_MINUTES = 5 * 60 * 1000

@Collection({ collection: "tracks" })
class Track {

  id: string

  title: string = "Default title"

  length: number = 0

  // We don't want to store isLongTrack because it is a computed property
  @Ignore()
  get isLongTrack() {
    return this.length > FIVE_MINUTES
  }

  // We don't want to store randomizeLength because it is a function
  @Ignore()
  randomizeLength() {
    return Math.floor(Math.random() * 1000 * 60 * 10)
  }

}
```

It can be also used to remove the id from the document. It is always fed to the model and is used to store the document but you can remove it from the document.

```ts
@Collection({ collection: "no-id" })
class NoId {

  @Ignore()
  id: string = "__id__"

  iAmALonelyField: string = "I have no id
}
// ...generates
```
```json
// Located at no-id/__id__
{
  "i_am_a_lonely_field": 8
}
```