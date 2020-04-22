# loopback4-example-book
Loopback 4 example using express server to expose customised APIs

## Features
1. Support LDAP(S) authentication
2. Support Basic authentication
3. Support basic security features using helmet
4. Support basic rate limiting
5. Support winston logger and rsyslog
6. Support integration with db2
7. Support encryption of .env

## Getting started
1. Install nodejs
2. Run: 'npm install'
3. Create .env file (refer to sample.env.txt)
4. Encode .env using: 'npx secure-env .env -s YourSecretKey'
5. Set environment variable
   * SK=YourSecretKey
   * AUTH=ldap|basic (default: ldap)
   * HOST=0.0.0.0 (default: 0.0.0.0)
   * PORT=3000 (default: 3000)
6. To start, run: 'npm start'

## Loopback Commands (optional)
1. Setup database connectivity: lb4 datasource
2. Discover models: lb4 discover
3. Setup models' repository: lb4 repository
4. Setup models' relation: lb4 relation
5. Setup sevices: lb4 service

## LDAP Setup (optional)
1. Install docker-openlap from https://github.com/osixia/docker-openldap
2. Run: docker run -p 636:636 --name my-openldap-container --detach osixia/openldap
3. Run: docker run -it -v d:/data:/data osixia/openldap /bin/bash
Get the generated certs from /container/service/slapd/assets/certs
4. Update the certs path in .env and encrypt it
5. Set environment variable to disable certificate verfication
   * NODE_TLS_REJECT_UNAUTHORIZED=0
