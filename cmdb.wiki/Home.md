# CMDB

*Read this in other languages: [Deutsch](Home.DE)

## History

The project CMDB was born in an urge for a generic and flexibe configuration management database with all the functionality of a CMDB, but without buying one immediately.

Because the definition of CMDB is not protected, every manufacturer is allowed to sell his product as a CMDB.
Most of the products however descend from a base product, e.g. an asset management or cable management solution.
So they carry all the dead weight of those features.

An asset management for example will insist on entering weight and height of an item, even though this is useless for a configuration item like a database cluster.

These legacy features are often an embarrassement or obstacle on finding smart solutions, so you have to be very clear on what type of software you exactly need, if you want to buy successfully.
I figured out that you cannot find this knowledge in theory alone, so I started this project to aquire the knowledge for writing the specification in a practical way.


## Features

You may define as many item types as you need in the CMDB. You may attach attributes to every item type, and for simpler handling the attribute types are grouped. Also every item can connect to other items.

Every connection has a type and a direction. Direction means that one item is the upper item and the other one is the lower item. The direction of all connections within your CMDB should be chosen in a consistent way. The main direction is at your choice, you may define the rooms of you datacenter at the top and the services at the bottom of the model or vica versa.

One important feature of this CMDB is to search along connections. This lets you find out e.g. which services are down when a datacenter room is offline.

## How to work with this

The CMDB will start completely empty, there is no predefinded data model. So every administrator first has to define all types (items, attributes, connections) and connection rules before he can use the CMDB. The reason for starting without a data model is my experience that you will use your CMDB much better if you create your own schema instead of starting with hundreds of attributes that you may never need. You may also easily change the structure, since you can migrate an attribute type into an item type, and all the corresponding attributes will be changed to items automatically. That gives you room for testing and developing without to much pain about making wrong decisions.

Your goal should not only be the knowledge which item and attribute types you need, but also, who will be responsibly for the maintainance of the data. You shouldn't scan the market for a product until both aspects settled.

## Disadvantages

This CMDB is a simple system. The high flexibility is dearly bought by leaving all attributes as text fields, so it's harder to enum values, define allowed ranges oder make syntax or consistency checks. Recently I added a regular expression check for every attribute value that allows to build check, e.g. to allow only IP addresses.

There are only three roles: administrators, editors and readers. Administrators manage users and have write access to to types and rules. Editors can change any item that they take responsibility for. There is a history journal in the database to find changes and their authors, or to undelete items. You will have to do this manually in the database. You cannot restrict editors to item types. Also any user who can authenticate to the system will be able to read all items. So you shouldn't store secrets in the database.

## AddOns

The philosophy of the CMDB is a federated system. Every item can have dozends of hyperlinks to link items to other systems like wikis or monitoring systems, where more information about an item can be found. Also you are able to address every single item of the CMDB with an unique URL, so you can reach the item from other systems.

The system has a full featured REST API, so any other programm can access the data and use all the functions, even the administrative ones. The security mechanism, that protects the user interface, also protects the APIs, so that a user has exactly the same rights everywhere. You authenticate over HTTP with Microsoft Windows users of the domain.

An Angular frontend is accessing the CMDB over the REST API.

There is an alternative Angular client called datacenter manager (DCMan), which requires a data model being automatically configured in the CMDB once you connect it. It also shows that the CMDB can be used with an extra layer that provides value restrictions and even workflows. It is no longer production ready and therefor removed.

You may also write your own clients or connectors to production systems like VMware, HP OneView or others.

## Prerequisites

The project **njs-backed** with the solution CMDB is a node/express application. It requires node to be installed. The data will be saved in a MongoDB noSQL database.

The project **ng-frontend** contains three Angular apps: _cmdb_, _dcman_ and _migration-tool_. Each needs a web server, where the 404 error points to index.html. The apps _cmdb _and _dcman _need the library _backend-access_.

## Road Map

Then this whole system will be designed as a containerized app, so you can run it on any Kubernetes cloud.

I also plan another frontend that looks a little like Microsoft SharePoint, presenting each configuration item type as a table.