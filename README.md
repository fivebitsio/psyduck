# Psyduck

## Dashboard Overview

![Dashboard Screenshot](https://github.com/user-attachments/assets/42473821-0169-4f38-a389-58b336a3594f)

Main analytics dashboard showing key metrics and visualizations

Psyduck is a single executable binary that functions as both a server and a command-line interface. This privacy-friendly analytics tool is built with modern technologies for fast data processing and runs with zero external dependencies.

## Features

- **Single Binary**: Just one executable that serves as a server, frontend and CLI tool
- **Privacy-First**: All data processing happens on your infrastructure - no data leaves your control
- **Fast Analytics**: Powered by DuckDB for lightning-fast analytical queries, ideal for small to medium websites
- **Modern Stack**: Built with Bun and React for optimal performance
- **Self-Hosted**: Complete control over your analytics data
- **Lightweight**: Minimal resource footprint compared to traditional analytics solutions

## CLI Commands

The Psyduck binary contains both server and CLI functionality.

### init
Initialize the configuration and create the initial admin user:

```bash
psyduck init
```

Additional options:
```bash
# Add an additional user
psyduck init --add-user
```

### migrate
Manage database migrations:

```bash
# Run all pending migrations
psyduck migrate up

# Rollback the last migration
psyduck migrate down

# Rollback a specific number of migrations
psyduck migrate down --number 3

# Show help for migration options
psyduck migrate --help
```

### server
Start the Psyduck server:

```bash
psyduck server
```

The server will start on port 9876 by default (or as configured in your .env file).

### interactive
Run an interactive command selector with a user-friendly menu:

```bash
psyduck interactive
```

### help
Show help information for all commands:

```bash
psyduck --help
```

## Tech Stack

- **Runtime**: Bun for fast JavaScript execution
- **Frontend**: React with modern JavaScript tooling  
- **Database**: DuckDB for analytical workloads
- **Package Manager**: Bun for dependency management

Built as a single executable with no external runtime dependencies.

## Prerequisites

- [Bun](https://bun.sh) (v1.0+ recommended)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/fivebits.io/psyduck.git
cd psyduck
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
bun install
```

### 3. Setup and Run

Psyduck comes as a single executable binary after building.

**Initialize Configuration** (required on first run):

```bash
psyduck init
```

**Run Database Migrations**:

```bash
psyduck migrate up
```

**Start the Server**:

```bash
psyduck server
```

### 4. Building the Standalone Executable

Build the single executable containing both server and CLI functionality:

```bash
bun run build:standalone
```

This creates a single binary at `./dist/psyduck` that you can use as just `psyduck` from anywhere in your system.

### 5. Development

For development, you can run the server directly:

```bash
bun run dev
```

The backend will typically run on `http://localhost:9876`.

### Database Management

**Run Migrations**:

```bash
psyduck migrate up
```

**Open DuckDB Shell**:

```bash
bun db
```

## Configuration

Configuration is handled through environment variables and the `data/config.json` file. The `init` command will prompt you to set up the initial configuration including JWT secret and admin user credentials.

## Development Status

Psyduck is currently in active development. This means:

- Features may change or break between updates
- APIs are not stable and may change
- Documentation may be incomplete or outdated
- Expect breaking changes - backup your data regularly

We recommend using Psyduck for testing and development purposes only until we reach a stable release.

---

Remember: This project is under active development. Star and watch this repository to stay updated with the latest changes!
