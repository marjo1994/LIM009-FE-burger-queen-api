const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const { spawn } = require('child_process');
const kill = require('tree-kill');


const port = process.env.PORT || 8888;
const baseUrl = process.env.REMOTE_URL || `http://127.0.0.1:${port}`;

module.exports = () => new Promise((resolve, reject) => {
    if (process.env.REMOTE_URL) {
        console.info(`Running tests on remote server ${process.env.REMOTE_URL}`);
        return resolve();
    }

    const mongod = new MongoMemoryServer();

    mongod.getConnectionString().then((mongoUrl) => {
        process.env.DB_URL = mongoUrl;
        console.info('\nIn-memory mongo server ', mongoUrl);

        console.info('Staring local server...');
        const child = spawn('npm', ['start', process.env.PORT || 8000], {
            cwd: path.resolve(__dirname, '../'),
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        Object.assign(unit, { childProcessPid: child.pid });
    });
});