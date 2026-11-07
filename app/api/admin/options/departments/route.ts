import { OPTION_KINDS, collectionHandlers } from '@/lib/option-routes';

export const { GET, POST } = collectionHandlers(OPTION_KINDS.departments);
