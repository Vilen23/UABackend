# Setup Guide for Running the Application 

This guide explains how to clone the repository, build the Docker image, and run the image to run the application.

- [Running with Docker](#running-with-docker)
- [Running without Docker](#running-without-docker)

# Running With Docker

## Clone the Repository
```sh
git clone https://github.com/Vilen23/UABackend
cd UABackend
```
## Provide your database
- make sure to add your db link in .env file
```sh
DATABASE_URL="{Your url here}"
```
## Build the docker image
```sh
docker build -t your-image-name .
```

## Run the docker image
```sh
docker run -p 8000:8000 your-image-name
```

## Note: Ensure Docker is installed on your system before proceeding.

# Running Without Docker

## Clone the Repo
```sh
git clone https://github.com/Vilen23/UABackend
cd UABackend
```

## Instal Dependency
```sh
npm install
```
## Add database url
- In the .env file add your database url
```sh
DATABASE_URL="{Your DB url}"
```

## Generate prisma client
```sh
npx prisma generate
```
## Compile the src file
```sh
tsc -b
```

## Start the server
```sh
node dist/index.js
```
