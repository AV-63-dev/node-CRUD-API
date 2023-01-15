import * as dotenv from "dotenv";
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { controller } from './controller';
import { messageServerStart, messageBalancerStart, messagePortProcessingServer, messageServerError } from './messages';
import { ILiveWorkers, IMsg } from './interface';
import cluster from 'cluster';
import { cpus } from 'os';
import { getBody, sendResponse } from './helpers';

dotenv.config();
const multiMode = process.argv.includes('--cluster');
const port = +(process.env.PORT || '8000');

const requestHandler = async (req:IncomingMessage, res:ServerResponse) => {
    try {
        const data = await getBody(req);
        const {code, body, table, error} = controller(String(req.method), String(req.url), String(data));
        if (error) throw new Error('code 500');
        if ( ! multiMode ) {
            process.env.TABLE_USERS = table;
        } else {
            (<any> process).send({table});
        };
        sendResponse(res, Number(code), String(body));
    } catch {
        const {code, body} = messageServerError();
        sendResponse(res, code, body);
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
                liveWorkers[portWorker].send({table});
            };
        };

        createServer(async (req, res) => {
            const data = await getBody(req);

            numReq = (numReq % countWorker) + 1;
            const portWorker = port + numReq;

            liveWorkers[portWorker].once('message', (msg:IMsg) => {
                if (msg.error) {
                    const {code, body} = messageServerError();
                    sendResponse(res, code, body);
                } else {
                    update_TABLE_USERS(String(msg.table));
                    sendResponse(res, Number(msg.code), String(msg.body));
                };
            });
                
            liveWorkers[portWorker].send({method: req.method, url: req.url, data});            
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
                worker.send({table: process.env.TABLE_USERS});
            });
        };
    } else {
        createServer(requestHandler).listen(port, messageServerStart);

        process.on('message', async (msg:IMsg) => {
            if (msg.table) {
                process.env.TABLE_USERS = msg.table;
            } else if (msg.method && msg.url) {
                (<any> process).send( controller(msg.method, msg.url, String(msg.data)) );
                messagePortProcessingServer();
            };
        });
    };
};