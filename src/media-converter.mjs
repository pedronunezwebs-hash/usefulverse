import {
  ALL_FORMATS, BlobSource, BufferTarget, Conversion, Input, Mp3OutputFormat, Mp4OutputFormat,
  OggOutputFormat, Output, Quality, StreamTarget, WebMOutputFormat, canEncodeAudio,
} from 'mediabunny';
import { registerMp3Encoder } from '@mediabunny/mp3-encoder';

const outputs = {
  mp3: { extension: 'mp3', mime: 'audio/mpeg', audio: true, format: () => new Mp3OutputFormat(), codec: 'mp3' },
  m4a: { extension: 'm4a', mime: 'audio/mp4', audio: true, format: () => new Mp4OutputFormat(), codec: 'aac' },
  ogg: { extension: 'ogg', mime: 'audio/ogg', audio: true, format: () => new OggOutputFormat(), codec: 'opus' },
  mp4: { extension: 'mp4', mime: 'video/mp4', audio: false, format: () => new Mp4OutputFormat() },
  webm: { extension: 'webm', mime: 'video/webm', audio: false, format: () => new WebMOutputFormat() },
};

export async function convertMedia({ file, format, start = 0, end, writable = null, onProgress, signal }) {
  const selected = outputs[format];
  if (!selected) throw new TypeError('Choose a supported output format.');
  if (!(Number.isFinite(start) && start >= 0) || (end != null && !(Number.isFinite(end) && end > start))) throw new RangeError('End time must be greater than a valid start time.');
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  let conversion;
  try {
    if (!(await input.canRead())) throw new TypeError('This browser cannot read this media format. Try a common MP4, WebM, MP3, WAV, M4A or OGG file.');
    const tracks = await input.getTracks();
    const audio = tracks.filter((track) => track.isAudioTrack());
    const video = tracks.filter((track) => track.isVideoTrack());
    const wanted = selected.audio ? audio : video;
    if (!wanted.length) throw new TypeError(selected.audio ? 'No audio track was found.' : 'No video track was found. Choose an audio output to extract sound from a video.');
    for (const track of wanted) if (!(await track.canDecode())) throw new TypeError('This browser cannot decode the selected track. Try a different browser or input format.');
    if (format === 'mp3' && !(await canEncodeAudio('mp3'))) registerMp3Encoder();
    const target = writable ? new StreamTarget(writable, { chunked: true, chunkSize: 4 * 1024 * 1024 }) : new BufferTarget();
    const output = new Output({ format: selected.format(), target });
    conversion = await Conversion.init({
      input, output, tracks: 'all', trim: { start, ...(end == null ? {} : { end }) },
      video: selected.audio ? { discard: true } : { quality: new Quality('medium') },
      audio: selected.audio ? { codec: selected.codec, quality: new Quality('medium'), forceTranscode: true } : { discard: true },
      showWarnings: false,
    });
    const unexpected = conversion.discardedTracks.filter(({ track, reason }) => reason !== 'discarded_by_user' && !(selected.audio ? track.isVideoTrack() : track.isAudioTrack()));
    if (unexpected.length) throw new TypeError('The selected output would omit an unsupported track. Choose another format; no output was saved.');
    if (!conversion.isValid) throw new TypeError('This browser cannot encode the selected format. Try a different output or browser.');
    conversion.onProgress = (value) => onProgress?.(Math.max(0, Math.min(100, Math.round(value * 100))));
    const abort = () => { void conversion.cancel(); };
    signal?.addEventListener('abort', abort, { once: true });
    try { if (signal?.aborted) abort(); await conversion.execute(); }
    finally { signal?.removeEventListener('abort', abort); }
    if (target instanceof BufferTarget) {
      if (!target.buffer) throw new Error('The converted media file could not be created.');
      return { blob: new Blob([target.buffer], { type: selected.mime }), streamed: false, extension: selected.extension };
    }
    return { blob: null, streamed: true, extension: selected.extension };
  } finally {
    if (signal?.aborted) await conversion?.cancel().catch(() => {});
    input.dispose();
  }
}
