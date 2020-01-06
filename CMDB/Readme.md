# CMDB

*Read this in other languages: [Deutsch](Readme.de.md)

This is the core application controlling the database access and serving the functionality via SOAP and REST.

# Prerequesites

The website has to be deployed on an Internet Information Server with activated Windows authentication.

The server needs to be a domain member to make Active Directory queries work.

Please configure a SQL server database in web.config as data source. The database needs the schema from the project named Database. If the SQL server is configured for Windows authentication, you need to grant execute rights for stored procedures to the computer account of the web server. Roles like data reader are not required.

# Administrative rights

You should grant administrative rights for the app to single users only. If your database doesn't contain a user with the role administrator, then every authenticated user has administrative rights. So you should set the administrators directly after installation.

# Deprecation

This app was ported to the Angular based project ng-cmdb. The core with the REST API will stay as a core component until it is finally rewritten as NodeJS app.
