<h1 class="title">Why Rust?</h1>
<h2 class="subtitle">It's not just about memory management</h2>
<span class="date">2024-03-20</span>

I can barely remember how many times I tried Rust or when I first tried it. I 
have always been the kind of person to try new languages, and Rust was no
exception. 

I think one of the things that put me off was just how much like Scala it was in
terms of the amount of syntax that needed to be learned. I do remember that 
variable shadowing was something that put me off at first.

Skip ahead a few years however and I found myself trying to solve a particular 
problem: I needed to look through a Skyrim save file and figure out which mods
needed to be re-installed in order to play from that save file without breaking 
anything. 

Reading binary just didn't seem like something you want to do in a language that 
doesn't compile to native code, and I wanted a single portanle binary that I 
could distribute easily to less technical friends who had the same problem.

Although I'm a hyperpolyglot programmer, I have also become very comfortable with
the style I have developed while writing TypeScript at my day job.

So, I needed a native language, I wanted modern tooling and I did not want to 
lock it to certain platforms or IDEs. And more importantly I wanted a simple to
use UI library because nobody's CPU and RAM needs yet another Electron app.

## How Egui made me use Rust
I had experience building a UI project in Go before, So I could have reached for
that, but Go can become incredibly verbose and the code can end up taking up way
more vertical space than I am used to these days. 

But one of the biggest drivers of my choice for trying rust again was that I 
had spotted a simple looking, lightweight UI library called Egui. It is an 
immediate mode GUI library that is very easy to use and has a lot of examples
to get you started.

So once again I dove into Rust and this time, something was different. I was
able to get a lot further than I had before, the reason was obvious thouhg, this
time, I had a use case. 

## How you really learn a language
Rust gave me a feeling I had had before, and that feeling is what made me feel 
I should write this post. I had this feeling back in 2012 when, as an Objective-C
native, I took a look at this crazy project for running JavaScript on the server:
Node.js.

I remember a lot of people thinking this was madness, that JavaScript was not a 
"real" language and that it was not suitable for server side programming. But it
was just so easy to use, and surprisingly performant compared to the common 
ways of writing server side code at the time. But more importantly was just how
active the community was, how packages were easy to create and it was easy to 
contribute to the ecosystem, there was a lot of enthusiasm, and excitement
and it felt like the future because it solved certain problems

- It was easy to write code that was asynchronous
- It was easy to publish and use packages
- It was easy to write tests
- The people that used it were passionate about it

## Rust and JavaScript have more in common than you think
One of the big criticisms of Rust is that it is hard to learn, because it requires
knowledge of the borrow checker and lifetimes. 

But have you ever tried to explain JavaScript to someone completely new to 
programming? Well, I have, and wow is it a complicated language. First off you 
are either running it in a browser with a markup language and a styling language
and you have to explain the difference, or you are running it on the server in an
event loop. Try explaining an event loop to someone who just learned what an if
statement is yesterday. But also try and explain to them why callbacks or Promises
exist without explaining the event loop.

JavaScript, at the end of the day, is a very leaky abstraction over some very
complicated systems written in C and C++. It's not easy because the concepts are
easy, its easy language, it's easy because you know it.

Rust on the other hand, has some very innovative ideas about how to manage memory
without a garbage collected environment and uses type safety in order to achieve
this. When you are about to do something bad with memory, the compiler will tell 
you and prevent you from doing it, by the way, the concept of lifetimes
still exists in C and C++, you just find out at runtime.

Honestly, I would argue that once you understand Rust's memory model, its just 
like any other langauge that has a lot of features, and you still arent forced to 
use every feature eather. You can very easily write Rust that looks a lot like
TypeScript or Swift or any other modern C based language.

And those are the features I want to focus on.

## It's not just about memory safety
There are enough people touting Rust's memory safety features, certainly it is
the groundbreaking feature the lauguage introduced to the world. But while 
memory optimisations can be their own kind of fun that many people enjoy, it's 
not the reason I choose to replace even mintor scripting tasks with Rust. 

I choose to use Rust now almost every time I have a choice because I genuinely 
enjoy writing it more than any other language I have used. Once you are comfortable
in Rust it is the most easy language in the world to set up.

Other than Rust the language I am most comfortable in is TypeScript, I have as I 
said, been writing JavaScript professionally since 2012, and once I got used to 
TypeScript I never looked back. But what does it take to set up a node project 
with TypeScript?

## Simple project setup

1. Install Node.js, oh but I may need to install nvm to manage versions, or is it 
   volta now? Oh now my installation of nvm for this project conflicts with volta
   so now I have to uninstall it, how do I even do that again? (How does a newbie
   even know they are supposed to do this, is it only step one still? what the?)
2. Alright now lets create our project with `npm init` or is it `yarn init`? 
   Oh, no, builds are really slow these days, better use `pnpm` instead.
3. Right we have our node project, lets just assume we went with the default package
   manager, we still cant event start writing TypeScript yet, we need to install
   it, and then we have to set up the TSConfig, and change the package.json to
   either build the project or run it with `ts-node`, Another third party package 
   you need to download by the way.
4. Now we can start writing our single unit testable calculator function after 
   downloading half the internet. Right lets add a test, which test? Jest? Mocha?
   Node of course has a built in testing framework, but you can work in Node for
   years and never know that because honestly once you have to download a third
   party language for your runtime you pretty much expect everything to be another
   third party package.
5. Your third party test runner does not support the third party language you 
   downloaded, so, after setting up a config file for your package manager, a 
   config file for your language, a config file for your linter, you now set up 
   another config file for your test runner, oh and you have to download some 
   types too before it will work.
6. Alright, you have your setup, you write your test in a separate file, you now
   have 2 source code files and 4 config files, `npm run test` now runs the test.


Compare this to the process for Rust from scratch

1. `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. `cargo new my_project`
3. cd into the project and write your function in main.rs
4. write your test in the same file
5. `cargo test`

Learning the memory management concepts of Rust is only a once off thing, you will
never have to do it again, but unless something drastic happens, setting up a
TypeScript project will only get more complicated as time goes on. If you think
its harder to write Rust than TypeScript I beg to differ, anything is hard when you 
dont understand it, but if you do work in the TypeScript ecosystem, you probably
do some of the most complex stuff in the history of prpgramming, you just think
its easy because you know it.

Okay that turned into a bit of a rant, but you can see why for this reason alone, 
If I want to spin something up real quick, it is MUUUCH easier to reach for Rust
than it is the language I have been working with for the last 10 years.

## A silver bullet?
Everyone likes to say "There is no silver bullet", when referring to whether or 
not a certain tool can be used in every situation. But like many sayings, most 
people who repeat it don't know where it comes from. It' comes from a 1986 paper
by Fred Brooks called "No Silver Bullet". In it he argues that there is no single
development in technology that will by itself bring about an order of magnitude
improvement in productivity.

That is a comment on productivity, not on the ability of a tool to be used in a 
multitude of situations, in fact, as a programmer there is one tool that almost 
all of us use in every situation outside of those who are on the frontier of 
quantam computing: Binary.

Whether you write in C, C++, Rust, TypeScript, JavaScript, Python, Ruby, Go,
Swift, Gleam, Zig or whatever else someone piles on top of LLVM tomorrow, it all
compiles to binary. And that is the only thing that runs on your computer.

But now I have a language that works in use cases from Embedded systems to 
Browsers, why woudln't I use it for everything? To pretend that my wooden bullet 
and my Golden bullet don't eventually all end up as silver bullets at compile time?

Rust gives you the power to write literally anything to run anywhere, but in a
syntax that isnt 110001101... so you can actually read it. And it builds in the
early feedback functionality of high level typed languages.

No sivler bullets? Well, that has nothing to do with using the same language for
everything. All turing complete languages acheive the same thing. But like I said
familiarity breeds the feeling of something being easy. If we can write everything
in one language, it drastically decreses friction by eliminating the need to 
context switch.


## Conclusion
The only reason I would write anything in something other than Rust is if the 
library integration was easier in another language or because the team 
environment calls for it. In fact that last part is kind of my point, the best 
language for a project is the one that people are most familiar and most 
comfortable with, for me, that was TypeScript for a very long time, but now, I
have a new favorite, and I'm suggesting you try it too.
