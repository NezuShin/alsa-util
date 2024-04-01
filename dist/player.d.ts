/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
import { ProcessRunner } from "./index";
import { Writable } from 'stream';
declare class ALSAWritableStream extends Writable {
    private player;
    constructor(player: ALSAPlayer);
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void;
}
declare class ALSAPlayer extends ProcessRunner {
    private streams;
    protected spawnProcess(): ChildProcessWithoutNullStreams;
    createStream(): ALSAWritableStream;
    write(buf: Buffer): Promise<void>;
}
export { ALSAPlayer, ALSAWritableStream, };
//# sourceMappingURL=player.d.ts.map