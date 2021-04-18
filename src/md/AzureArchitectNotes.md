---
PageTitle: Azure Architect Notes
Date: 04/05/2021
Author: Ramkumar
---

Draft -- 



I will update as I find time. 

## Azure Disk Caching 

![AzureDiskCaching](/img/azure/AzureDisksCaching.png)

Azure Disks are standalone resource. They have few types -- 

- OS Disk (Default)
- Temporary Disk 
- Data Disk 
- Ephemeral OS Disk

Support 2 types of caching -

- Read-Only Cache 

This type of cache setup supports services reading from it , but writing directly to blob storage 
- Write-Back Cache 
    - In this type, we have services writing to cache and which later writes to blob storage when OS instructs it to. 


### Virtual Network Peering 

- Virtual Networks are isolated by default. 
- 2 different virtual networks cannot talk to each other. 
- If you want VNets to share and know each other, we need to do `Peering` 

#### Limitations 

![LimitationsPeering](/img/azure/PeeringLimitations.png)

- you cannot have same address spaces in Virtual Network involved in the peering 
- Cannot have transitive communication. Look for VPN Gateway if you need one. 


### VPN Gateway

- It uses public IP with encryption - IPSEC Tunnel 
- Will support transitive communication between VNETs in Hub and Spook model 

![VPN Gateway](/img/azure/VPN_gateway.png)

![advanced connection](/img/azure/Adv_vnet_connection.png)


### Service Endpoints

![ServiceEndpoints](/img/azure/ServiceEndpoints.png)

- To open up Azure managed Services to connect with VNets
- Private IP Address of VNet is known to Services 
- Established over the private connection utilizing Azure Microsoft Backbone connections 
- Not all services are supported
- This is at subnet level
- It all happens within Azure 







