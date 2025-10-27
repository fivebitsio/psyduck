# Psyduck 🦆

A privacy-friendly analytics tool built with modern technologies for fast data processing. Powered by DuckDB, an in-process analytical database that delivers exceptional performance for small to medium websites without the overhead of traditional database systems. Get powerful analytics without the complexity of enterprise solutions.

## 📸 Screenshots

### Dashboard Overview

![Dashboard Screenshot](https://github.com/user-attachments/assets/e08259d2-13a0-4c53-ab2c-bbaf9b976aa1)
_Main analytics dashboard showing key metrics and visualizations_

````

## 🌟 Features

- **Privacy-First**: All data processing happens on your infrastructure - no data leaves your control
- **Fast Analytics**: Powered by DuckDB for lightning-fast analytical queries, ideal for small to medium websites
- **Modern Stack**: Built with Node.js and React for optimal performance
- **Self-Hosted**: Complete control over your analytics data
- **Lightweight**: Minimal resource footprint compared to traditional analytics solutions

## 🛠️ Tech Stack

- **Backend**: Node.js with DuckDB for data processing
- **Frontend**: React with modern JavaScript tooling
- **Database**: DuckDB for analytical workloads
- **Package Manager**: pnpm for efficient dependency management

## 📋 Prerequisites

- [Node.js](https://nodejs.org) (v20+ recommended)
- [pnpm](https://pnpm.io) (latest version)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/fivebits.io/psyduck.git
cd psyduck
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Database Setup

Run migrations to set up the database:

```bash
pnpm migrate
```

### 4. Start Development Servers

**Backend** (from project root):

```bash
pnpm run dev
```

**Frontend** (in a new terminal):

```bash
pnpm --filter=web dev
```

**Or run both together:**

```bash
pnpm run dev:all
```

The backend will typically run on `http://localhost:9876` and the frontend on `http://localhost:5173`.

### 🗄️ Database Management

**Run Migrations**:

```bash
pnpm migrate
```

**Open DuckDB Shell**:

```bash
pnpm db
```

## 🔧 Configuration

Configuration details will be added as the project stabilizes. Currently, most settings are handled through environment variables and configuration files.

## ⚠️ Development Status

**Psyduck is currently in active development.** This means:

- Features may change or break between updates
- APIs are not stable and may change
- Documentation may be incomplete or outdated
- **Expect breaking changes** - backup your data regularly

We recommend using Psyduck for testing and development purposes only until we reach a stable release.

---

**Remember**: This project is under active development. Star ⭐ and watch 👀 this repository to stay updated with the latest changes!
