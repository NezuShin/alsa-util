"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALSAReadableStream = exports.ALSARecorder = void 0;
const child_process_1 = require("child_process");
const index_1 = require("./index");
const stream_1 = require("stream");
class ALSAReadableStream extends stream_1.Readable {
    constructor() {
        super();
    }
    _read(size) {
    }
}
exports.ALSAReadableStream = ALSAReadableStream;
class ALSARecorder extends index_1.ProcessRunner {
    constructor() {
        super(...arguments);
        this.streams = [];
    }
    spawnProcess() {
        let process = (0, child_process_1.spawn)('arecord', ['-D', this.options.device, '-r', `${this.options.sampleRate}`, '-f', this.options.bitDepth, '-c', `${this.options.channels}`, `-q`]);
        process.stdout.on('data', this.onData.bind(this));
        return process;
    }
    onDataOut(data) {
    }
    onData(data) {
        for (let stream of this.streams) {
            stream.push(data);
        }
        this.emit('data', data);
    }
    createStream() {
        let newStream = new ALSAReadableStream();
        this.streams.push(newStream);
        return newStream;
    }
}
exports.ALSARecorder = ALSARecorder;
//# sourceMappingURL=recorder.js.map