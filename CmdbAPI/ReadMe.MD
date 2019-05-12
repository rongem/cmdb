# CmdbApi

*Read this in other languages: [Deutsch](Readme.de.md)

This project is the heart of the application. All functions for business logic and storage operations are implemented here.

## BusinessLogic

This folder holds all classes for data manipulation. All communication is based on DataObjects and TransferObjects, which are being transformed from DataRow objects in factories. The main components are DataHandler for configuration items, attributes and connections, and MetaDataHandler for types, mappings and rules.

## DataAccess

This folder holds all the code for reading from and writing to the database. The DataAccess components are used for reading datasets from the database and storing them. The database uses only stored procedures for CRUD operations. This enhances performance a lot, compared to in memory operations in .NET. Some complex SELECT statements are 50 times faster than a LINQ operation.

## Factories

This applications makes extensive use of the factory pattern to create objects. The factories are implemented in this folder.

## Security

This folder holds all security related functions.

## DataObjects / TransferObjects

This folder holds all the objects that are used in business logic and exposed via the SOAP and REST API.

