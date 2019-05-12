# Database-Projekt

*Read this in other languages: [Deutsch](Readme.de.md)

This project contains the database schema, i. e. all the tables and all stored procedures. One basic rule while creating was to implement every single data access as a stored procedure and prevent direct table access. This protects your application against SQL injections, and the performance is enhanced dramatically.

Because performance is one major factor for user experience, all aggregation, filter and reporting is done with stored procedures, too.

