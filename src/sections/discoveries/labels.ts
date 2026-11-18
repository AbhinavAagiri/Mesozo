import type { DiscoveryMediaRole } from '../../data/types';

export const MEDIA_ROLE_LABEL: Record<DiscoveryMediaRole, string> = {
  'fossil-photograph': 'Fossil photograph',
  cast: 'Museum cast',
  'historical-illustration': 'Historical illustration',
  'skeletal-reconstruction': 'Skeletal reconstruction',
  'mounted-reconstruction': 'Mounted reconstruction',
  'excavation-photograph': 'Excavation photograph',
};

export const MILESTONE_KIND_LABEL: Record<string, string> = {
  discovery: 'Discovery',
  publication: 'Publication',
  interpretation: 'Interpretation',
  extinction: 'Extinction',
};
