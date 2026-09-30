import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
  Quality,
  StreamTarget,
  WebMOutputFormat,
} from 'mediabunny';

export async function compressVideo({ file, format, quality, maxHeight, writable, onProgress, signal }) {
  const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
  try {
    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) throw new Error('No video track was found in this file.');

    const target = writable
      ? new StreamTarget(writable, { chunked: true, chunkSize: 4 * 1024 * 1024 })
      : new BufferTarget();
    const output = new Output({
      format: format === 'webm' ? new WebMOutputFormat() : new Mp4OutputFormat(),
      target,
    });
    const conversion = await Conversion.init({
      input,
      output,
      tracks: 'all',
      copy: false,
      showWarnings: false,
      video: async (track) => {
        const height = await track.getDisplayHeight();
        return {
          quality: new Quality(quality),
          ...(maxHeight && height > maxHeight ? { height: maxHeight } : {}),
        };
      },
      audio: { quality: new Quality('medium'), forceTranscode: true },
    });

    if (conversion.discardedTracks.length) {
      const trackTypes = [...new Set(conversion.discardedTracks.map(({ track }) => track.isVideoTrack() ? 'video' : track.isAudioTrack() ? 'audio' : 'subtitle or data'))];
      throw new Error(`This output would omit a ${trackTypes.join(', ')} track. No output was saved so the file is not silently changed.`);
    }
    if (!conversion.isValid) throw new Error('This browser cannot encode the selected video in that format. Try another format or browser.');

    conversion.onProgress = (progress) => onProgress?.(Math.max(0, Math.min(100, Math.round(progress * 100))));
    const cancel = () => { void conversion.cancel(); };
    signal?.addEventListener('abort', cancel, { once: true });
    try {
      if (signal?.aborted) cancel();
      await conversion.execute();
    } finally {
      signal?.removeEventListener('abort', cancel);
    }

    if (target instanceof BufferTarget) {
      if (!target.buffer) throw new Error('The compressed video could not be created.');
      return { blob: new Blob([target.buffer], { type: format === 'webm' ? 'video/webm' : 'video/mp4' }), streamed: false };
    }
    return { blob: null, streamed: true };
  } finally {
    input.dispose();
  }
}
