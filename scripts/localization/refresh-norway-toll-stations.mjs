import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const dataDirectory = join(root, 'src/markets-no-ch/data');
const endpoint = 'https://nvdb-eksport.atlas.vegvesen.no/vegobjekter/45.csv?segmentering=true&inkluder=alle&api=https://nvdbapiles-v3.atlas.vegvesen.no&srid=4326';
const now = new Date();
const date = now.toISOString().slice(0, 10);
const stamp = now.toISOString().replaceAll(':', '').replace(/[-.]/gu, '').replace(/Z$/u, 'Z');
const destination = join(dataDirectory, `nvdb-toll-stations-4326-${stamp}.csv`);

await mkdir(dataDirectory, { recursive: true });
const response = await fetch(endpoint, { signal: AbortSignal.timeout(60000), headers: { accept: 'text/csv' } });
if (!response.ok) throw new Error(`Statens vegvesen NVDB export failed with HTTP ${response.status}.`);
const bytes = new Uint8Array(await response.arrayBuffer());
if (bytes.byteLength < 1000 || bytes.byteLength > 20_000_000) throw new Error(`Unexpected NVDB CSV size: ${bytes.byteLength} bytes.`);
const csv = new TextDecoder('utf-8').decode(bytes);
const firstLine = csv.split(/\r?\n/u, 1)[0];
if (!firstLine.includes('OBJ.TYPE-ID') || !firstLine.includes('EGS.NAVN BOMSTASJON') || !firstLine.includes('GEO.GEOMETRI')) {
  throw new Error('The NVDB response did not contain the expected open toll-station CSV fields.');
}
if ((csv.match(/AutoPASS bomstasjon/gu) ?? []).length < 300) throw new Error('The toll-station response looks incomplete; keeping the existing checked-in dataset.');
await writeFile(destination, bytes, { flag: 'wx' });
console.log(`Downloaded ${bytes.byteLength} bytes from the free public NVDB export to ${destination}.`);
const compiler = join(root, 'scripts/localization/compile-nvdb-tolls-data.py');
const compiled = spawnSync('python3', [compiler, destination, date], { cwd: root, stdio: 'inherit' });
if (compiled.error) throw compiled.error;
if (compiled.status !== 0) throw new Error(`NVDB data compiler exited with ${compiled.status}.`);
console.log('Static dataset refreshed locally. Recheck tariff details with each toll operator before use; no runtime request or scheduled job was added.');
