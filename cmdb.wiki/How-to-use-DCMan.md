# How to use DCMan

## Rooms and racks
DCMan is a simple user interface for asset management. Ist starts in a building overview, where you can see your exisiting rooms, grouped by building names. After selecting a room, the racks inside the room are displayed. Selecting a rack switches to a graphical rack view that allows you to add or remove assets or change status of assets.

Blade enclosures do have a backside, and turning to it shows you the blade appliances or network switches built into the enclosure.

Server hardware can add existing provisionable systems, like servers, bare metal hypervisors or software appliances.

## Models
Every asset needs a model which holds informations not only about the manufacturer, but also height units in rack or size of enclosure mountable items. A model always belongs to an asset type. Without models, you cannot create assets.

## Asset management
Creating assets is quite simple. You select an asset type, then a model for that asset type and start creating. You may create more than one asset at a time, and a mode where you can simply add the serial number to a given base name is available when adding the second item in the form. All new assets are placed in the store.

## Search
A simple search helps you find your assets by name. Just enter a part of the name. Additionally, you may reduce the number of asset types that are being found by entering text into the second field. If you type the name of a provisionable system, the connected hardware item is shown.

All results are being displayed in a table immediately after typing, and clicking on the name of an item will bring you to the rack where it is mounted. The asset gets a red border there, so that you can identify it with ease.