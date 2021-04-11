---
PageTitle: Azure Architect Notes
Date: 04/05/2021
Author: Ramkumar
---

Draft -- 

I will update as I find time. 

## Azure Disk Caching 

![AzureDiskCaching](/img/azure/AzureDiskCaching.png)

Azure Disks are standalone resource. They have few types -- 

- OS Disk (Default)
- Temporary Disk 
- Data Disk 
- Ephemeral OS Disk

Support 2 types of caching -

- Read-Only Cache 

This type of cache setup supports services reading from it , but writing directly to blob storage 
- Write-Back Cache 
In this type, we have services writing to cache and which later writes to blob storage when OS instructs it to. 

