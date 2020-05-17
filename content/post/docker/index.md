---
title: Docker
subtitle: The Why
date: 2020-05-17
header: header.jpg
---

There are 2 types of people, those who think [Docker](https://www.docker.com/) is an absolute game changer when it comes to web application development, and those who don't know what Docker is. If you belong to the latter group, my goal here is to make you part of the former.

Most modern web applications who's scope extends beyond "Hello World" will at some point encounter a situation where they will interact with another application over a network connection, be that a database, logging system or any other type of network application. Most of these applications require specific setup and dependencies, some can even span different languages and ecosystems, or worst of all, two different versions of the same language.

This makes it hard enough to set up in production, but can become even worse when you are trying to set up a developer environment and find that you need to install Erlang and two different versions of Ruby just to get one of your dependencies up and running so that you can work on *your* part of the app.

Docker eases the pain of installing these networked dependencies through the use of a concept called [containerisation](https://www.docker.com/resources/what-container).


## Containerisation and forklifts

Containerisation has transformed the software world, in the same way that putting real life objects inside containers has transformed the shipping industry.

Lets take a look at this forklift:
![Picture of a forklift lifting up a shipping container](t1.jpg)
> A forklift can only lift containers

You will notice something about this forklift: it can only lift one kind of object. It would be impossible, or at least damaging if we were to attempt to use it to lift a car, or a pile of boxes or a shipment of sensitive electronics, yet this forklift probably lifts all of these objects every single day, that's because all of these differently shaped objects are stored *inside* of shipping containers, and the forklift is really good at lifting those.

Docker containers are the software equivalent of those shipping containers, they can contain different types of software that have different dependencies but because they are in a container it allows us to treat them all the same way.

## A concrete example

Let's take an example. I have a linux machine that does not have Java installed, if I run the java command, I get the following:

```bash
divan@linuxbox:~$ java

Command 'java' not found, but can be installed with:

sudo apt install default-jre
sudo apt install openjdk-11-jre-headless
sudo apt install openjdk-8-jre-headless
```

Now If I wanted to run an application like [Zipkin](https://zipkin.io/pages/quickstart.html) for example. I would need to first install java on this machine. However, I have another alternative. I could instead pull down a container with the application and all of its dependancies inside it and docker would know how to run it.

So instead of running:
```bash
curl -sSL https://zipkin.io/quickstart.sh | bash -s
java -jar zipkin.jar
```

I would run:
```bash
docker run -d -p 9411:9411 openzipkin/zipkin
```



## Why compose matters

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgRkUoRnJvbnRlbmQpIC0tPiBHXG4gIEcoR2F0ZXdheS9CRkYpIC0tPlUoVXNlciBTZXJ2aWNlKVxuICBVIC0tPiBEQlsoUG9zdGdyZXMpXVxuICBVIC0tPiBSW1JhYmJpdE1RXVxuICBSIC0tPiBNKE1haWwgU2VydmljZSlcbiAgVSAtLT4gTChHcmFwaCBNYW5hZ2VtZW50IFNlcnZpY2UpXG4gIEwgLS0-IE5bKE5lbzRqKV1cblx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgRkUoRnJvbnRlbmQpIC0tPiBHXG4gIEcoR2F0ZXdheS9CRkYpIC0tPlUoVXNlciBTZXJ2aWNlKVxuICBVIC0tPiBEQlsoUG9zdGdyZXMpXVxuICBVIC0tPiBSW1JhYmJpdE1RXVxuICBSIC0tPiBNKE1haWwgU2VydmljZSlcbiAgVSAtLT4gTChHcmFwaCBNYW5hZ2VtZW50IFNlcnZpY2UpXG4gIEwgLS0-IE5bKE5lbzRqKV1cblx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)




> Header photo by https://unsplash.com/@chuttersnap