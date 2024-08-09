# Log Collection Service

This project provides a REST API for retrieving logs from unix-based servers.

## Requirements

- Node.js
- Docker
- Docker Compose

## Setup

1. Clone the repository.
2. Run `docker-compose up` to start the service.

## API Endpoints

- `GET /logs`: List available log files.
- `GET /logs/:filename`: Retrieve log lines from the specified file with optional query parameters `keyword` and `limit`.

## Testing

To run tests, use:
```sh
docker build -f Dockerfile.test -t logcollector-test .
docker run logcollector-test
```
