# landmark-remark
Allows users to save location based notes on a map.

# Requirements #
 - Node (tested with version 6.8.1)
 - npm
 - Install gulp globally `<sudo> npm install gulp -g`
 - Install bower globally `<sudo> npm install bower -g`

### Setup 
1. Install Backend dependencies via `npm install`
2. Start the app `gulp start` (http://localhost:7000 should open in your default browser, alternative you can run it on http://localhost:4000)

### (optional) Setting up the editor:
Install `editorconfig` to manage the editor settings.

### (optional) Database:
In db/ you will find database.sqlite with test data. Simply remove or rename this file to start fresh.
Starting the server will make sure the migration scripts are executed.
Make sure to clear you local storage if changing the database.
