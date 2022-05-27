# multi-graphite

## How to run

The recommended way to run this project is to use docker.

Run the command:

```
docker run --detach --publish 8000:80 --name multi-graphite bessarabov/multi-graphite:1.0.0
```

This command will download the needed docker image and run it.

Then open http://localhost:8000 in your browser.

To stop it run the command:

```
docker rm -f multi-graphite
```
