/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from "child_process";
import EventEmitter from "events";
import { ALSAPlayer } from "./player";
import { ALSARecorder } from "./recorder";
declare enum SampleFormat {
    S8 = "S8",
    U8 = "U8",
    S16_LE = "S16_LE",
    S16_BE = "S16_BE",
    U16_LE = "U16_LE",
    U16_BE = "U16_BE",
    S24_LE = "S24_LE",
    S24_BE = "S24_BE",
    U24_LE = "U24_LE",
    U24_BE = "U24_BE",
    S32_LE = "S32_LE",
    S32_BE = "S32_BE",
    U32_LE = "U32_LE",
    U32_BE = "U32_BE",
    FLOAT_LE = "FLOAT_LE",
    FLOAT_BE = "FLOAT_BE",
    FLOAT64_LE = "FLOAT64_LE",
    FLOAT64_BE = "FLOAT64_BE",
    IEC958_SUBFRAME_LE = "IEC958_SUBFRAME_LE",
    IEC958_SUBFRAME_BE = "IEC958_SUBFRAME_BE",
    MU_LAW = "MU_LAW",
    A_LAW = "A_LAW",
    IMA_ADPCM = "IMA_ADPCM",
    MPEG = "MPEG",
    GSM = "GSM",
    SPECIAL = "SPECIAL",
    S24_3LE = "S24_3LE",
    S24_3BE = "S24_3BE",
    U24_3LE = "U24_3LE",
    U24_3BE = "U24_3BE",
    S20_3LE = "S20_3LE",
    S20_3BE = "S20_3BE",
    U20_3LE = "U20_3LE",
    U20_3BE = "U20_3BE",
    S18_3LE = "S18_3LE",
    S18_3BE = "S18_3BE",
    U18_3LE = "U18_3LE"
}
interface ALSAPlayerOptions {
    device: string;
    channels: number;
    bitDepth: SampleFormat;
    sampleRate: number;
    debug?: boolean;
}
declare abstract class ProcessRunner extends EventEmitter {
    protected options: ALSAPlayerOptions;
    protected playProcess?: ChildProcessWithoutNullStreams;
    protected errorMessage: Buffer;
    constructor(options: ALSAPlayerOptions);
    isRunning(): boolean;
    stop(): void;
    protected abstract spawnProcess(): ChildProcessWithoutNullStreams;
    run(): Promise<void>;
    protected onDataOut(data: any): void;
    protected onDataErr(data: any): void;
    protected onError(err: any): void;
    protected onClose(code: number): void;
}
export { ALSAPlayerOptions, ProcessRunner, SampleFormat, ALSAPlayer, ALSARecorder };
//# sourceMappingURL=index.d.ts.map