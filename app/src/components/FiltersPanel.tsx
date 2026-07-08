import { tint } from '../utils';

interface FilterChip {
  id: string;
  name: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}

interface Props {
  statusFilterChips: FilterChip[];
  tagFilterChips: FilterChip[];
  onlyChildren: boolean;
  onlyMinors: boolean;
  onToggleOnlyChildren: () => void;
  onToggleOnlyMinors: () => void;
  onResetFilters: () => void;
}

export function FiltersPanel({
  statusFilterChips, tagFilterChips, onlyChildren, onlyMinors,
  onToggleOnlyChildren, onToggleOnlyMinors, onResetFilters,
}: Props) {
  return (
    <div style={{ background: 'oklch(97% 0.012 75)', borderBottom: '1px solid oklch(90% 0.01 80)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '18px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'oklch(50% 0.015 80)', width: 90 }}>Groups</span>
          {statusFilterChips.map(c => (
            <button
              key={c.id}
              onClick={c.onToggle}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: c.active ? tint(c.color, 0.12) : 'transparent',
                border: `1px solid ${c.color}`,
                padding: '5px 12px', borderRadius: 20, fontSize: 13,
                color: 'oklch(28% 0.02 80)', cursor: 'pointer',
                opacity: c.active ? 1 : 0.4,
                fontFamily: "'Jost', sans-serif",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'oklch(50% 0.015 80)', width: 90 }}>Families</span>
          {tagFilterChips.map(c => (
            <button
              key={c.id}
              onClick={c.onToggle}
              style={{
                display: 'flex', alignItems: 'center',
                background: c.active ? tint(c.color, 0.38) : 'transparent',
                border: `1.5px solid ${c.color}`,
                padding: '6px 16px', borderRadius: 20, fontSize: 15, fontWeight: 600,
                color: 'oklch(24% 0.03 80)', cursor: 'pointer',
                opacity: c.active ? 1 : 0.4,
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'oklch(50% 0.015 80)', width: 90 }}>Isolate</span>
          <button
            onClick={onToggleOnlyChildren}
            style={{
              background: onlyChildren ? 'oklch(70% 0.15 45 / 0.3)' : 'transparent',
              border: '1px solid oklch(50% 0.16 45)',
              padding: '5px 14px', borderRadius: 20, fontSize: 13,
              color: 'oklch(28% 0.02 80)', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}
          >
            Children only
          </button>
          <button
            onClick={onToggleOnlyMinors}
            style={{
              background: onlyMinors ? 'oklch(68% 0.16 264 / 0.3)' : 'transparent',
              border: '1px solid oklch(48% 0.18 264)',
              padding: '5px 14px', borderRadius: 20, fontSize: 13,
              color: 'oklch(28% 0.02 80)', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}
          >
            Under-21 only
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onResetFilters}
            style={{ background: 'transparent', border: 'none', color: 'oklch(45% 0.02 80)', fontSize: 13, textDecoration: 'underline', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
          >
            Reset filters
          </button>
        </div>

      </div>
    </div>
  );
}
