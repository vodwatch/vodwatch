# vodwatch

This project was created with the help of webpack and npm.

## Installation

Firstly, clone the repository: https://github.com/vodwatch/vodwatch.git . Next, open the vodwatch folder in the terminal and run `npm install` command.

## How to run code?

Run `npm run build` to build an extension. The build artifacts will be stored in the `dist/` directory. Next navigate to `edge://extensions` or `chrome://extensions`. Check `Developer mode control` option. Then click on `Load unpacked` icon and choose dist folder. Your extension should be running now. If you want continuous updates of dist folder every time you save the file run `npm run serve` instead of `npm run build`.

## How to run tests?

Run `npm test` to execute all test files. In order to run specific test file run `npm test -- file_name.test.js`.

## How to add your own .ts file to the extension

Create .ts file in src folder. Head to `webpack/webpack.config.js` and then in the entry section add your own field with the name of the .ts file. For example `new_file: path.resolve(__dirname, "..", "src", "new_file.ts"),`

## Where are manifest.json, index.html and styles.css files stored

Extension `manifest.json` file is stored in the `/public` folder, the same as `index.html` and `styles.css` files. These are the files you should edit if you want to see them changed after building an extension.

## Extension workflow

When user opens the browser, `background script` checks if user is on the netflix video. If user opened the video from netflix page, then `background script` sends the message to `content script` that it can start to get an information about netflix videos.

## macOS possible problems

When using macOs, following error pops out: `(node:6084) ExperimentalWarning: The ESM module loader is experimental.`
`[webpack-cli] HookWebpackError: Only file and data URLs are supported by the default ESM loader. Received protocol 'node:'`. Type a command: `npm install copy-webpack-plugin@9 -D`

## Video events checklist
https://docs.google.com/document/d/1Iq3jHTItCCR8t6KVH49_BnAd6aitLf3fcnB3gu6UcvQ/edit?usp=sharing