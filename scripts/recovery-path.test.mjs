import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);

test('recovery locates source from a checkout with spaces and Unicode before validating the manifest', async () => {
  const temp = await mkdtemp(join(import.meta.dirname, '.recovery-path-'));
  const root = join(temp, 'project with spaces á');
  try {
    await mkdir(join(root, 'scripts'), { recursive: true }); await mkdir(join(root, 'src/growth600'), { recursive: true });
    await mkdir(join(root, 'output'));
    await copyFile(new URL('./merge-live-only-106.mjs', import.meta.url), join(root, 'scripts/merge-live-only-106.mjs'));
    await writeFile(join(root, 'src/growth600/live-only-106.manifest.json'), JSON.stringify({ tools: [] }));
    await assert.rejects(exec(process.execPath, [join(root, 'scripts/merge-live-only-106.mjs')], { env: { ...process.env, GROWTH600_DIST: join(root, 'output') } }), error => {
      assert.match(error.stderr, /recovery manifest is invalid or incomplete/u);
      assert.ok(!error.stderr.includes("code: 'ENOENT'")); return true;
    });
  } finally { await rm(temp, { recursive: true, force: true }); }
});
