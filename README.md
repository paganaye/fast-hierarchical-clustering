# vscode-typescript-mocha

<h1 align="center">Minimal visual studio code, typescript and mocha project boiler plate</h1>

<p align="center">  
  <b>A simple project to bootstrap a project where you can debug your typescript tests without generating a single javascript file.</b></br>

  
  <sub>Made with ❤️ by <a href="https://github.com/paganaye">Pascal Ganaye</a></sub>
</p>

<br />

## ❯ Why

It is not rocket science but it is a bit fiddly to get this three component rights.

### Features

- **Beautiful Code** thanks to the awesome annotations of the libraries from [pleerock](https://github.com/pleerock).


## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Recommended plugins](#-recommended-plugins)
- [VSCode integration](#-vscode-integration)
- [License](#-license)


## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)


### Step 2: Copy the Project

```bash
git clone https://github.com/paganaye/vscode-typescript-mocha.git <NameOfYourProject>
```
or download a ZIP. 

Then install the dependencies.

```bash
cd <NameOfYourProject>
npm install
```

### Step 3: Run VSCODE

```bash
code .
```

> This starts visual studio code in the current folder.

## ❯ Recommended plugins

Mocha Test Explorer

https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter

## ❯ VSCode integration

The editor intellisense works from the get go.
The tests can be run and debugged directly from the source file.


### Debugger in VS Code

There is no need to build the app.
Just set a breakpoint and hit <kbd>F5</kbd> in your Visual Studio Code.

We have two launch command:
    
The first: `Debug current Test file` is for Mocha test 

The second: `Debug current Typescript file` is specifically for debugging files that are not specifically tests. 

## ❯ License

[MIT](/LICENSE)