<div align="center">
<h1>
  🎹 KeyTrack
</h1>

![Latest commit](https://img.shields.io/github/last-commit/Nitestack/keytrack?style=for-the-badge)
![GitHub Repo stars](https://img.shields.io/github/stars/Nitestack/keytrack?style=for-the-badge)
![Github Created At](https://img.shields.io/github/created-at/Nitestack/keytrack?style=for-the-badge)

[Requirements](#️-requirements) • [License](#-license)

_An all-in-one practice hub for managing repertoire and scores, and turning daily sessions into measurable progress._

<p>
  <strong>Be sure to <a href="#" title="star">⭐️</a> or fork this repo if you find it useful!</strong>
</p>
</div>

## ⚙️ Requirements

## Self-hosting

If you want to use bind mounts, create the `uploads` (in Docker: `/app/uploads`) directory on your host machine:

```bash
mkdir -p /path/to/keytrack/uploads
chown -R 1001:1001 /path/to/keytrack/uploads
```

This is the same directory you have to use in your volume mapping if you are using Docker Compose:

```yaml
# ...
volumes:
  - "/path/to/keytrack/uploads:/app/uploads"
```

## Development

```bash
pnpm install # Install dependencies
docker compose -f compose.dev.yml up -d # Start database
pnpm db:migrate # Migrate database
pnpm dev # Start development server
```

Open your browser and navigate to `http://localhost:3000` (or your specified `PORT` in `.env`).

## 📝 License

This project is licensed under the Apache-2.0 license.
