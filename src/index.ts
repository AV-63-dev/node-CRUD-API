import * as dotenv from "dotenv";
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { controller } from './controller';
import { messageServerStart, messageBalancerStart, messagePortProcessingServer } from './messages';
import { ILiveWorkers, IMsg } from './interface';
import cluster from 'cluster';
import { cpus } from 'os';

dotenv.config();
const multiMode = process.argv.includes('--cluster');
const port = +(process.env.PORT || '8000');

const requestHandler = (req:IncomingMessage, res:ServerResponse) => {
    const {code, body, tableNew} = controller(req.method = '', req.url = '');
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(body);
    if ( ! multiMode ) {
        process.env.TABLE_USERS = tableNew;
    } else {
        (<any> process).send({table: tableNew});
        messagePortProcessingServer();
    };
};

if ( ! multiMode ) {
    createServer(requestHandler).listen(port, messageServerStart);
} else {
    if (cluster.isPrimary) {
        const countWorker = cpus().length;
        const liveWorkers:ILiveWorkers = {};
        let numReq = 0;
        process.env.TABLE_USERS = JSON.stringify([]);

        const update_TABLE_USERS = (table:string) => {
            process.env.TABLE_USERS = table;
            for (let portWorker in liveWorkers) {
                liveWorkers[portWorker].send({table: table});
            };
        };

        createServer((req, res) => {
            numReq = (numReq % countWorker) + 1;

            liveWorkers[port + numReq].once('message', (msg:IMsg) => {
                if (msg.code && msg.body && msg.table) {
                    res.writeHead(msg.code, { "Content-Type": "application/json" });
                    res.end(msg.body);
                    update_TABLE_USERS(msg.table);
                };
            });

            liveWorkers[port + numReq].send({method: req.method, url: req.url});

            // TODO: через 0,5секунды проверить res и если не отправили, то выкинуть 500
        }).listen(port, messageBalancerStart);

        for (let i = 1; i <= countWorker; i++) {
            const worker = cluster.fork({PORT: port + i});
            worker.on('message', (msg:IMsg) => {
                if (msg.table) {
                    update_TABLE_USERS(msg.table)
                };
            });
            worker.on('listening', address => {
                liveWorkers[String(address.port)] = worker;
            });
        };

        // TODO: если воркер умирает можем форкнуть новый на порту мертвого и занести воркер в liveWorkers
    } else {
        createServer(requestHandler).listen(port, messageServerStart);

        process.on('message', (msg:IMsg) => {
            if (msg.table) {
                process.env.TABLE_USERS = msg.table;
            } else if (msg.method && msg.url) {
                const {code, body, tableNew} = controller(msg.method, msg.url);
                (<any> process).send({code: code, body: body, table: tableNew});
                messagePortProcessingServer();
            };
        });
    };
};