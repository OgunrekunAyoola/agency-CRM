interface SkeletonRowProps {
  /** Number of skeleton rows to render */
  rows?: number;
  /** Number of columns in each row */
  cols?: number;
}

/**
 * Reusable table/list skeleton loader.
 * 
 * Usage inside a <TableBody>:
 *   <SkeletonRow rows={5} cols={4} />
 * 
 * Or as a standalone block:
 *   <SkeletonRow rows={3} />
 */
export function SkeletonRow({ rows = 3, cols = 4 }: SkeletonRowProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse" aria-hidden="true">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <div
                className="h-4 bg-muted rounded"
                style={{ width: colIdx === 0 ? '60%' : `${40 + (colIdx * 10) % 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Block-level skeleton for non-table contexts (cards, lists).
 */
export function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded"
          style={{ width: i === 0 ? '75%' : i % 2 === 0 ? '55%' : '90%' }}
        />
      ))}
    </div>
  );
}
