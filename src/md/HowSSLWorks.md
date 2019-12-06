---
PageTitle: How SSL works
Date: 12/05/2019
Author: Ramkumar
---

- Symmetric Encryption
	- Single key shared between client and server.
	- Difficult to share the key securely.
- Asymmetric Encryption 
	- public and private key. 
- Handshake
	- Step #1
		- Browser sends
		- SSL/TLS version
		- Encryption Algorithm
	- Step #2 
		- Browser Receives
		- Preferred SSL/TLS version
		- Encryption Algorithm
		- Public Key ( who I am)
	- Step #3 
		- Verify 
		- received server certificate
		- Generate pre-master key (for generating unique key)
		- Encrypt pre-master key with received public key
		- Send the encrypted pre-master key to server
    - Step #4
	  - Server decrypt pre-master key with its private key

- Used public & private key to encrypt pre-master key so nobody could spy on it
- Now both generate the same "shared secret" to use as symmetric key

    - Step #5
		- Browser sends test message encrypted by "shared secret"
		- server responds "looks good" encrypted by "shared key"

	- Step #6
		- now all messages are secured for rest of the session.

- HTTPS - Secure HTTP. 
	- Data Encrypted using SSL/TLS
	- SSL - Secure Socket Layer
	- Netscape gave control of SSL to IETF[ Internet Engineering Task Force]
	- IETF released TLS in 1999 (SSL v3.1)
	- TLS - Transport Layer Security
	- TLS 1.1 - release in 2006
	- TLS 1.2 - release in 2008
	- Browsers catch up on TLS only by 2013
	- SSL deprecated in 2015
	- TLS 1.3 - release in 2018
- Certificate Authority [CA]
	- 3rd party organization
		- issues certificate
		- confirm identity of certificate owner
		- providing proof that certificate is valid
	- Root Store
		- Database of trusted CAs
	-Types
		- Domain Validated
		- Organization Validated
			- validation & manual verification of organization
		- Extended Validation
			- exhaustive verification of business
	- How validation happens ?
		- CA sign certificate with root certificate pre-installed in root store.
		- This is usually "intermediate certificate"
		- if any violation, intermediate certificate is revoked.
		- Validation happens by "chain of trust"
		- Browser -> connects site & downloads certificate(not root certificate but intermidiate)
		- Browser looks up cert which signed intermediate cert
		- Once all the chain of cert is trusted, the site cert is trusted
		- In case last cert is not root, it is untrusted
		- self-signed certs are free but browsers look for certs from trusted CAs


