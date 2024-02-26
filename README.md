# Vota Web Frontend

# Run Dockerized version

First, you need to define the base URI for the **vota backend** in dotenv (.env) file like this:

```
PUBLIC_API_URL='http://localhost:31401/api'
```

Then, run

    docker build -t vota_frontend .

to build the Docker container. Run 

    docker run -it -p 10082:3000 vota_frontend

to run the Docker container. Run

    docker exec -it [container_name] /bin/sh

to start a bash inside your Docker container.