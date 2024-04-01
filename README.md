# alsa-util
Simple aplay and arecord Node.js wrapper \
Player Example:
```typescript
import { ALSAPlayer, SampleFormat } from "alsa-util";
import { readFileSync, createReadStream } from "fs";

(async () => {
    let player = new ALSAPlayer({ sampleFormat: SampleFormat.S16_LE, channels: 1, device: "plughw:1,0", sampleRate: 16000 });
    
    //start aplay process
    await player.run();

    //just pass buffer with raw pcm to player.write();
    await player.write(readFileSync("./hello.raw_pcm", { encoding: null }));

    //or create stream and pipe it
    createReadStream('./hello.raw_pcm').pipe(player.createStream());
    //you can make multiple streams, and every stream will properly work

    player.on('error', (err: Error) => {//handle errors. Emits when process exits with code != 0; message takes from stderr
        console.log(err.message);//aplay: main:831: audio open error: Device or resource busy
    });

    player.on('close', () => {
        console.log("Process is exited");
    });

})().catch(console.log);
```
Recorder example: 
```typescript
import { ALSARecorder, SampleFormat } from "alsa-util";
import { appendFileSync, createWriteStream } from "fs";

(async () => {
    let recorder = new ALSARecorder({ sampleFormat: SampleFormat.S16_LE, channels: 1, device: "plughw:1,0", sampleRate: 16000 });

    //start arecord process
    await recorder.run();

    //data event with pcm data
    recorder.on('data', (data: Buffer) => {
        appendFileSync('./mic-input.raw_pcm', data, { encoding: null });
    });

    //You also may create streams, any count you need
    recorder.createStream().pipe(createWriteStream('./mic-stream-first-input.raw_pcm'));
    recorder.createStream().pipe(createWriteStream('./mic-stream-second-input.raw_pcm'));

    recorder.on('error', (err: Error) => {//handle errors. Emits when process exits with code != 0; message takes from stderr
        console.log(err.message);//arecord: main:831: audio open error: Device or resource busy
    });

    recorder.on('close', () => {
        console.log("Process is exited");
    });


})().catch(console.log);
```



