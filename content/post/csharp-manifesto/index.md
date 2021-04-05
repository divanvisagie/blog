<h1 class="title"> The C# Improvement Manifesto </h1>
<h2 class="subtitle">Thoughts on possible improvements to the C# language</h2>
<span class="date">2021-04-01</span>

C# is a rapidly evolving language used across large portions of the business world to write all sorts of applications that the average consumer will never see or care about, like Bing. From its inception C# has served as a vehicle to trick .Net programmers into learning new things, like how its mere existence taught the Visual Basic crowd to effectively learn Java.

This initial success lead to Microsoft viewing the language as a tool to assist people who still ride their mountain bikes with training wheels on (but with no helmet) at the age of 35.

For example while others in the industry decided to adopt things like [standard persistence apis](https://en.wikipedia.org/wiki/Java_Persistence_API), Microsoft had to use their control over the language to [trick C# programmers](https://www.entityframeworktutorial.net/Querying-with-EDM.aspx) into thinking that they were still writing sql injection vulnerabilities. 

All of these changes over the years have lead to a language with many facets that, because it evolved over time, has in some cases become inconsistent. This manifesto is a suggestion of improvements that can be made to the language to improve its readability and usefulness and potentially open it up to use on more runtime environments.

# Syntax

## Function Names

In C# the naming convention causes both functions and classes to start with a capital letter, this makes it hard to determine if we are talking about a function or a type, especially if we are not reading the code in an IDE. We suggest renaming functions and methods to start with a lowercase letter so that they can be distinguished from classes and types. These changes should also happen in core libraries to bring them into line with how people should write C#.

**Remove**

```csharp
public Int32 Sum(Int32 x, Int32 y)
{
	return x + y;
}
```

**Add**

```java

public Int32 sum(Int32 x, Int32 y) 
{
	return x + y;
}
```

## Type Names

Lowercase type names imply primitive types, however in C# these types are actually objects so `string` is interchangeable with `String`. As part of the movement to align type names, all types that are objects should start with capital letters.

**Remove**

```csharp
string
int 
decimal
```

**Add**

```java
String
Integer
Decimal
```

## Imports

C# makes use of both **using statements** and **using directives**, while the **using statement** is used to correctly ensure object disposal, the **using directive** imports things. We suggest removing this confusion by calling the one that imports things: **import** (revolutionary I know)**.**

**Remove**

```csharp
using NUnit.Framework;
```

**Add**

```java

import nUnit.framework;
```

## Namespaces

Namespaces are a great way to organise classes into separate packages, however we feel that packaging related code should be metadata that doesn't interfere with the indentation of the body of the code. The current namespace syntax adds unnecessary indentation and an extra code block, we suggest instead simply adding a package declaration at the top of the file.

**Remove**

```csharp
namespace NUnitTestProject1
{
    public class Tests
    {
        // ... Methods ...
    }
}
```

**Add**

```java
package NUnitTestProject1;

public class Tests
{
   // ... Methods ...
}
```

## Lambdas

Lambdas or "Arrow functions" (because you should totally name a syntax based on how it looks and not what it does), are extremely useful but the "Fat Arrow" `=>` can very easily be confused with a comparison check like `>=`, we suggest replacing `=>` with `->`

**Remove**

```csharp
(x,y) => x + y
```

**Add**

```java
(x,y) -> x + y
```

## Linq

Although it was effective in tricking programmers into thinking they were creating sql injection vulnerabilities, we feel that linq needs to change. As part of the implementation of the manifesto persistence will no longer be handled by linq but will follow a standard persistence API. With regard to collections, these functions will be renamed to be in line with every other language ever... seriously Microsoft!

In addition, the requirement to convert the collection to a stream will be introduced, this way we can make it explicit how many times the collection is being looped through, instead of having every programmer on the team run their own test when a debate ensures from a pull request. We estimate that this will save companies that use C# roughly $7 Billion a year 

**Remove**

```csharp
.Where()
.Select()
.Aggregate()
```

**Add**

```java
.stream()
.filter()
.map()
.reduce()
```

## Attributes

The word attributes starts with `at` which is what `@` is, so attributes should start with it. This would also make C# attributes syntactically compatible with Java which is in line with the compilation goals of this manifesto, see the Compilation section for more.

**Remove**

```csharp
[Attribute]
```

**Add**

```java
@Attribute
```

# Compilation

We believe that with the above suggested changes applied, a C# program could very easily be compiled to target the Java Runtime Environment, as well as have full library compatibility with Java. This could have many benefits which include:

- The Xamarin Android codebase could be drastically reduced as no compatibility layer would be needed.
- The .Net Core web libraries could finally stabilise their API since they will no longer have to keep rebuilding Spring from the ground up.
- The CLR would also be Java compatible, allowing all versions of Minecraft to merge into a single codebase.
- It would make Microsoft Blazor feel **even more** like Java Applets 2.0