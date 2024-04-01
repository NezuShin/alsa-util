/// <reference types="node" />
/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
import { ProcessRunner } from "./index";
import { Readable } from 'stream';
declare class ALSAReadableStream extends Readable {
    constructor();
    _read(size: number): void;
}
declare class ALSARecorder extends ProcessRunner {
    private streams;
    protected spawnProcess(): ChildProcessWithoutNullStreams;
    protected onDataOut(data: any): void;
    private onData;
    createStream(): ALSAReadableStream;
}
export { ALSARecorder, ALSAReadableStream };
//# sourceMappingURL=recorder.d.ts.map