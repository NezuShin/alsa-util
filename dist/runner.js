"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleFormat = exports.ProcessRunner = void 0;
const events_1 = __importDefault(require("events"));
var SampleFormat;
(function (SampleFormat) {
    SampleFormat["S8"] = "S8";
    SampleFormat["U8"] = "U8";
    SampleFormat["S16_LE"] = "S16_LE";
    SampleFormat["S16_BE"] = "S16_BE";
    SampleFormat["U16_LE"] = "U16_LE";
    SampleFormat["U16_BE"] = "U16_BE";
    SampleFormat["S24_LE"] = "S24_LE";
    SampleFormat["S24_BE"] = "S24_BE";
    SampleFormat["U24_LE"] = "U24_LE";
    SampleFormat["U24_BE"] = "U24_BE";
    SampleFormat["S32_LE"] = "S32_LE";
    SampleFormat["S32_BE"] = "S32_BE";
    SampleFormat["U32_LE"] = "U32_LE";
    SampleFormat["U32_BE"] = "U32_BE";
    SampleFormat["FLOAT_LE"] = "FLOAT_LE";
    SampleFormat["FLOAT_BE"] = "FLOAT_BE";
    SampleFormat["FLOAT64_LE"] = "FLOAT64_LE";
    SampleFormat["FLOAT64_BE"] = "FLOAT64_BE";
    SampleFormat["IEC958_SUBFRAME_LE"] = "IEC958_SUBFRAME_LE";
    SampleFormat["IEC958_SUBFRAME_BE"] = "IEC958_SUBFRAME_BE";
    SampleFormat["MU_LAW"] = "MU_LAW";
    SampleFormat["A_LAW"] = "A_LAW";
    SampleFormat["IMA_ADPCM"] = "IMA_ADPCM";
    SampleFormat["MPEG"] = "MPEG";
    SampleFormat["GSM"] = "GSM";
    SampleFormat["SPECIAL"] = "SPECIAL";
    SampleFormat["S24_3LE"] = "S24_3LE";
    SampleFormat["S24_3BE"] = "S24_3BE";
    SampleFormat["U24_3LE"] = "U24_3LE";
    SampleFormat["U24_3BE"] = "U24_3BE";
    SampleFormat["S20_3LE"] = "S20_3LE";
    SampleFormat["S20_3BE"] = "S20_3BE";
    SampleFormat["U20_3LE"] = "U20_3LE";
    SampleFormat["U20_3BE"] = "U20_3BE";
    SampleFormat["S18_3LE"] = "S18_3LE";
    SampleFormat["S18_3BE"] = "S18_3BE";
    SampleFormat["U18_3LE"] = "U18_3LE";
})(SampleFormat || (exports.SampleFormat = SampleFormat = {}));
class ProcessRunner extends events_1.default {
    constructor(options) {
        super();
        this.errorMessage = Buffer.alloc(0);
        this.options = options;
    }
    isRunning() {
        return !!this.playProcess;
    }
    stop() {
        var _a;
        if (!this.isRunning())
            return;
        (_a = this.playProcess) === null || _a === void 0 ? void 0 : _a.kill();
        this.playProcess = undefined;
    }
    run() {
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
            });
            this.playProcess.on('error', this.onError.bind(this));
        });
    }
    onDataOut(data) {
        if (this.options.debug)
            console.log(data.toString('utf8'));
    }
    onDataErr(data) {
        if (this.options.debug)
            console.log(data.toString('utf8'));
        this.errorMessage = Buffer.concat([this.errorMessage, data]);
    }
    onError(err) {
        this.emit('process-error', err);
    }
    onClose(code) {
        if (code != 0) {
            this.emit('error', new Error(this.errorMessage.toString('utf8')));
        }
        this.emit('close');
    }
}
exports.ProcessRunner = ProcessRunner;
//# sourceMappingURL=runner.js.map