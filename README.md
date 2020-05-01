<!-- omit in toc -->
<h1 align="center">CSMM-CLI</h1>

<h6 align="center">Mod manager for Cities: Skylines.</h6>

<p align="center">
<img src="./demo/demo.svg" width="700"/>
</p>

<p align="center">
<a href="https://npmjs.com/package/csmm-cli">
    <img alt="Version" src="https://img.shields.io/npm/v/csmm-cli?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/csmm-cli">
    <img alt="Downloads" src="https://img.shields.io/npm/dt/csmm-cli?style=flat-square">
  </a>
  <a href="https://github.com/Kumar-Saksham/CSMM-CLI/blob/master/package.json">
    <img alt="License" src="https://img.shields.io/npm/l/csmm-cli?style=flat-square">
  </a>
</p>

<!-- omit in toc -->
## Description

csmm-cli is a command line application to manage your Cities: Skylines mods. It lets you install any mod or collection from Cities: Skyline's [steam workshop page](https://steamcommunity.com/app/255710/workshop/), uninstall a mod if you don't need it any more, or update your installed mods. It automates most of your work to manage mods and does it reliably and quickly, allowing you to spend more time playing and less time getting frustrated.

<!-- omit in toc -->
### Features

* Install single mod or collection
* Required mods installed automatically
* Concurrent installations to optimize speed
* Multiple sources to install mods from
* Uninstall multiple mods at once
* Update all mods at once
* List all installed mods
* Supports multiplatform

<!-- omit in toc -->
## Table of Contents

* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
  * [Commands](#commands)
* [FAQ](#faq)
* [License](#license)

## Getting Started

### Prerequisites

* Install  [Node.js](https://nodejs.org/en/download/ "NodeJS download page") if you haven't already.
* Delete any mods installed previously.
* Backup your game's saves directory.

### Installation
<!-- installation -->
`csmm-cli` is distributed on npm. In order to install it globally, run the following command:

```bash
$ npm install -g csmm-cli
```

## Usage

When you run the CLI for the first time it will ask you a few configuration questions.

* *`Max Concurrent Tasks`*: Maximum no. of simultaneous downloads or fetching.

* *`Saves Directory`*: Your Cities: Skylines [user path](https://skylines.paradoxwikis.com/User_path).
* *`Temporary Downloads Folder`*: Folder to store temporary downloads.

If the pre-filled details are correct, just press enter (or return) otherwise you can fill in your own custom details.

### Commands
<!-- commands -->
* [`install`](#csmm-install-steamid)
* [`uninstall`](#csmm-uninstall)
* [`update`](#csmm-update)
* [`list`](#csmm-list)
* [`config`](#csmm-config)
* [`help`](#csmm-help-command)

<!-- omit in toc -->
## `csmm install <steamId>`

Install a single mod, complete collection or part of collection along with all of their dependencies.

```
USAGE
  $ csmm install <steamId> [options]

ARGUMENTS
  steamId                     steamId of item/collection

OPTIONS
  -e, --edit                  To edit items of a collection before install.
  -m, --method={STEAM|SMODS}  To set download source [default: STEAM] .
```

Use id in steam workshop's URL for `<steamId>`.

<!-- omit in toc -->
## `csmm uninstall [<steamId>]`

Uninstall a single item or choose from an interactive list.

```
USAGE
  $ csmm uninstall [<steamId>]

ARGUMENTS
  steamId (Optional)           steamId of installed item
```

Use the command with `<steamId>` to uninstall a single mod. Executing command without `<steamId>` will provide an interactive list to uninstall multiple items at once.

<!-- omit in toc -->
## `csmm update`

Updates all outdated mods at once, and also installs missing dependencies if any.

```
USAGE
  $ csmm update
```

<!-- omit in toc -->
## `csmm list`

Lists all installed mods.

```
USAGE
  $ csmm list
```

<!-- omit in toc -->
## `csmm config`

Re-run configuration setup, to modify :

* *`Max Concurrent Tasks`*
* *`Saves Directory`*
* *`Temporary Downloads Folder`*

```
$ csmm config
```

All previously saved configuration values will be preserved.

<!-- omit in toc -->
## `csmm help [command]`

Display help for `csmm-cli` commands.

```
USAGE
  $ csmm help [command] [options]

ARGUMENTS
  command (optional)            command to show help for

OPTIONS
  --all                         see all commands in CLI
```


<!-- commandsstop -->

## FAQ

* **Is there a detailed guide on how to use this?**
  * Yes, [here](guide/detailed.md)
* **I am having a lot of `BAD FILE` failures while installing mods.**
  * The **`BAD FILE`** error usually happens because the downloaded file is corrupt or empty. This can be fixed by changing the method of installation to `SMODS`. Go through the [guide](guide/detailed.md) on how to do it.
* **Some of the items keep failing repeatedly with `[!]` symbol, and the script doesn't end.**
  * This is a known bug, which will be fixed later. For now, if the script seems to be stuck in a loop, giving `[!]` symbol for the same item repeatedly, use `ctrl + c` to terminate the script.
* **Which terminal are you using?**
  * I'm using [Hyper](https://hyper.is/), with zsh.

## License

* **[MIT license](./LICENSE)**
* Copyright 2020 © Kumar-Saksham.