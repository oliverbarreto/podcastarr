## Roadmap

#### General Requirements:

- Use TailwindCSS for styling
- Use Shadcn UI for components
- Use NextJS for routing
- Use NextJS for server actions
- Use NextJS for server components
- Use NextJS for server actions
- Use NextJS for server components
- Use Drizzle as ORM
- Use SQLite as data base
- Use ytdl-core to download audio from Youtube
- Use ffmpeg to convert audio to m4a format
- Use a XML Podcast Generator Library to create/update/delete the XML file for iTunes

### Step 1 - Basic Requirements

1. Create NEXTJS app skeleton with shadcn ui and tailwindcss

   1. basic layout
   2. basic navbar
   3. use toast for notifications of events (success, error, info, warning) when interacting with the app and for managing episodes (add, delete, edit) and channel info (add,update)

2. Use mock data for now with local storage in the browser
3. Features:

   1. Home page to show a list of recently added episodes and recently modified episodes
   2. Profile page to set user info and channel required info for iTunes
   3. Channel page to list all episodes
   4. Episode Details page to show details of an episode
   5. Stats page to show stats of the channel
   6. Settings page to set user info and channel required info for iTunes
   7. Dark Mode Toggle
   8. Personal Public page to show the data about the channel: sometimes required to have a public page to show the data about the channel
   9. Podcast XML Feed for iTunes

#### Other Requirements for features:

- the user must be able to add an episode
- the user must be able to delete an episode
- the user must be able to edit an episode

### Step 2 - Data Base

- use drizzle as ORM
- Use SQLite for the data base
  - https://orm.drizzle.team/docs/column-types/sqlite
- refactor the code to change current local storage mock data to DB data and use nextjs server actions to save the data into the DB
- Refactor:
  - User and Channel info
  - Episode info

### Step 3 - Donwload audio from Youtube

- use Javascript library to download audio from Youtube video
- use ffmpeg to convert the audio to m4a format if needed
- publish audio files as static files in nextjs app
- use nextjs server actions to save the audio files into the DB

## Step 4 - iTunes Integration

- Use Podcast Generator Library to create/update/delete the XML file for iTunes

## Discarded Features for now

4. Video Downloader -[x] Extract información from video object (title, media url, length, description (text/html), etc.) -[x] Allow using different libraries to download audio file (Pafy, Pytubefix, Pytube, Youtube_dl, etc.) via creating an Interface that defines required functionality and an implementation that provides that using one or another library -[x] Download audio file from Youtube video from url (save by default audio with )

5. File Manager: Save, Delete, check if already exists

6. Podcast Manager:

   - Podcast Channel information
   - Episode information (title, description, media url, length, etc.)
   - Files information (path, filename, size, etc.)
   - Create & Update XML for iTunes (Use External Podcast Generator Library) with DB info

7. DB Manager: save into DB (sqlite3):

   - Podcast Channel information
   - Episode information (title, description, media url, length, etc.)
   - Files information (path, filename, size, etc.)

8. Podcast XML Server (for iTunes)

   - publish xml file for iTunes (must be https)
   - Options:
     - use Github pages to publish xml file
     - use local API server to publish xml file (must be behind a NGINX proxy with SSL)

9. FastAPI -[x] Serve /static/media files (.m4a & .xml) -[x] Create episode from Youtube video url: use audio file and use media from Youtube video
   -[] save info into DB
   - List all episodes
   - Delete episode
     -[] and save into DB
   - Create & Publish xml file for iTunes (Podcast XML Server)
