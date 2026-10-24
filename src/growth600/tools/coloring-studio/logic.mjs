const templates = Object.freeze({
  butterfly: Object.freeze({
    viewBox: '0 0 400 400',
    regions: Object.freeze([
      { id: 'upper-left', d: 'M198 174 C153 78 64 74 49 131 C38 173 103 200 193 192 Z' },
      { id: 'upper-right', d: 'M202 174 C247 78 336 74 351 131 C362 173 297 200 207 192 Z' },
      { id: 'lower-left', d: 'M194 201 C117 174 65 223 85 276 C102 318 161 301 195 219 Z' },
      { id: 'lower-right', d: 'M206 201 C283 174 335 223 315 276 C298 318 239 301 205 219 Z' },
      { id: 'body', d: 'M188 175 C188 153 212 153 212 175 L218 274 C217 294 183 294 182 274 Z' },
    ]),
    lines: Object.freeze([
      { id: 'antenna-left', d: 'M191 165 Q164 129 151 121' },
      { id: 'antenna-right', d: 'M209 165 Q236 129 249 121' },
      { id: 'wing-detail-left', d: 'M91 125 Q124 145 177 177 M91 250 Q131 240 177 210' },
      { id: 'wing-detail-right', d: 'M309 125 Q276 145 223 177 M309 250 Q269 240 223 210' },
    ]),
  }),
  flower: Object.freeze({
    viewBox: '0 0 400 400',
    regions: Object.freeze([
      ...Array.from({ length: 8 }, (_, index) => {
        const angle = index * 45;
        return { id: `petal-${index + 1}`, d: 'M200 200 C165 176 164 130 200 106 C236 130 235 176 200 200 Z', transform: `rotate(${angle} 200 200)` };
      }),
      { id: 'flower-center', d: 'M200 200 m-36 0 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0' },
      { id: 'left-leaf', d: 'M197 270 C151 235 112 259 124 296 C152 305 179 294 197 270 Z' },
      { id: 'right-leaf', d: 'M203 293 C235 248 278 255 281 292 C257 309 228 310 203 293 Z' },
    ]),
    lines: Object.freeze([{ id: 'stem', d: 'M200 236 C198 279 201 312 200 346' }]),
  }),
  rocket: Object.freeze({
    viewBox: '0 0 400 400',
    regions: Object.freeze([
      { id: 'rocket-body', d: 'M200 53 C154 100 153 177 160 259 L240 259 C247 177 246 100 200 53 Z' },
      { id: 'window', d: 'M200 126 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0' },
      { id: 'left-fin', d: 'M161 206 C127 225 111 262 112 293 L163 264 Z' },
      { id: 'right-fin', d: 'M239 206 C273 225 289 262 288 293 L237 264 Z' },
      { id: 'flame', d: 'M177 263 C179 300 185 326 200 350 C215 326 221 300 223 263 Z' },
    ]),
    lines: Object.freeze([
      { id: 'left-star', d: 'M72 112 L79 130 L98 137 L79 144 L72 163 L65 144 L46 137 L65 130 Z' },
      { id: 'right-star', d: 'M321 177 L327 191 L342 197 L327 203 L321 218 L315 203 L300 197 L315 191 Z' },
      { id: 'planet', d: 'M70 273 m-17 0 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0' },
    ]),
  }),
});

export const coloringTemplateIds = Object.freeze(Object.keys(templates));

export function getColoringTemplate(id) {
  const template = templates[id];
  if (!template) throw new RangeError('Choose one of the available original coloring templates.');
  return template;
}

export function isColoringColor(value) {
  return /^#[0-9a-f]{6}$/iu.test(String(value ?? ''));
}
