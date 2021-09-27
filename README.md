# Chrome Extension for iLert Incidents 

This will show the Incidents in the small popup and Chrome will notify on the new Incidents. CAVEATS: The poll is HARD coded to be done in every one minute.

## Get started

Clone this repository, and then, in this directory:

1. `npm install`
1. `npx webpack --watch`

To load this on your chrome just follow this steps:
1. Navigate to `chrome://extensions/` from the Browser URL
1. Enable `Developer Mode` on the top right
1. Click `Load Unpacked`
1. Navigate to directory that has `manifest.json` in this case `dist/` directory

## Acknowledgments

The structure is taken from https://github.com/duo-labs/chrome-extension-boilerplate.