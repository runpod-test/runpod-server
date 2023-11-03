# Runpod Take Home Test

## API Documentation
Please refer to the [API Documentation](https://documenter.getpostman.com/view/1386501/2s9YXe6PM2) for more information on the API.

## Running the API
### Prerequisites
- Node.js v12.16.1 or higher
- npm v6.13.4 or higher

### Steps
1. Clone the repository
2. Add a `.env` file in the root directory with the content found in `.env.sample`
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the API server
5. The API server will be running on port 4000 by default


## Logging
The API logs are stored locally in the `logs` directory. The logs are not rotated since this is a test project.
All logs are logged to the `combined.log` file, and errors are logged to the `error.log` file.

## Testing
Basic API tests have been written using `mocha`, `chai` and `supertest`. To run the tests, run `npm test` in the root directory.
To avoid calling the RunPod API for image generation during tests, the external API call have been mocked using `sinon`.
