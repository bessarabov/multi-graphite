# multi-graphite

## Screenshots

![1](https://user-images.githubusercontent.com/47263/192137531-97765244-dd14-44a8-b5e4-e4494047aec1.png)

![2](https://user-images.githubusercontent.com/47263/192137544-c0c418fb-2846-4b01-a211-0e6adec5b756.png)

## How to run

The recommended way to run this project is to use docker.

Run the command:

```
docker run --detach --publish 8000:80 --name multi-graphite bessarabov/multi-graphite:1.1.0
```

This command will download the needed docker image and run it.

Then open http://localhost:8000 in your browser.

To stop it run the command:

```
docker rm -f multi-graphite
```

## Bookmark

It is possible to create a bookmark in the browser that converts the currently
opened graphite url to multi-graphite url.

Use the code from the file `bookmark.js`, but change
"http://localhost:8000" in the code to the address of your
installation of multi-graphite.
