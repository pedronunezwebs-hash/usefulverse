import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRadioStations, parseRadioPlaylist, radioPlaylistLimits } from './logic.mjs';

const playlist = `#EXTM3U
#EXTINF:-1 tvg-country="US" tvg-language="English" group-title="News, Talk",North News
https://radio.example/north
#EXTINF:-1 tvg-country="MX" tvg-language="Spanish" group-title="Music",Radio Sur
https://radio.example/sur
#EXTINF:-1 tvg-country="US" tvg-language="English" group-title="Jazz",City Jazz
https://radio.example/jazz
`;

test('parses labeled M3U stations and retains only safe HTTPS streams', () => {
  const stations = parseRadioPlaylist(playlist);
  assert.equal(stations.length, 3);
  assert.deepEqual(stations[0], {
    name: 'North News', country: 'US', language: 'English', tags: 'News, Talk', url: 'https://radio.example/north',
  });
  assert.equal(Object.isFrozen(stations), true);
});

test('filters station name, country, language, and tag locally', () => {
  const stations = parseRadioPlaylist(playlist);
  assert.deepEqual(filterRadioStations(stations, { country: 'us', language: 'english' }).map(({ name }) => name), ['North News', 'City Jazz']);
  assert.deepEqual(filterRadioStations(stations, { station: 'radio', country: 'MX', tag: 'music' }).map(({ name }) => name), ['Radio Sur']);
  assert.throws(() => filterRadioStations(stations, {}), { message: 'empty-filter' });
  assert.throws(() => filterRadioStations(stations, { country: 'USA' }), { message: 'invalid-country' });
});

test('rejects malformed, oversized, and unbounded playlists', () => {
  assert.throws(() => parseRadioPlaylist('not an M3U'), { message: 'invalid-playlist' });
  assert.throws(() => parseRadioPlaylist('x'.repeat(radioPlaylistLimits.maxBytes + 1)), { message: 'playlist-too-large' });
  const unsafe = '#EXTM3U\n#EXTINF:-1,HTTP station\nhttp://radio.example/stream\n#EXTINF:-1,Private station\nhttps://192.168.1.2/stream\n#EXTINF:-1,Unusual port\nhttps://radio.example:8443/stream\n';
  assert.throws(() => parseRadioPlaylist(unsafe), { message: 'no-valid-stations' });
  const lines = ['#EXTM3U'];
  for (let index = 0; index <= radioPlaylistLimits.maxStations; index += 1) lines.push(`#EXTINF:-1,Station ${index}`, `https://radio.example/${index}`);
  assert.throws(() => parseRadioPlaylist(lines.join('\n')), { message: 'too-many-stations' });
});

test('caps the filtered list at 30 results', () => {
  const many = ['#EXTM3U'];
  for (let index = 0; index < 40; index += 1) many.push(`#EXTINF:-1 tvg-country="US",Station ${index}`, `https://radio.example/${index}`);
  assert.equal(filterRadioStations(parseRadioPlaylist(many.join('\n')), { country: 'US' }).length, 30);
});
