import { transcribeScore } from '../pending-23/zero-cost-tools.mjs';
import { mountZeroCostTool } from '../pending-23/zero-cost-controller.mjs';

mountZeroCostTool('sheet-music-scanner', transcribeScore);
