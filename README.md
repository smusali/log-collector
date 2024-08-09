# Log Collection Service

This project provides a REST API for retrieving logs from Unix-based servers.

## Requirements

- Node.js
- Docker

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/smusali/log-collector.git
   cd log-collector
   ```

2. Build the Docker image:
   ```sh
   docker build -t smusali/log-collector:latest .
   ```

3. Run the Docker container:
   ```sh
   docker run -d -p 3000:3000 -v /var/log:/var/log smusali/log-collector:latest
   ```

## API Endpoints

- `GET /files`: List available log files.
- `GET /logs/:filename`: Retrieve log lines from the specified file with optional query parameters `keyword` and `limit`.

### Example Requests

- List available log files:
  ```sh
  curl http://localhost:3000/files
  ```

- Retrieve log lines from a specified file:
  ```sh
  curl http://localhost:3000/logs/<filename>?keyword=<keyword>&limit=<limit>
  ```

  Replace `<filename>`, `<keyword>`, and `<limit>` with actual values.

## Using the Service

### Running on Local Machine

1. Ensure Node.js is installed.

2. Install dependencies:
   ```sh
   npm ci --prod
   ```

3. Start the server:
   ```sh
   npm start
   ```

### Running with Docker

1. Pull the Docker image:
   ```sh
   docker pull smusali/log-collector:latest
   ```

2. Run the Docker container:
   ```sh
   docker run -d -p 3000:3000 -v /var/log:/var/log smusali/log-collector:latest
   ```

## Testing

To run tests, use:
```sh
npm test
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the [MIT License](./LICENSE).