import { pickCharadesPrompt } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';

mountPendingTool('charades', pickCharadesPrompt);
