<h1 class="title">Building a desktop UI in RUST</h1>
<h2 class="subtitle">Another UI another language</h2>
<span class="date">2022-11-18</span>

I seem to be [making a habit](/post/building-a-desktop-ui-in-go/) of changing language every time I embark on building a solution for the desktop.

Rust has been on my interest radar for some time now, but I like to actually solve a problem when I try out a new language. The problem presented itself when a friend of mine said they wanted to play Skyrim again but they didn't remember which mods they had installed on their existing character saves.

I knew that Skyrim prompted you when you loaded a save game if you were missing any mods, so I figured that the mod list must be stored in the save files themselves. I also figured that Vortex must be reading from some kind of list for load order, and even seemed to have links back to the mods on Nexus Mods, so we could not only provide a list of required mods (which the game does anyway) but also links to the mods themselves if they were missing.

I had a look at the save files and found out that, rather unsupprisingly, that they were in a binary format. I know that NodeJS by default reads files in bytes, so after poking around some example files with a hex editor, I prototyped reading some information out of the file in NodeJS
