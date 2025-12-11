<div align="center">
<h1>
  🎹 KeyTrack
</h1>

![Latest commit](https://img.shields.io/github/last-commit/Nitestack/keytrack?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/Nitestack/keytrack?style=for-the-badge)
![Github Created At](https://img.shields.io/github/created-at/Nitestack/keytrack?style=for-the-badge)

[Features](#️-features) • [Development](#-development) • [Self-hosting](#️-self-hosting) • [License](#-license)

_An all-in-one practice hub for managing repertoire and scores, and turning daily sessions into measurable progress._

<p>
  <strong>Be sure to <a href="#" title="star">⭐️</a> or fork this repo if you find it useful!</strong>
</p>
</div>

## ✨ Features

KeyTrack helps musicians organize their practice and repertoire efficiently.

- **Repertoire Management**: Organize your pieces with automatic metadata fetching from **MusicBrainz**.
- **Score Discovery**: Search and import public domain scores directly from **IMSLP**.
- **Interactive Score Viewer**:
  - Built-in **PDF Viewer** for your digital sheet music.
  - Integrated **Metronome** with adjustable BPM and time signatures.
  - **Tuner** with frequency detection and visualization.
  - and more ...
- **Practice Tools**: Track your progress and manage your daily practice sessions.
- **Authentication**: Secure user accounts via Google.

## 🚀 Development

Follow these steps to set up the project locally for development.

### Prerequisites

- [**Node.js**](https://nodejs.org) (v22+)
- [**pnpm**](https://pnpm.io) (Package manager)
- [**Docker**](https://docker.com) (for the local database)

### Installation

1. **Clone the repository:**

```sh
git clone https://github.com/Nitestack/keytrack.git
cd keytrack
```

2. **Install dependencies:**

```sh
pnpm install
```

3. **Configure Environment Variables:**
   Copy the example file and update the values.

```sh
cp .env.example .env
```

> **Note:** You will need to obtain `GOOGLE_ID` and `GOOGLE_SECRET` from the [Google Cloud Console](https://console.cloud.google.com/) for authentication to work.

4. **Start the Database:**
   Spin up the PostgreSQL container.

```sh
docker compose -f compose.dev.yml up -d
```

5. **Initialize the Database:**
   Push the schema to your local database.

```sh
pnpm db:migrate
```

6. **Run the Development Server:**

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## ☁️ Self-hosting

KeyTrack is containerized and ready for deployment using Docker Compose.

1. **Prepare Files:** Copy `compose.yml` and `.env.example` (renamed to `.env`) to your server.

2. **Setup Volumes:** Create the uploads directory on your host machine to ensure file persistence and correct permissions.

```sh
# Create the directory
mkdir -p /path/to/keytrack/uploads

# Set ownership to the non-root user (ID 1001) used in the container
chown -R 1001:1001 /path/to/keytrack/uploads
```

3. **Update Configuration:** Edit your `compose.yml` volume mapping to point to your created directory:

```yaml
volumes:
  - "/path/to/keytrack/uploads:/app/uploads"
```

4. **Start the Service:**

```sh
docker compose up -d --build
```

## 📝 License

This project is licensed under the Apache-2.0 license.
