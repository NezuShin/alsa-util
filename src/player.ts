import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { ProcessRunner } from "./index";
import { Writable } from 'stream';

class ALSAWritableStream extends Writable {

    private player: ALSAPlayer;

    constructor(player: ALSAPlayer) {
        super();
        this.player = player;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
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


class ALSAPlayer extends ProcessRunner {


    private streams: ALSAWritableStream[] = [];

    protected spawnProcess(): ChildProcessWithoutNullStreams {
        return spawn('aplay', ['-D', this.options.device, '-r', `${this.options.sampleRate}`, '-f', this.options.sampleFormat, '-c', `${this.options.channels}`]);
    }

    public createStream() {
        let stream = new ALSAWritableStream(this);

        this.streams.push(stream);
        return stream;
    }

    public write(buf: Buffer): Promise<void> {
        if (!this.isRunning()) {
            throw new Error("aplay process is not running");
        }
        return new Promise((resolve, reject) => {
            this.playProcess?.stdin.write(buf, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

}

//this.playProcess = ;

export {
    ALSAPlayer,
    ALSAWritableStream,

}