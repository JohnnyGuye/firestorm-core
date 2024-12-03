# @MapTo() decorator

By default, field and properties in your class are mapped to the snake_cased version of their name in Firestore.
So a name like `myField` becomes `my_field`.

You can change that by using the MapTo decorator.

```ts
@Collection({ collection: "smthg" })
class Something {

  id: string = "arandomid"

  @MapTo("iPreferBeingNamedLikeThat")
  iDontLikeMyName: string = "ewww"

}
// ...corresponds to 
```
````json
// located at 
{
  "id": "arandomid",
  "iPreferBeingNamedLikeThat": "ewww"
}
```