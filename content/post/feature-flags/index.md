---
title: Feature Flags and Progressive Delivery
subtitle: An introduction using Unleash
date: 2020-01-10
header: feature-flag-header.jpeg
---

In it's simplest form. A feature flag is an if statement. Lets take the example of an endpoint that returns the string `"Hello World"` when the user browses to [`/greeting`](http://locahost:5000/greeting):

```ts
app.get('/greeting', (req, res) => {
    res.send('Hello Hello')
})
```

Now lets suppose that we deploy this useful functionality to production, but after a few weeks, we get the idea that maybe we want to change it to greet the user directly by including their name from the database. Now, we could simply change this functionality and deploy a new version:

```ts
app.get('/greeting', (req, res) => {
    let user = getUserDetails(req)
    res.send(`Hello ${user.name}`)
})
```

However this version will roll out to everyone at the same time and if anything goes wrong, for example there may be a bug in `getUserDetails()`, we would then have to roll back our entire release. This may seem minor given this simple example, but in the real world we may be releasing multiple features in a single release and the rollback will affect all of those changes too, this happens because we now have a feature *Rollout* that is tightly coupled with the *Deployment*.

What we want to do is decouple Rollout and deployment. A better way would be for us to perform a check on a configurable variable so that we could choose to switch between features and allow us to roll back simply by changing the value of the configuration for that feature:

```ts
app.get('/greeting', (req, res) => {
    if (config.getBool('greet-by-name-feature')) {
        let user = getUserDetails(req)
        return res.send(`Hello ${user.name}`)
    }
    res.send('Hello World')
})
```

And that, is what I meant when I said that a feature flag in it's simplest form is an if statement. Its simply a check to see if the new code should be executed, and if it isn't then the old code runs as normal.

## Managing flags

The feature flag we implemented here allows us to roll out and roll back without redeploying our application, but there are risks. Depending on how our `config.getBool()` funciton works, we may need to still restart the application to cause the value to change, or the value may live inside a config file that we would have to remote into the production server to change, which in a microservices architecture could be near impossible to get right.

Ideally we would want to have a centralised  management system for these flags so that we can respond more rapidly if we need to roll back a feature. While there isn't necessarily anything wrong with rolling your own feature flag system, it is a domain on it's own that requires many considerations 

## Progressive delivery

As you can see, feature flags on their own can be valuable because they decouple rollout from deployment, we can easily switch between our old and new code simply by changing a value in our configuration.



[Progressive Delivery](https://searchitoperations.techtarget.com/definition/progressive-delivery)

## Choosing a feature flag system

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

