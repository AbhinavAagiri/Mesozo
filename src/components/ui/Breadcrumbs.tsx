import { Link } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type Props = {
  items: BreadcrumbItem[];
  tone?: 'light' | 'dark';
  className?: string;
};

/**
 * The shared route trail for deep pages. The final item is always the current
 * page and is not a link.
 */
export function Breadcrumbs({ items, tone = 'light', className = '' }: Props) {
  if (!items.length) return null;

  return (
    <nav
      className={`breadcrumbs breadcrumbs--${tone} ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {current || !item.to ? (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to} data-cursor="link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
