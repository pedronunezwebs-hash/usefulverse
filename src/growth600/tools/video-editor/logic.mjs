export function validateVideoTimeline(clips, { maxClips = 3, maxDuration = 120, maxBytes = 100 * 1024 * 1024 } = {}) {
  if (!Array.isArray(clips) || clips.length < 1 || clips.length > maxClips) throw new RangeError(`Choose between 1 and ${maxClips} clips.`);
  let totalBytes = 0;
  let totalDuration = 0;
  const validated = clips.map((clip) => {
    if (!clip?.file || !Number.isFinite(clip.file.size) || clip.file.size <= 0) throw new RangeError('A selected video file is empty or unavailable.');
    const duration = Number(clip.duration);
    const start = Number(clip.start);
    const end = Number(clip.end);
    if (![duration, start, end].every(Number.isFinite) || duration <= 0 || start < 0 || end <= start || end > duration) throw new RangeError('Every clip needs a valid start and end within its video.');
    totalBytes += clip.file.size;
    totalDuration += end - start;
    return Object.freeze({ ...clip, duration, start, end });
  });
  if (totalBytes > maxBytes) throw new RangeError('The selected files exceed the 100 MiB total limit.');
  if (totalDuration > maxDuration) throw new RangeError('The edited sequence exceeds the 120-second limit.');
  return Object.freeze({ clips: Object.freeze(validated), totalBytes, totalDuration });
}
