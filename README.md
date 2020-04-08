CSMM-CLI
========

A simple CLI based mod manager for Cities: Skylines.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/CSMM-CLI.svg)](https://npmjs.org/package/CSMM-CLI)
[![Downloads/week](https://img.shields.io/npm/dw/CSMM-CLI.svg)](https://npmjs.org/package/CSMM-CLI)
[![License](https://img.shields.io/npm/l/CSMM-CLI.svg)](https://github.com/CSMM-CLI/CSMM-CLI/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Installation
<!-- installation -->
```
$ npm install -g CSMM-CLI
```

# Usage
<!-- usage -->
```sh-session
$ csmm [COMMAND] [ARGS] [FLAGS]

$ csmm (-v|--version|version)

$ csmm --help [COMMAND]
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`install STEAMID`](#csmm-install-steamid)
* [`uninstall`](#csmm-uninstall)
* [`update`](#csmm-update)
* [`list`](#csmm-list)
* [`help [COMMAND]`](#csmm-help-command)


## `csmm install STEAMID`

Install a single mod or a collection along with their dependencies. Use id in steam URL as the SteamID.
```
USAGE
  $ csmm install <STEAMID>

ARGUMENTS
  STEAMID  SteamID of item/collection

OPTIONS
  -e, --edit                To edit items of a collection to install (will be ignored for single item).
  -m, --method=STEAM|SMODS  [default: STEAM] download from Steam or Smods?
```


## `csmm uninstall`

Uninstall a single item or choose from an interactive list.

```
USAGE
  $ csmm uninstall <?STEAMID>

ARGUMENTS
  STEAMID (Optional) SteamID of installed item

DESCRIPTION
  STEAMID argument is optional. 
  Use command with SteamID if you only want to uninstall single item. You can get id of item from list command.
  Executing command without SteamID will provide an interactive list to uninstall multiple items at once.
```

## `csmm update`

Updates all of the (outdated) mods. Will also install missing dependencies (required items) if any.

```
USAGE
  $ csmm update

DESCRIPTION
  If updates are available for mods, this command will updates all (outdated) installed mods.
```

## `csmm list`

Lists all the installed mods

```
USAGE
  $ csmm list

DESCRIPTION
  Presents a table of mods installed along with their IDs and DATES of when they were last updated by their authors.
```

## `csmm help [COMMAND]`

Display help for csmm

```
USAGE
  $ csmm help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

