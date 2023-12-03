# vota-web-frontend

# Run Dockerized version

Run

    docker built -t vota_frontend .

to build the Docker container. Run 

    docker run -it -p 10082:3000 vota_frontend

to run the Docker container. Run

    docker exec -it [container_name] /bin/bash

to start a bash inside your Docker container.