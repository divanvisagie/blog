<h1 class="title">Structured intelligence</h1>
<h2 class="subtitle">Proposing a term for the New Paradigm in Software Architecture</h2>
<span class="date">2023-05-26</span>

In the time when I [was toying with sentiment analysis](https://divanv.com/post/polymer-sentiment-aware/) in 2017, I came to a conclusion about AI driven systems as they applied to me as a Software Engineer who isn't a data scientist and doesn't run their own machine learning clusters: I am not the person who is going to train or run the greatest model, when that model comes, it will be too expensive to run locally, and will probably require special hardware. Who I am is the person who is going to use the model, probably consume it as a library, and I am going to use it to solve a problem. My job will not be to train the model but to integrate it into systems in a useful way.

Now, in 2023, OpenAI has delivered exactly that. The worlds best language model, with an API that counts tokens and charges you based on usage. For my home usage it would probably take me my entire lifetime to even use the amount that costs as much as 1 Nvidia A100 GPU. At least, for now.

## Text is back, but different

When I first saw ChatGPT, a few lightbulbs went off in my head. As I mentioned, one of them was very expected: "Oh, it's here, the model I have been waiting for". The other part though took me completely by surprise: Text is the new UI.

Now I know all the Linux users are shouting at the screen right now, yes I know the command line has always been a thing, but most of the end users of the products we build as software engineers aren't typing unix commands on their iPhones in the train. They are using apps with buttons and menus and all the things that we have come to expect from a graphical user interface.

That interface, and user's expectations about it, have actually influenced the way we build software, even on the back end.

When a user clicks a button, they expect some sort of feedback, and they expect it to be fast. This has lead to us coming up with solutions like availability zones, using cdns, chaching and edge computing. In a chat interface however, you don't really have an expectation of immediate response, because in your experience most of the time you are talking to a human, and humans take time to respond. This means that we can build systems that are more tolerant of latency, and that opens up a whole new world of possibilities.

While OpenAI has in my mind made the mistake of having their UI react immediately by animating the output stream of the model in their chat product, if you were interacting with this bot in a chat application like Whatsapp or Telegram, the simple cues of the message read and typing indicators would be enough to make the experience feel natural.

These different expectations give us as software engineers the opportunity to re-think the way we build software. If we can build systems that are more tolerant of latency, that opens up a whole new world of possibilities.

Imagine no longer needing to focus on latency, this lets you optimise for other variables like cost. If your users are okay with a response time in seconds, you can choose to optimise by choosing the cheapest availability zone rather than the closest one.

One strategy I have heard of when running the models themselves is to run them on the opposite side of the world to the user, where it is night time, which keeps the cooling costs down. A strategy like this would be counter-intuitive in a traditional system, but in a system where the user is okay with a few seconds of latency, it makes sense.

## Structured Intelligence

As software engineers I think it's time for us to start thinking outside the box when we are integrating these models. The software patterns we have been using like the Service/Repository pattern, or the MVC pattern are designed for systems that process and store data, not systems that generate data and learn from user feedback. We need to start thinking about how higher tolerance for latency can change the way we build systems, we need to think about how language models increase the fault tolerance of user input and how we can use that to our advantage, or how we can leverage current technologies to enhance the experience of interacting with them, rather than just brute forcing AI improvements with more data and more compute.

We are already seeing some software patterns emerge from people writing software around these models; [Langchain](https://python.langchain.com/en/latest/index.html) for example is probably the most well known. It is a library that wraps around things like language models and vector databases and makes them easier to use. It provides a structure around concepts like models and text embeddings to build systems that are greater than the sum of their parts. Concepts like [chain of thought](https://arxiv.org/abs/2201.11903) and [tree of thought](https://github.com/kyegomez/tree-of-thoughts) are patterns in the field of what I call **Structured Intelligence**; The use of software patterns to build systems around AI models that enhance the models capabilities using existing technologies.

I think we are seeing a new frontier, and I am excited to see what we can build with it. I think the software world has become rather stagnant. Some of the most reccomended books surrounding software and software architecture were written by people who now have grandchildren. I think it's time for us to start thinking about how we can use these new tools to build new things in new ways, invent new patterns and please, write some new books.

I'm personnally embarking on a journey to try and [develop new patterns](https://github.com/divanvisagie/Layer-Capability-Pattern) around this kind of software, through experimentation and I hope anyone reading this will be inspired to do the same. I personally beleive that the future of software systems that integrate AI, is Structured Intelligence.
