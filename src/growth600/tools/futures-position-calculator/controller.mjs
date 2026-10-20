import { calculateFuturesPosition } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';

mountPendingTool('futures-position-calculator', calculateFuturesPosition);
