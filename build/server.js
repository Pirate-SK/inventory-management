"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./database/database");
const index_1 = __importDefault(require("./routes/index"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
class AppService {
    constructor() {
        this.dbBootstraped = false;
        this.esMigrated = false;
        this.app = (0, express_1.default)();
        this.port = process.env.PORT;
        this.env = process.env.NODE_ENV;
        this.initializeApp();
        // this.initCronJobs();
    }
    initializeApp() {
        this.app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
        this.app.use('/api/v1', index_1.default);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: "50mb" }));
        this.app.use('/logs', express_1.default.static(path_1.default.join(__dirname, '../logs')));
    }
    async initDB() {
        try {
            database_1.sequelize.sync()
                .then((data) => {
                this.dbBootstraped = true;
                console.log('connected to database');
            })
                .catch((err) => console.log(err));
        }
        catch (e) {
            console.log({
                message: e.message,
                stack: e.stack,
            });
            console.log('Error bootstraping the database.');
            this.app.set('HEALTH_STATUS', 'DB_MIGRATION_FAILED');
            return Promise.reject(e);
        }
    }
    async initCronJobs() {
        try {
            //   const cronJob = cron.schedule('0 0 */4 * * *', async function() {
            //     await cronJobs.syncActivities();
            //     console.log('Process running every 4 hours');
            //   });
            //   cronJob.start();
        }
        catch (e) {
            console.log({
                message: e.message,
            });
        }
    }
    init() {
        console.log('Initializing backend-app');
        const { PORT, NODE_ENV, } = process.env;
        // ENV Argument Checks
        if (!PORT || !NODE_ENV) {
            const msg = 'Configuration Error: you must specify these ENV variables: PORT, NODE_ENV';
            console.log(msg);
            throw new Error(msg);
        }
        this.port = PORT;
        this.env = NODE_ENV;
    }
    // eslint-disable-next-line complexity
    async start() {
        const DOCKER_HOST = 'localhost';
        this.server = http_1.default.createServer(this.app);
        this.server.listen(this.port, DOCKER_HOST, (err) => {
            if (err) {
                this.app.set('HEALTH_STATUS', 'SERVER_LISTEN_FAILED');
                throw err;
            }
            console.log(`Server started on http://${DOCKER_HOST}:${this.port}`);
        });
        if (!this.dbBootstraped) {
            // await this.initDB();
        }
        this.app.set('HEALTH_STATUS', 'READY');
        console.log('Initialization successful. Service is Ready.');
        // Shutdown Hook
        process.on('SIGTERM', () => {
            this.stop();
        });
        process.on('unhandledRejection', (e) => {
            console.log({
                message: e.message,
                stack: e.stack,
            });
            console.log('Error due to unhandledRejection.');
        });
        console.log('backend-svc: Server started!');
        return Promise.resolve();
    }
    /**
     * Closes the connection and exits with status code 0 after 3000 ms.
     * Sets HEALTH_STATUS to SHUTTING_DOWN while in progress
     *
     * @memberof Service
     */
    stop() {
        console.log('Starting graceful shutdown...');
        this.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');
        // LoadingDock.readShutdown();
        setTimeout(() => {
            this.app.close(() => {
                console.log('Shutdown Complete.');
                process.exit(0);
            });
        }, 3000);
    }
    shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
        }
        // fallback to standard filter function
        return compression_1.default.filter(req, res);
    }
}
exports.default = AppService;
