<h1 class="title">Building a desktop UI in RUST</h1>
<h2 class="subtitle">Another UI another language</h2>
<span class="date">2023-05-01</span>

I seem to be [making a habit](/post/building-a-desktop-ui-in-go/) of changing language every time I embark on building a solution for the desktop.

Rust has been on my interest radar for some time now, but I like to actually solve a problem when I try out a new language. The problem presented itself when a friend of mine said they wanted to play Skyrim again but they didn't remember which mods they had installed on their existing character saves.

I knew that Skyrim prompted you when you loaded a save game if you were missing any mods, so I figured that the mod list must be stored in the save files themselves. I also figured that Vortex must be reading from some kind of list for load order, and even seemed to have links back to the mods on Nexus Mods, so we could not only provide a list of required mods (which the game does anyway) but also links to the mods themselves if they were missing.

I had a look at the save files and found out that, rather unsupprisingly, that they were in a binary format. I know that NodeJS by default reads files in bytes, so after poking around some example files with a hex editor, I prototyped reading some information out of the file in NodeJS.

There was a problem though, my friend is not a programmer, and I eventually wanted this to end up being distributed not just to them, but be freely available for all Skyim players to use. It just made more sense to distribute this as a binary. As someone who actually want's the planet to still exist in the future, I didn't want to create another Electron app though.

[![Energy](energy.png)](https://thenewstack.io/which-programming-languages-use-the-least-electricity/)

Well it looks like Python is a big no for that whole planet saving criteria thing, good thing nobody is using it in conjunction with energy sucking GPUs or anything. That would be really bad for the planet...

In all seriousness though, Electron is clunky, and after most of the apps I use on a daily basis being Electron apps, I, or should I say my RAM, is starting to grow a bit tired of it. Plus I need to offset the carbon footprint of all the JavaScript I have written in my life.

I had also just recently run accross [Egui](https://github.com/emilk/egui), which is a GUI library for Rust that is GPU accelerated, it's actually designed for use inside game engines so it felt suited for the project being gaming related.

Egui is an [immediate mode](https://en.wikipedia.org/wiki/Immediate_mode_GUI) GUI which is a bit of a different paradigm to how most UIs are built these days. Instead of a button firing an event and then that event being handled, the UI code is essentially run each frame, similar to how other objects are rendered in a video game loop.

To illustrate this, lets take a look at the demo code in the Egui repo:

```rust
ui.heading("My egui Application");
ui.horizontal(|ui| {
    ui.label("Your name: ");
    ui.text_edit_singleline(&mut name);
});
ui.add(egui::Slider::new(&mut age, 0..=120).text("age"));
if ui.button("Click each year").clicked() {
    age += 1;
}
ui.label(format!("Hello '{}', age {}", name, age));

```

As you can see, instead of firing an event on button click, we are just checking if the user's mouse is in the bounds of the button and whether or not they are clicking. The effect is instant, since feedback happens in that frame, and frames run as fast as your GPU can render them, and as much as your monitor refresh rate allows.

![Gif of the Egui application incrementing the age when a button is clicked](https://github.com/emilk/egui/raw/master/media/demo.gif)

The downside of course is that you need to keep track of the state in a way that is lightweight enough that it can be rendered every frame. This also means that the wrong decision can lock up your UI entirely. I personally feel comfortable with this though, especially for this problem space, and the fact that egui takes care of its own rendering means that we get cross platform support for free, you know, for all the people who play modded Skyrim on their Macs.

So it was time to get started, I had done some light programming exercises in Rust before but the challenges certainly started quite early on. The first problem to solve was managing the state of the application.

```rust
struct MyApp {
    age: u32,
}

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &egui::Context, frame: &mut eframe::Frame) {
        ui.label(format!("Age {}", self.age));
        if ui.button("Click each year").clicked() {
            age += 1;
        }
        ui.label(format!("Hello '{}', age {}", name, age));
    }
}
```

https://github.com/divanvisagie/Arcanaeum
