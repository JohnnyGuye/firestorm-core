# Decorators

Most decorators in this library are tools to specify how to translate a model into a document and the other way around.

- [@Model](/doc/decorators/model) : class decorator that marks the class as a model for Firestorm
- [@Ignore](/doc/decorators/ignore) : to ignore a property in a model
- [@MapTo](/doc/decorators/map-to) : to change to the name mapping between the model and the document
- [@ComplexeType](/doc/decorators/complexe-type) : to use conversions between model property documents besides the basic types
- [@DateType](/doc/decorators/date-type) : specific complex type designed for dates