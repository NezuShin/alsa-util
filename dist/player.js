"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALSAWritableStream = exports.ALSAPlayer = void 0;
const child_process_1 = require("child_process");
const index_1 = require("./index");
const stream_1 = require("stream");
class ALSAWritableStream extends stream_1.Writable {
    constructor(player) {
        super();
        this.player = player;
    }
    _write(chunk, encoding, callback) {
        if (!['buffer', 'binary'].includes(encoding)) {
            callback(new Error(`Unsupported encoding: ${encoding}; Supported only buffer or binary types`));
            return;
        }
        if (!Buffer.isBuffer(chunk)) {
            callback(new Error(`Written chunk is not "Buffer" type`));
            return;
        }
        this.player.write(chunk).then(() => {
            callback(null);
        }).catch(err => {
            callback(err);
        });
    }
}
exports.ALSAWritableStream = ALSAWritableStream;
class ALSAPlayer extends index_1.ProcessRunner {
    constructor() {
        super(...arguments);
        this.streams = [];
    }
    spawnProcess() {
        return (0, child_process_1.spawn)('aplay', ['-D', this.options.device, '-r', `${this.options.sampleRate}`, '-f', this.options.sampleFormat, '-c', `${this.options.channels}`]);
    }
    createStream() {
        let stream = new ALSAWritableStream(this);
        this.streams.push(stream);
        return stream;
    }
    write(buf) {
        if (!this.isRunning()) {
            throw new Error("aplay process is not running");
        }
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.playProcess) === null || _a === void 0 ? void 0 : _a.stdin.write(buf, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
exports.ALSAPlayer = ALSAPlayer;
//# sourceMappingURL=player.js.map