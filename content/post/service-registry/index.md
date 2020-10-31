<h1 class="title">Service Registry Pattern</h1>
<h2 class="subtitle">An easier way to connect services</h2>
<span class="date">2020-06-28</span>


Microservice architectures are popular these days, but while they provide certain benefits they also introduce new problems. One of these problems is that even if you have only a few services, connecting to them via IP address can quickly become painstaking.

Lets take the following system as an example.

<img alt="Collection of services behind a gateway" src="system.svg" class="themed">

In order for our gateway to be able to call the services it needs, it will have to know about:

- The User Service on `10.0.0.2`
- The Timeline Service on `10.0.0.5`
- The Announcement Service on `10.0.0.4`

Any downstream services will also have to be configured in order to know about their downstream services, e.g. *Timeline Service* will have to know about the *Announcement Service* on `10.0.0.4`.

# How this becomes a problem

Now lets imagine a scenario where a new version of the *Announcement Service* is deployed. As part of a [blue/green deployment strategy](https://martinfowler.com/bliki/BlueGreenDeployment.html), the IT team has decided that the new version of the Announcement Service will be deployed on a new box (`10.0.0.6`). Then all the upstream services will be updated to point to `10.0.0.6` instead of `10.0.0.4`.

If our servers are configured with a file like a *Web.config* or *application.properties* then we will need to update the configurations for both our *Gateway* and *Timeline Service*. Most times these sorts of configurations also require the service to be restarted in order to take effect, so even in this system with only a few services, the disruption is quite severe, taking out 3 services just because we deployed one new one. This is the problem that the Service Registry tries to solve.

# The Service Registry

You can think of a service registry as a central database of all the services that are currently running. When a new service or instance of a service is spun up, it registers itself with the service registry. 

<img alt="Collection of services behind a gateway using a service registry" src="registry_(1).svg" class="themed">

Now, when a service needs to know about the location of another in order to make a call, it can be routed to the correct IP address based on the name.

Let's take our example again, if we could peer into the service registry, we would see the following information once everything is running:

<table>
<thead>
<tr>
<th>Service Name</th>
<th>Instances</th>
</tr>
</thead>
<tbody>
<tr>
<td>gateway</td>
<td>10.0.0.0</td>
</tr>
<tr>
<td>user-service</td>
<td>10.0.0.2</td>
</tr>
<tr>
<td>email-service</td>
<td>10.0.0.3</td>
</tr>
<tr>
<td>announcement-service</td>
<td>10.0.0.4</td>
</tr>
<tr>
<td>timeline-service</td>
<td>10.0.0.5</td>
</tr>
</tbody>
</table>

When our *Gateway* or *Timeline Service* want to make a call to the *Announcement Service*, instead of using the IP configured directly in their config file, they will ask the service registry which instances are available and map the name to the appropriate IP address.

This allows our code to make direct references to the API by name, for example we could get a list of announcements by directly pointing our GET request to `http://announcement-service/api/v1/announcement`.

```java
AnnouncementList response = restTemplate.getForObject(
  "http://announcement-service/api/v1/announcement",
  AnnouncementList.class);
List<Announcement> employees = response.getAnnouncements();
```

# Service Discovery

In the above example the **announcement-service** portion of our URL would have been replaced with the IP address of the *Announcement Service*, in our case `10.0.0.4`.

So:

 <code class="codehilite" style="background: var(--code-background);"><span class="s">- "http://announcement-service/api/v1/announcement"</span></code>

Would have become:

<code class="codehilite" style="background: var(--code-background);"><span class="ne">+ "http://10.0.0.4/api/v1/announcement"</span></code>

The means by which this replacement happens though is by a concept called **Service Discovery**.

There are 2 patterns for Service Discovery:

**[Server-side Service Discovery](https://microservices.io/patterns/server-side-discovery.html)** operates at a network level, where a router, or load balancer sits on the network between the client service and the rest of the network, the router can then forward calls to the correct IP address based on the information it gets from the Service Registry.

**[Client-side Service Discovery](https://microservices.io/patterns/client-side-discovery.html)** on the other hand, implements this logic for routing and load balancing in the client service itself with all of the code for this logic being packaged as part of the client service.

Whether client or server side though, Service Discovery is the part of the system that makes the decision on which instances of a service to call and it does this using the information it gets from the Service Registry. 

So far we have only ever had one instance of each of our services, but as I mentioned, service discovery usually also contains a [load balancer](https://en.wikipedia.org/wiki/Load_balancing_(computing)). Lets think back to our deployment scenario. What happens when we spin up our new *Announcement Service* on `10.0.0.6`?

<table>
<thead>
<tr>
<th>Service Name</th>
<th>Instances</th>
</tr>
</thead>
<tbody>
<tr>
<td>gateway</td>
<td>10.0.0.0</td>
</tr>
<tr>
<td>user-service</td>
<td>10.0.0.2</td>
</tr>
<tr>
<td>email-service</td>
<td>10.0.0.3</td>
</tr>
<tr>
<td>announcement-service</td>
<td>10.0.0.4, 10.0.0.6</td>
</tr>
<tr>
<td>timeline-service</td>
<td>10.0.0.5</td>
</tr>
</tbody>
</table>

The new *Announcement Service* registers itself and we now see multiple IP addresses under the announcement-service name. In this case, the load balancer will make a decision based on how many requests it has already routed and try to keep a balance between sending requests to `10.0.0.4` and `10.0.0.6`.

# Health checks

Service Registries have another tool up their sleeve and this one will be the final one we need to solve our blue/green deployment problem, they constantly check to see if a service is still running, this is usually done by checking a `/health` endpoint on the service. This means that when a service is shut down, it is removed from the registry.

In the case of our mythical deployment. This means that once we have started up the new version of the Announcement Service, we can simply shut down the old instance, and the load balancer will go back to only having a single option (`10.0.0.6`) to choose from.

So, in this case, implementing a Service Registry and Service Discovery in our system has taken our deployment from:

1. Spin up new Announcement Service 
2. Update Timeline Service configuration
3. Restart Timeline Service
4. Update Gateway configuration
5. Restart Gateway
6. Shut down old Announcement Service

To:

1. Spin up new Announcement Service
2. Shut down old Announcement Service

# Other Uses

Our imaginary deployment scenario is just one benefit of decoupling IP address configuration from your systems though, and you will get a lot of value from using a service registry in your architecture. As we mentioned, these solutions also contain load balancing features and in a high volume environment you will more than likely be running multiple instances of the same service at which point manual IP configuration would become a complete nightmare to manage. In fact, managing manual configurations will become Impossible when using container orchestration tools that will spin up and tear down services automatically in response to high traffic.

Of course if your system is extremely large or complex a [service mesh](https://en.wikipedia.org/wiki/Service_mesh) might be a more scalable option, but the service registry and client side service discovery patterns are actually quite conceptually simple  and it can take very little to set up an existing solution like [HashiCorp's Consul](https://www.consul.io/) or the old classic [Apache ZooKeeper](https://zookeeper.apache.org/).
