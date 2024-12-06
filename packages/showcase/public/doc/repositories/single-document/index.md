# Single document repository

This repository exists to manipulate a single precise document in your DB.
It can be used for things like auto completion base on a in-DB list, lock state, temporary redirections,...

You must provide a document id to the repository and it will always work with this document disregarding the id in the model.

For the full documentation, you can see it [here](https://firestorm-doc.vercel.app/classes/repositories.SingleDocumentRepository.html)