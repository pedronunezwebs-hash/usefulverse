import { calculateIndiaEpf } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';

mountPendingTool('india-epf-calculator', calculateIndiaEpf);
