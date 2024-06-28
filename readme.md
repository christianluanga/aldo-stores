# Aldo Shoe Store App

**Prerequisites:**
- Ensure Docker and docker-compose are installed on your machine.
- Ensure Docker Engine is up and running.

For your convenience, Docker files are included to set up containers for the database, server, and client. 
Use the following command to build and start all services:
```bash
    docker-compose build
    docker-compose up
```


To do the setup in different stages see the instructions below.

# Server 

## Initial setup

1. cd into the server
```bash
cd server/
```
2. Run the following command to set up the server, including Docker container setup for PostgreSQL:
```bash
npm run initial:setup
```

This command will:

* Start a PostgreSQL database using Docker.
* Install necessary dependencies (npm i --legacy-peer-deps).
* Set up the database schema (ts-node db_setup.ts).
* Start the server (npm start).

## After initial setup

- After the initial setup, start the server with:
```bash
npm run start:dev
```
- To reset the database schema and seed data:
```bash
npm run db:setup
```

# Client 

1. cd into the server
```bash
cd server/
```

2. install npm modules
```bash
npm install 
```

3. start the app
```bash
npm start
```

