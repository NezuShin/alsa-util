import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Readable } from 'stream';
import { ProcessRunner } from "./runner";

class ALSAReadableStream extends Readable {

    constructor() {
        super();
    }

    _read(size: number): void {
        
    }
}

class ALSARecorder extends ProcessRunner {

    private streams: ALSAReadableStream[] = [];

    protected spawnProcess(): ChildProcessWithoutNullStreams {
        let process = spawn('arecord', ['-D', this.options.device, '-r', `${this.options.sampleRate}`, '-f', this.options.sampleFormat, '-c', `${this.options.channels}`, `-q`]);

        process.stdout.on('data', this.onData.bind(this));

        return process;
    }

    protected onDataOut(data: any) {
    }

    private onData(data: Buffer) {
        for (let stream of this.streams) {
            stream.push(data);
        }
        this.emit('data', data);
    }

    public createStream() {
        let newStream = new ALSAReadableStream();

        this.streams.push(newStream);
        return newStream;
    }

}


export {
    ALSARecorder,
    ALSAReadableStream
}