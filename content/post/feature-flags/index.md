---
title: Using Feature Flags
subtitle: In introduction to feature flags
date: 2019-12-17
header: feature-flag-header.jpeg
---

In it's simplest form. A feature flag is an if statement. Lets take the example of an endpoint that returns the string `"Hello World"` when the user browses to [`/greeting`](http://locahost:5000/greeting):

```java
@GetMapping("/greeting")
public String getGreeting() {
    return "Hello World";
}
```

Now lets suppose that we deploy this useful functionality to production, but after a few weeks, we get the idea that maybe we want to change it to greet the user directly by including their name from the database. Now, we could simply change this functionality and deploy a new version:

```java
@GetMapping("/greeting")
public String getGreeting() {
    var user = getUserDetails();
    return String.format("Hello %s" , user.getName());
}
```

However this version will roll out to everyone at the same time and if anything goes wrong, for example there may be a bug in `getUserDetails()`, we would then have to roll back our entire release. This may seem minor, but in the real world we may be releasing multiple features from multiple releases and the rollback will affect all of those changes too, this happens because we now have a feature *Rollout* that is tightly coupled with the *Deployment*.

A better way would be for us to perform a check on a configurable variable so that we could choose to switch between features and allow us to roll back simply by changing the value of the configuration for that feature:

```java
@GetMapping("/greeting")
public String getGreeting() {
    if (config.getBool("feature-greet-by-name")) {
        var user = getUserDetails();
        return String.format("Hello %s" , user.getName());
    }
    return "Hello World";
}
```

And that, is what I meant when I said, that a feature flag in it's simplest form, is an if statement. Its simply a check to see if the new code should be executed, and if it isn't then the old code runs as normal.

## What can go wrong?

The feature flag we implemented here 

## Hosting Unleash
You can choose to either use Unleash as a cloud service or run your own instance. This tutorial will focus specifically on the self hosted option. Which can be acheived very easily using `docker-compose`. Simply add the following to your docker-compose.yml

```yml
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

