Here’s a complete README.md file combining everything in one place:

# Project Setup with Docker

This project contains a **frontend** and a **backend** service, each with its own Dockerfile. The easiest way to run the full application is using **Docker Compose**.

## Prerequisites

- Docker installed on your machine.
- Docker Compose installed.

## Setup Instructions

1. Make sure the **backend** folder contains a `.env` file with the following environment variables:

```env
DATABASE_URL="mongodb://root:123456789@database_mongo:27017/stock?authSource=admin"
JWT_SECRET_ACCESS='v9F#x!8Pq2$Lm7@Tz4&Yn1*Kr5^Bw0!Q'
JWT_SECRET_REFRESH='f93A!d7LqP@1z$X0wE4^bN2mR8#sK6uH&yT9pV5jQ*G3cZ1oD!hF7$M0tW2L@8'


From the root of the project, run:

docker-compose up


Docker will build and start both the frontend and backend containers.

Once running, you can access the frontend app in your browser at:

http://localhost:8000


The backend API is available at:

http://localhost:3000

Notes

The frontend and backend communicate through Docker networking, so you don’t need to change URLs in the code.

Make sure Docker is running before executing docker-compose up.

If you make changes to the Dockerfiles or dependencies, you may need to rebuild the images with:

docker-compose up --build


That's it! Your application should now be running and accessible.
```
