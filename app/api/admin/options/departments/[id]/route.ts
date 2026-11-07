import { OPTION_KINDS, itemHandlers } from '@/lib/option-routes';

export const { GET, PUT, DELETE } = itemHandlers(OPTION_KINDS.departments);
