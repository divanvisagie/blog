<h1 class="title">Sbt heiroglyphs and multi-projects explained</h1>
<h2 class="subtitle">A starter guide to understanding what an sbt file is actually saying</h2>
<span class="date">2016-06-24</span>


![SBT Logo](sbt-logo.png)

When you get started with Scala one of the first things you are going to come across is sbt, Scala’s very own build tool. When I started using Scala, I just generated projects via *Activator* and ran the basic *test* and *run* commands in sbt. When things get serious though, you need to add some libraries.

So you open up the *build.sbt* file and are greeted with things that look like madness: the `:=`, `+=` and `%%` . You think to yourself "I just started this thing and now I’m doing category theory!". Don’t worry, this is not category theory, that only comes in later when you start doing monadic light-bending builds. These operators are just how sbt deals with settings. Let’s take a look at the basic build settings of the *minimal-scala* project that Activator spits out and focus on the symbols used in the basic default [build definition](http://www.scala-sbt.org/0.13/docs/Basic-Def.html) which builds a single project in the *src/* directory.

```scala
name := """minimal-scala"""version := "1.0"scalaVersion := "2.11.7"// Change this to another test framework if you prefer
libraryDependencies += "org.scalatest" %% "scalatest" % "2.2.4" % "test"
```

The symbols in here work like this:

`:=` Tells sbt we are assigning a setting to the key in the build definition

`+=` Appends rather than assigns , as some keys are sequences. This is a really good idea , as in general most projects have more than one library dependency. There are other ways to append keys as well , such as `++=` which will add a sequence to a key:

```scala
libraryDependencies ++= Seq( 
  "com.twitter" %% "finagle-core" % "6.34.0", 
  "com.twitter" %%  
  "finagle-stats" % "6.34.0", 
  "com.twitter" % "finagle-thrift_2.11" % "6.34.0", 
  "org.apache.thrift" % "libthrift" % "0.9.0" % "compile" 
)
```

`%` and `%%` get a little tricky , they define the ids and versions of each library in the sequence, but it’s safe to say that:

```scala
"org.scala-tools" % "scala-stm_2.11.1" % "0.3"
```

Is the equivalent of

```scala
"org.scala-tools" %% "scala-stm" % "0.3"
```

So effectively the extra `%%` means it figures out what Scala version you are on. You can read more on library dependencies in the [docs](http://www.scala-sbt.org/0.13/docs/Library-Dependencies.html).

That actually covers it for the heiroglyphs , they are really not too bad once you understand their meaning, and this simple setup can get your Scala project running, testing and managing your dependencies.

# The multi project build

So far, we have covered a simple build that , as I mentioned, builds stuff in src/. Sooner or later however you are going to run into a situation where you want to have multiple build definitions for projects that sit in different directories.

Enter the Multi project build! In one of these builds, each project lives in its own base directory and builds its own jar.

![Captain Jack Sparrow holding a jar of dirt](jarofdirt.jpeg)

Sbt can define a project by defining a `lazy val` of type `Project`

```scala
lazy val utes = project.in(file("util"))
```

The name of the `val` will be the name when we refer to the project in sbt, so in the case above, *sbt utes/compile* will compile the util project

Twitter’s [finatra-activator-thrift-seed](https://github.com/twitter/finatra-activator-thrift-seed) is a nice [example](https://github.com/twitter/finatra-activator-thrift-seed/blob/master/build.sbt) of these in practise, so we will use it as an example to work through.

First let’s look at the *baseSettings*:

```scala
lazy val baseSettings = Seq(
  version := "1.0.0-SNAPSHOT",
  scalaVersion := "2.11.7",
  ivyScala := // ivy stuff,
  libraryDependencies ++= Seq(
    // libs
  ),
  resolvers ++= Seq(
    Resolver.sonatypeRepo("releases"),
    "Twitter Maven" at "https://maven.twttr.com"
  ),
  fork in run := true
)
```

This is a list of common settings that is shared across the subsequent projects, this means we don’t have to repeat libraries or any other settings that may apply to all of the projects in the build file.

Now, lets take a look at the *root* project:

```scala
lazy val root = (project in file(".")).
  settings(
    name := "activator-thrift-seed",
    organization := "com.example",
    moduleName := "activator-thrift-seed"
  ).
  aggregate(
    idl,
    server)
```

Here, the *aggregate* method will aggregate the projects, treating them as one, so when you run *sbt compile* for example, both **idl** and **server** projects will compiled.

Next lets take a look at the *idl* project:

```scala
lazy val idl = (project in file("idl")).
  settings(baseSettings).
  settings(
    name := "thrift-idl",
    moduleName := "thrift-idl",
    scroogeThriftDependencies in Compile := Seq(
      "finatra-thrift_2.11"
    ),
    libraryDependencies ++= Seq(
      "com.twitter.finatra" %% "finatra-thrift" % versions.finatra
    )
  )
```

This one is quite normal, the only thing to notice here is the *settings(baseSettings)*, which is how we tell this project it needs to pull in those base settings from earlier, other than that the second settings block is just the normal single project style configuration we saw earlier in the article.

Finally let’s take a look at the *server* project:

```scala
lazy val server = (project in file("server")).
  settings(baseSettings).
  settings(
    name := "thrift-server",
    moduleName := "thrift-server",
    libraryDependencies ++= Seq(
      // libs
    )
  ).
  dependsOn(idl)
```

This is the same as the *idl* project but has a *dependsOn* method, which creates an ordering between the two projects , as *server* requires *idl* to build first. Running *sbt server/compile* will build the dependency before the server, this is great in this case where *server* relies on files that come from the *idl* build.

Great, you can now understand and theoretically implement multi-projects. If you want to learn more about them sbt has provided [this doc](http://www.scala-sbt.org/0.13/docs/Multi-Project.html).
