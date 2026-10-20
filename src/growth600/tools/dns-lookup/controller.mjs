import { dnsLookup } from '../pending-23/logic.mjs';
import { mountPendingTool } from '../pending-23/controller.mjs';

mountPendingTool('dns-lookup', dnsLookup);
