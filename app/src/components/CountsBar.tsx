interface StatusCount {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface Props {
  total: number;
  adults: number;
  children: number;
  minors: number;
  filtersActive: boolean;
  statusColumns: StatusCount[];
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'oklch(50% 0.015 80)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

const divider = <div style={{ width: 1, height: 38, background: 'oklch(88% 0.01 80)' }} />;

export function CountsBar({ total, adults, children, minors, filtersActive, statusColumns }: Props) {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '26px 40px 6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 28 }}>
        <Stat value={total} label={`Total guests`} />
        {divider}
        <Stat value={adults} label="Adults" />
        {divider}
        <Stat value={children} label="Children" />
        {divider}
        <Stat value={minors} label="Under 21" />
        {filtersActive && (
          <div style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 13, color: 'oklch(48% 0.06 75)', background: 'oklch(94% 0.03 75)', padding: '6px 14px', borderRadius: 20 }}>
            Viewing a filtered scenario
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 16 }}>
        {statusColumns.map(sc => (
          <div key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'oklch(38% 0.02 80)' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: sc.color, display: 'inline-block' }} />
            {sc.name}: <strong>{sc.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
