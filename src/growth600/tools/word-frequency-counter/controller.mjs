import { wordFrequency } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';
mountPendingTool('word-frequency-counter', (input) => wordFrequency({ text: input.text, limit: input.limit }));
