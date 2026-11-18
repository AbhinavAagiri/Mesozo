import { Link } from 'react-router-dom';
import type { NavItem } from '../../data/nav';

type Props = {
  destination: NavItem;
  current?: string;
  tone?: 'light' | 'dark';
};

/**
 * The second level of the information architecture. Hubs use it instead of a
 * mega-menu; the four primary destinations remain the only global headings.
 */
export function DestinationNav({ destination, current, tone = 'light' }: Props) {
  return (
    <nav
      className={`destination-nav destination-nav--${tone}`}
      aria-label={`${destination.label} sections`}
    >
      <span className="destination-nav__parent">
        <span className="mono">{destination.index}</span>
        <span>{destination.label}</span>
      </span>
      <div className="destination-nav__links">
        {destination.children.map((child) => {
          const active = current === child.to;
          return (
            <Link
              key={child.to}
              to={child.to}
              className={`destination-nav__link${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              data-cursor="link"
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
