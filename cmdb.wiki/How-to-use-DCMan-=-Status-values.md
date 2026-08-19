# How to use DCMan = Status values
DCMan uses status values to represent the assets' lifecycle. Every new asset starts with the status "in store", which means it is not yet mounted into something.

As soon as you mount an asset into a rack or enclosure, it get the status "not in use". An exception are assets that are being mounted into the back side of a blade enclosure, like switches. They get the status of the enclosure and change it together with the enclosure as long as they are mounted.

From the status "not in use", wich means that the asset is installed, but not in use, you can set different status values: "Booked", "in production", "fault" or "prepare for scrap".

"Booked" means that you promised the asset to a purpose. A booked asset can be set back to "not in use" or to "in production".

"In production" means that the asset is used for any purpose - which also may serve as a test system. Server hardware must be connected to a provisionable system like a server or a bare metal hypervisor to be set to "in production".

"Fault" means the asset has a malfunction. You can decide to repair it or to scrap it.

"Repair pending" is set when you decided to repair the faulty asset. After the repair, it may go back to "in production", to "prepare for scrap" or to "not in use".

"Prepare for scrap" tells you that the asset is no longer used. If it is server hardware, the provisionable system is being deleted, so you should move it to another server hardware before, if you want to keep it.

"Pending scrap" means that all the groundwork is done before finally scrapping the asset. It is still mounted to its container asset, until you scrap it.

"Scrapped" means that the asset is being thrown away. Items of that status cannot be used for mounting or other purposes. If changing to that status, any connection to other assets is lost.