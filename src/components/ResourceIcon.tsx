import type { ResourceId } from '../game/types';

type Props = {
  resource: ResourceId;
  size?: 'tiny' | 'small';
};

export function ResourceIcon({ resource, size = 'small' }: Props) {
  return <span className={`material-icon material-${resource.toLowerCase()} is-${size}`} aria-hidden="true" />;
}
