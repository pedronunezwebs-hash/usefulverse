import {
  ALL_FORMATS,
  AudioBufferSink,
  BlobSource,
  BufferTarget,
  canEncodeAudio,
  Conversion,
  Input,
  Mp3OutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  Quality,
  StreamTarget,
} from 'mediabunny';
import { registerMp3Encoder } from '@mediabunny/mp3-encoder';

const TRANSCRIPTION_RATE = 16_000;
const TRANSCRIPTION_CHUNK_SECONDS = 30;

const outputFormats = {
  mp3: { codec: 'mp3', extension: 'mp3', mime: 'audio/mpeg', create: () => new Mp3OutputFormat() },
  m4a: { codec: 'aac', extension: 'm4a', mime: 'audio/mp4', create: () => new Mp4OutputFormat() },
  ogg: { codec: 'opus', extension: 'ogg', mime: 'audio/ogg', create: () => new OggOutputFormat() },
};

function throwIfAborted(signal) {
  if (signal?.aborted) throw new DOMException('Audio processing was canceled.', 'AbortError');
}

export async function compressAudio({ file, format, quality, writable, onProgress, signal }) {
  const selected = outputFormats[format];
  if (!selected) throw new TypeError('Choose MP3, M4A or OGG as the output format.');
  throwIfAborted(signal);

  if (format === 'mp3' && !(await canEncodeAudio('mp3'))) registerMp3Encoder();

  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    if (!(await input.canRead())) throw new TypeError('This audio format could not be read. Try MP3, M4A, WAV, OGG or FLAC.');
    const tracks = await input.getTracks();
    const audioTracks = tracks.filter((track) => track.isAudioTrack());
    if (audioTracks.length !== 1 || tracks.length !== 1) {
      throw new TypeError('Choose an audio-only file with one audio track. The original was not changed.');
    }
    if (!(await audioTracks[0].canDecode())) {
      throw new TypeError('This browser cannot decode the audio codec in this file. Try a common MP3, M4A, WAV or OGG file.');
    }

    const target = writable
      ? new StreamTarget(writable, { chunked: true, chunkSize: 2 * 1024 * 1024 })
      : new BufferTarget();
    const output = new Output({ format: selected.create(), target });
    const conversion = await Conversion.init({
      input,
      output,
      tracks: 'primary',
      copy: false,
      showWarnings: false,
      audio: { codec: selected.codec, quality: new Quality(quality), forceTranscode: true },
    });
    if (conversion.discardedTracks.length) throw new TypeError('The selected format cannot preserve this audio file. No output was saved.');
    if (!conversion.isValid) throw new TypeError('This browser cannot encode the selected output format. Try MP3 or another browser.');
    conversion.onProgress = (progress) => onProgress?.(Math.max(0, Math.min(100, Math.round(progress * 100))));

    const cancel = () => { void conversion.cancel(); };
    signal?.addEventListener('abort', cancel, { once: true });
    try {
      throwIfAborted(signal);
      await conversion.execute();
    } finally {
      signal?.removeEventListener('abort', cancel);
    }

    if (target instanceof BufferTarget) {
      if (!target.buffer) throw new Error('The compressed audio could not be created.');
      return { blob: new Blob([target.buffer], { type: selected.mime }), streamed: false };
    }
    return { blob: null, streamed: true };
  } finally {
    input.dispose();
  }
}

export async function prepareAudioReader(file) {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    if (!(await input.canRead())) throw new TypeError('This media format could not be read. Try MP3, WAV, M4A, OGG, MP4, MOV or WebM.');
    const track = await input.getPrimaryAudioTrack();
    if (!track) throw new TypeError('No audio track was found. Choose a recording or a video that contains sound.');
    if (!(await track.canDecode())) throw new TypeError('This browser cannot decode the audio codec in this file. Try MP3, WAV, M4A, OGG, MP4, MOV or WebM.');
    const duration = await input.getDurationFromMetadata([track]).catch(() => null);
    const sink = new AudioBufferSink(track);
    let disposed = false;

    return {
      duration: Number.isFinite(duration) && duration > 0 ? duration : null,
      dispose() {
        if (disposed) return;
        disposed = true;
        input.dispose();
      },
      async stream({ signal, onChunk, onProgress }) {
        const chunkCapacity = TRANSCRIPTION_RATE * TRANSCRIPTION_CHUNK_SECONDS;
        let chunk = new Float32Array(chunkCapacity);
        let chunkLength = 0;
        const flush = async () => {
          if (!chunkLength) return;
          throwIfAborted(signal);
          const ready = chunkLength === chunk.length ? chunk : chunk.slice(0, chunkLength);
          await onChunk(ready);
          chunk = new Float32Array(chunkCapacity);
          chunkLength = 0;
        };

        try {
          for await (const { buffer, timestamp, duration: bufferDuration } of sink.buffers()) {
            throwIfAborted(signal);
            const sourceRate = buffer.sampleRate;
            const outputLength = Math.max(0, Math.round(buffer.length * TRANSCRIPTION_RATE / sourceRate));
            const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
            for (let index = 0; index < outputLength; index += 1) {
              const position = index * sourceRate / TRANSCRIPTION_RATE;
              const left = Math.min(buffer.length - 1, Math.floor(position));
              const right = Math.min(buffer.length - 1, left + 1);
              const mix = position - left;
              let mono = 0;
              for (const samples of channels) mono += samples[left] + (samples[right] - samples[left]) * mix;
              chunk[chunkLength] = mono / channels.length;
              chunkLength += 1;
              if (chunkLength === chunkCapacity) await flush();
            }
            const elapsed = Math.max(0, timestamp + bufferDuration);
            if (this.duration) onProgress?.(Math.min(100, Math.floor(elapsed / this.duration * 100)));
          }
          await flush();
        } finally {
          if (signal?.aborted) this.dispose();
        }
      },
    };
  } catch (error) {
    input.dispose();
    throw error;
  }
}
