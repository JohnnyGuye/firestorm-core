# Decorators

Most decorators in this library are tools to specify how to translate a model into a document and the other way around.

- [@Collection](/doc/decorators/collection) : class decorator that marks the class as a model for Firestorm
- [@Ignore](/doc/decorators/ignore) : to ignore a property in a model
- [@MapTo](/doc/decorators/map-to) : to change to the name mapping between the model and the document
- [@ComplexType](/doc/decorators/complex-type) : to use conversions between model property documents besides the basic types
- [@DateType](/doc/decorators/date-type) : specific complex type designed for dates
- [@SubCollection](/doc/decorators/sub-collection) : to specify that a property in the model is related to a subcollection in the DB