type Props = {
  className?: string;
};

/**
 * MESOZO brand mark: a low Spinosaurus dorsal sail with three spine cuts.
 * The counters are transparent, so the mark picks up ink on chalk and chalk on ink.
 */
export function SailMark({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 53C8 41 14 29 24 21C31 16 39 13 45 15C51 18 56 31 59 43C60 47 60 50 60 53C41 54 21 54 4 53ZM18 30L20 51H24L23 27ZM29 22L31 51H35L34 20ZM40 19L42 51H46L45 18Z"
      />
    </svg>
  );
}
