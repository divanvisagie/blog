<h1 class="title">Docker</h1>
<h2 class="subtitle">The Why</h2>
<span class="date">2020-05-17</span>


There are two types of people, those who think [Docker](https://www.docker.com/) is an absolute game changer when it comes to web application development, and those who don't know what Docker is. If you belong to the latter group, my goal here is to make you part of the former.

Most modern web applications who's scope extends beyond "Hello World" will at some point encounter a situation where they will interact with another application over a network connection, be that a database, logging system or any other type of network application. Most of these applications require specific setup and dependencies, some can even span different languages and ecosystems, or worst of all, two different versions of the same language.

This makes it hard enough to set up in production, but can become even worse when you are trying to set up a developer environment and find that you need to install Erlang and two different versions of Ruby just to get one of your dependencies up and running so that you can work on *your* part of the app.

Docker eases the pain of installing these networked dependencies through the use of a concept called [containerisation](https://www.docker.com/resources/what-container).


## Containerisation and forklifts

Containerisation has transformed the software world in the same way that putting real life objects inside containers has transformed the shipping industry.

Lets take a look at this forklift:
![Forklift lifting up a shipping container](t1.jpg)
> A forklift can only lift containers

You will notice something about this forklift: it is designed to lift only one kind of object. It would be impossible, or at least damaging if we were to attempt to use it to lift a car, or a pile of boxes or a shipment of sensitive electronics, yet this forklift probably lifts all of those objects every single day. This is because all of these differently shaped objects are stored *inside* of the shipping containers, and the forklift is really good at lifting those.

Docker containers are the software equivalent of those shipping containers, they can contain different types of software that have different dependencies, but because they are in a container it allows us to treat them all the same way.

## A concrete example

Let's take an example. I have a Linux machine that does not have Java installed, if I run the `java` command, I get the following:

```bash
divan@linuxbox:~$ java

Command 'java' not found, but can be installed with:

sudo apt install default-jre
sudo apt install openjdk-11-jre-headless
sudo apt install openjdk-8-jre-headless
```

Now If I wanted to run an application like [Zipkin](https://zipkin.io/pages/quickstart.html) for example. I would need to first install Java on this machine. However, I have an alternative; I could instead set up Docker and pull down a container with the application *and* all of its dependancies inside it and docker would know how to run it.

So instead of running:
```bash
curl -sSL https://zipkin.io/quickstart.sh | bash -s
java -jar zipkin.jar
```

I would run:
```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```

This will start up a copy of the Zipkin Docker image, exposing the port 9411 as 9411 on your machine, and if it doesn't find it on this local machine, it will pull it from [DockerHub](https://hub.docker.com/r/openzipkin/zipkin/).Once it is set up, you will be able to browse to zipking at [http://localhost:9411](http://localhost:9411)

Now this may seem pointless right now, since I have only replaced the one software install (Java) with another software install (Docker), but let's take this a step further and install [Unleash](https://github.com/Unleash/unleash) on our machine. 

Unleash requires [Node.JS](https://nodejs.org/en/) to be installed, and perhaps more importantly, It requires an instance of [PostgreSQL](https://www.postgresql.org/).

Because we are using docker, this won't be much of a problem because the interface is the same

```bash
docker run --name unleash-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

And now we simply install unleash with the same command:

```bash
docker run -e DATABASE_URL=postgres://user:postgres@[host-ip]:5432/unleash -p 4242:4242 -d unleashorg/unleash-server
```

Unleash will start up with node inside its container and will have access to this PostgreSQL instance since the port has been made available.

This shows you the power of docker, being able to set up applications quickly and easily and all with the same management interface.

## Compose

Running commands is great but I would like to introduce one last concept because to me, it was the feature that made docker useful to me as a developer, and that is compose. If applications are shipping containers then compose is the shipment. It allows you to define environments such as the one above and have you set them up, or tear them down at will.

Compose lets us handle the environment above with a single command by defining it in a `docker-compose.yml` file

```yaml
version: '3'
services:
  unleash:
    image: unleashorg/unleash-server:3.1
    ports:
      - "4242:4242"
    environment:
      DATABASE_URL: postgres://postgres:unleash@db/postgres
    depends_on:
      - db
  db:
    expose:
      - "5432"
    image: postgres:10-alpine
```

This will reduce the unleash environment in our previous example to running:

```bash
docker-compose up
```

In the directory that contains the definition file. Compose as a developer tool, especially when dealing with networked applications is envaluable and allows us to simulate having multiple machines without having to own our own data-center.

It also is the tip of the iceberg in a concept called Container Orchestration, which allows us to spin up and tear down server applications at will in response to load. That is beyond the scope of this article, but is definately a contributing factor to Docker's popularity in production environments.


