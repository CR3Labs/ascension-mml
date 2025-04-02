# Ascension

![Ascension](./images/ascension.png)

This project uses [MML](https://mml.io), [MML 3D Web Experience](https://github.com/mml-io/3d-web-experience/), and [React](https://react.dev/) to create an **interactive, multi-user 3D web experience** based on an MML document created using standard React code and patterns.

It can be easily deployed to environments that support Node.js and can expose ports to the internet. 

The React application can be found in the [`./packages/mml-document/src`](./packages/mml-document/src) folder.

### React + MML

[React](https://react.dev) is designed to make it easier to build complex, interactive UIs by breaking them down into smaller, reusable components. As MML is valid HTML, React can be used to describe the HTML document that runs inside a NetworkedDOM server, and by running this document on a server that accepts WebSockets, you can have multiple users connect to the same single instance of the React document which can use all of the familiar React capabilities, but have it be synchronized to multiple users.

You can use React hooks, add event listeners, create reusable components, and also include external libraries (as `react` itself is just a dependency) to build multi-user, interactive 3D experiences in a way that feels as familiar and as effective as building web pages with modern tooling.

### Project Concepts

The [React/MML document in this repository](./packages/mml-document/src) is laid out as a building modelled after a museum with multiple floors, rooms, and componentized interactive experiences.

This serves as a jumping off point to reuse the building layout, components, patterns, or simply just the configuration of the project as having a single React-defined experience.


## Running locally

Make sure you have Node.js installed. Run the following commands from the root of the repository:

```bash
npm install
npm run iterate
```

After the server is up and running, open `http://localhost:8080` in your browser.

## Apple Silicon Support

This repository uses [node-canvas](https://www.npmjs.com/package/canvas) which requires being built from source on Apple Silicon. If you encounter issues running the project on Apple Silicon or other Arm64 platforms, ensure that you have [Homebrew](https://brew.sh/) installed and execute the following:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

Once all the packages are installed, you should be able to install the canvas package.

```bash
npm install canvas
```

## Project Structure
The entry point of the React application is located at [`./packages/mml-document/src`](./packages/mml-document/src), where you can find the [index.tsx](./packages/mml-document/src/index.tsx) file.

