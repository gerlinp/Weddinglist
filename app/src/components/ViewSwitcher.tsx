import type { Side } from '../types';

interface Props {
  sides: Side[];
  activeSideView: string;
  onSelectSide: (id: string) => void;
  onSelectCombined: () => void;
  onRenameSide: (id: string, name: string) => void;
}

const sideAccents = ['oklch(48% 0.18 264)', 'oklch(58% 0.16 45)'];

export function ViewSwitcher({ sides, activeSideView, onSelectSide, onSelectCombined, onRenameSide }: Props) {
  const isCombined = activeSideView === 'combined';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px 22px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
      <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'oklch(50% 0.015 80)' }}>Viewing</span>

      {sides.map((side, idx) => {
        const accent = sideAccents[idx % sideAccents.length];
        const isActive = activeSideView === side.id;
        return (
          <div
            key={side.id}
            onClick={() => onSelectSide(side.id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              background: isActive ? `${accent.replace(')', ' / 0.1)')}` : 'transparent',
              border: `1px solid ${isActive ? accent : 'oklch(82% 0.01 80)'}`,
              borderRadius: 20,
              padding: '6px 14px',
            }}
          >
            <input
              value={side.name}
              onChange={e => { e.stopPropagation(); onRenameSide(side.id, e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? accent : 'oklch(40% 0.015 80)',
                cursor: 'pointer',
                padding: '2px 0',
                width: Math.max(30, side.name.length * 8.5),
                fontFamily: "'Jost', sans-serif",
              }}
            />
          </div>
        );
      })}

      <div
        onClick={onSelectCombined}
        style={{
          cursor: 'pointer',
          background: isCombined ? 'oklch(94% 0.01 80)' : 'transparent',
          border: `1px solid ${isCombined ? 'oklch(70% 0.01 80)' : 'oklch(82% 0.01 80)'}`,
          color: isCombined ? 'oklch(30% 0.02 80)' : 'oklch(50% 0.015 80)',
          padding: '8px 16px',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Combined
      </div>
    </div>
  );
}
