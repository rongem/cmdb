# NJS (=NodeJS & Express) backend
The new NodeJS backend is now at production stage. It has the features listed below:
* All REST API calls that manipulate data (except bulk import and administrative functions) use a web sockets extension that enables clients to listen to changes of others
* A new user model will take place. NTLM authentication is still an option, but JWT is now the preferred authentication methods.
* Users are being logged while visiting, so you will also see readers and their time of the last visit.
* New functions are added:
   * GET ConfigurationITems?page={number}: will retrieve alle configuration items, but with a paging mechanism. The query param page with a minimum of 1 will deliver the desired page of a maximum of 1000 items. The total number of items is also returned.
   * GET Connections?page={number}: will return all connections with a paging mechanism that works the same.
   * PUT Connection/{id}/Description changes just the connection description, since the other properties are immutable
* The application will be cloud native, i. e. there will be a Kubernetes container built around.
* All messages are stored in separate files. The native language is English, and a German translation is provided. You may add your own translation.
* Even the field names are stored in a separate file, so it should be possible to even change the incoming field names to your language. Do this at your own risk, though!

A full table of changes to the REST API can be found at [[REST_API.ods|https://github.com/rongem/cmdb/blob/production/REST_API.ods]]