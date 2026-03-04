# mycli

A multi-purpose command-line tool built with Node.js. It includes basic utilities, GitHub commands, weather lookup, and more — all powered by public APIs with no extra dependencies beyond `axios` and `commander`.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [General](#general)
  - [GitHub](#github)
  - [Utilities](#utilities)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd sesd-workshop

# Install dependencies
npm install

# Build
npx tsc

# Link globally (optional)
npm link
```

After linking, the CLI is available as `mycli` from anywhere in your terminal.

Alternatively, run it directly:

```bash
node dist/cli.js <command>
```

---

## Usage

```bash
mycli <command> [options]
mycli --help
mycli <command> --help
```

---

## Commands

### General

| Command | Description |
| --- | --- |
| `greet <name>` | Prints a greeting with the given name |
| `add <a> <b>` | Adds two numbers |
| `subtract <a> <b>` | Subtracts the second number from the first |
| `quote` | Fetches Pikachu data from the PokeAPI |

**Examples:**

```bash
mycli greet Pratik
# Hello Pratik

mycli add 5 3
# 8

mycli subtract 10 4
# 6
```

---

### GitHub

All GitHub commands are grouped under the `gh` subcommand. They use the public GitHub API (no token required).

| Command | Description |
| --- | --- |
| `gh user <username>` | Fetch a GitHub user's profile (name, bio, repos, followers, location) |
| `gh repos <username>` | List public repos for a user. Supports `--sort` (stars, updated, name) and `--limit` |
| `gh repo <owner> <repo>` | Get details of a specific repository (stars, forks, issues, language) |
| `gh trending` | Show trending repos created in the past week. Supports `--lang` and `--count` |

**Examples:**

```bash
mycli gh user torvalds
# Name:       Linus Torvalds
# Login:      torvalds
# Public Repos: 11
# Followers:  288330
# ...

mycli gh repos facebook --sort stars --limit 5
# 1. react  (stars) | JavaScript | ...
# 2. react-native  (stars) | ...

mycli gh repo vercel next.js
# Repo:        vercel/next.js
# Stars:       ...
# Language:    JavaScript

mycli gh trending --lang python --count 5
# 1. user/repo  (stars) | Python
#    Description of the repo
```

---

### Utilities

| Command | Description |
| --- | --- |
| `weather <city>` | Get current weather for a city via wttr.in (temperature, humidity, wind) |
| `joke` | Get a random programming joke |
| `ip` | Show your public IP address and geolocation |
| `uuid` | Generate one or more random UUIDs. Use `-n <count>` for multiple |
| `password` | Generate a random secure password. Use `-l <length>` to set length (default: 16) |
| `hash <text>` | Hash text using md5, sha1, or sha256. Use `-a <algorithm>` to pick (default: sha256) |

**Examples:**

```bash
mycli weather London
# Weather for London, United Kingdom:
# Condition:   Partly cloudy
# Temperature: 12C / 54F
# ...

mycli joke
# Why do programmers prefer dark mode?
# -> Because light attracts bugs.

mycli ip
# IP:       203.0.113.42
# City:     Mumbai
# Country:  India
# ...

mycli uuid -n 3
# 550e8400-e29b-41d4-a716-446655440000
# ...

mycli password -l 24
# xK9!mPq#2rTv&wLz8nYsAj5d

mycli hash "hello world"
# sha256: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9

mycli hash "hello world" -a md5
# md5: 5eb63bbbe01eeed093cb22bb8f5acdc3
```

---

## Tech Stack

- **TypeScript** — source language
- **Commander.js** — CLI framework for commands, options, and help generation
- **Axios** — HTTP client for API requests
- **Node.js crypto** (built-in) — UUID generation, password generation, hashing

### APIs Used

| API | Purpose |
| --- | --- |
| GitHub REST API | User profiles, repos, trending search |
| PokeAPI | Pokemon data |
| wttr.in | Weather data |
| official-joke-api | Programming jokes |
| ipapi.co | Public IP and geolocation |

---

## License

ISC
