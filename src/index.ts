import { ChildProcessWithoutNullStreams } from "child_process";
import EventEmitter from "events"
import { ALSAPlayer } from "./player"
import { ALSARecorder } from "./recorder"



enum SampleFormat {//taken from https://linux.die.net/man/1/aplay
    S8 = 'S8',
    U8 = 'U8',
    S16_LE = 'S16_LE',
    S16_BE = 'S16_BE',
    U16_LE = 'U16_LE',
    U16_BE = 'U16_BE',
    S24_LE = 'S24_LE',
    S24_BE = 'S24_BE',
    U24_LE = 'U24_LE',
    U24_BE = 'U24_BE',
    S32_LE = 'S32_LE',
    S32_BE = 'S32_BE',
    U32_LE = 'U32_LE',
    U32_BE = 'U32_BE',
    FLOAT_LE = 'FLOAT_LE',
    FLOAT_BE = 'FLOAT_BE',
    FLOAT64_LE = 'FLOAT64_LE',
    FLOAT64_BE = 'FLOAT64_BE',
    IEC958_SUBFRAME_LE = 'IEC958_SUBFRAME_LE',
    IEC958_SUBFRAME_BE = 'IEC958_SUBFRAME_BE',
    MU_LAW = 'MU_LAW',
    A_LAW = 'A_LAW',
    IMA_ADPCM = 'IMA_ADPCM',
    MPEG = 'MPEG',
    GSM = 'GSM',
    SPECIAL = 'SPECIAL',
    S24_3LE = 'S24_3LE',
    S24_3BE = 'S24_3BE',
    U24_3LE = 'U24_3LE',
    U24_3BE = 'U24_3BE',
    S20_3LE = 'S20_3LE',
    S20_3BE = 'S20_3BE',
    U20_3LE = 'U20_3LE',
    U20_3BE = 'U20_3BE',
    S18_3LE = 'S18_3LE',
    S18_3BE = 'S18_3BE',
    U18_3LE = 'U18_3LE'
}

interface ALSAPlayerOptions {
    device: string,
    channels: number,
    sampleFormat: SampleFormat,
    sampleRate: number,
    debug?: boolean
}

abstract class ProcessRunner extends EventEmitter {
    protected options: ALSAPlayerOptions;
    protected playProcess?: ChildProcessWithoutNullStreams;
    protected errorMessage: Buffer = Buffer.alloc(0);

    constructor(options: ALSAPlayerOptions) {
        super();
        this.options = options;
    }

    public isRunning() {
        return !!this.playProcess;
    }

    public stop() {
        if (!this.isRunning())
            return;
        this.playProcess?.kill();
        this.playProcess = undefined;
    }

    protected abstract spawnProcess(): ChildProcessWithoutNullStreams;

    public run(): Promise<void> {
        if (this.isRunning()) {
            throw new Error("aplay process is already running");
        }
        return new Promise((resolve, reject) => {
            this.playProcess = this.spawnProcess();

            this.playProcess.stdout.on('data', this.onDataOut.bind(this));

            this.playProcess.stderr.on('data', this.onDataErr.bind(this));

            this.playProcess.on('close', this.onClose.bind(this));

            this.playProcess.on('spawn', () => {
                resolve();
            });
            this.playProcess.once('error', (err1) => {
                reject(err1);
            })

            this.playProcess.on('error', this.onError.bind(this));
        });
    }

    protected onDataOut(data: any) {
        if (this.options.debug)
            console.log(data.toString('utf8'));
    }

    protected onDataErr(data: any) {
        if (this.options.debug)
            console.log(data.toString('utf8'));
        this.errorMessage = Buffer.concat([this.errorMessage, data]);
    }

    protected onError(err: any) {
        this.emit('process-error', err);
    }

    protected onClose(code: number) {
        if(code != 0){
            this.emit('error', new Error(this.errorMessage.toString('utf8')));
        }
        this.emit('close');
    }
}

export {
    ALSAPlayerOptions,
    ProcessRunner,
    SampleFormat,
    ALSAPlayer,
    ALSARecorder
}