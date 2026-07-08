interface TagOption {
  id: string;
  name: string;
}

interface SideOption {
  id: string;
  name: string;
}

export interface PersonVM {
  id: string;
  name: string;
  tagId: string;
  sideId: string;
  showSideDot: boolean;
  sideDotColor: string;
  isPlusOne: boolean;
  hasPlusOne: boolean;
  showPlusOneToggle: boolean;
  isChild: boolean;
  isMinor: boolean;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleChild: () => void;
  onToggleMinor: () => void;
  onTogglePlusOne: () => void;
  onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDelete: () => void;
  tagSelectBg: string;
  tagSelectBorder: string;
  childBg: string;
  childBorder: string;
  childColor: string;
  minorBg: string;
  minorBorder: string;
  minorColor: string;
}

interface Props {
  person: PersonVM;
  tagOptions: TagOption[];
  sideOptions: SideOption[];
  onClearDrag: () => void;
}

export function GuestRow({ person: p, tagOptions, sideOptions, onClearDrag }: Props) {
  return (
    <div
      draggable
      onDragStart={p.onDragStart}
      onDragEnd={onClearDrag}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 8px', borderRadius: 7, cursor: 'grab' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'oklch(96% 0.008 80)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ color: 'oklch(75% 0.01 80)', fontSize: 12, flexShrink: 0 }}>⠿</span>

      {p.isPlusOne && (
        <span style={{ fontSize: 10, fontWeight: 600, color: 'oklch(45% 0.02 80)', background: 'oklch(90% 0.008 80)', padding: '2px 6px', borderRadius: 10, flexShrink: 0 }}>+1</span>
      )}

      {p.showSideDot && (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.sideDotColor, display: 'inline-block', flexShrink: 0 }} />
      )}

      <input
        value={p.name}
        onChange={p.onNameChange}
        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'oklch(26% 0.02 80)', flex: 1, minWidth: 60, padding: '2px 0', fontFamily: "'Jost', sans-serif" }}
      />

      {p.isChild && (
        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 14, background: p.childBg, border: `1px solid ${p.childBorder}`, color: p.childColor, flexShrink: 0 }}>Child</span>
      )}
      {p.isMinor && (
        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 14, background: p.minorBg, border: `1px solid ${p.minorBorder}`, color: p.minorColor, flexShrink: 0 }}>U21</span>
      )}
      {p.hasPlusOne && (
        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 14, background: 'oklch(90% 0.02 300 / 0.4)', border: '1px solid oklch(55% 0.05 300)', color: 'oklch(38% 0.05 300)', flexShrink: 0 }}>+1</span>
      )}

      <button
        onClick={p.onToggleMenu}
        style={{ fontSize: 11, padding: '3px 8px', borderRadius: 14, cursor: 'pointer', background: 'transparent', border: '1px solid oklch(85% 0.01 80)', color: 'oklch(50% 0.015 80)', flexShrink: 0, fontFamily: "'Jost', sans-serif" }}
      >
        Details ▾
      </button>

      <select
        value={p.tagId}
        onChange={p.onTagChange}
        style={{ fontSize: 13, fontWeight: 600, border: `1.5px solid ${p.tagSelectBorder}`, borderRadius: 8, background: p.tagSelectBg, color: 'oklch(28% 0.02 80)', padding: '4px 6px', maxWidth: 100, flexShrink: 0, fontFamily: "'Jost', sans-serif" }}
      >
        {tagOptions.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>

      <button
        onClick={p.onDelete}
        style={{ background: 'transparent', border: 'none', color: 'oklch(65% 0.02 80)', fontSize: 15, cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}
      >
        ×
      </button>

      {p.isMenuOpen && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: '100%', right: 8, marginTop: 4,
            background: 'oklch(99.5% 0.003 80)', border: '1px solid oklch(88% 0.008 80)',
            borderRadius: 10, boxShadow: '0 10px 28px oklch(20% 0.02 80 / 0.18)',
            zIndex: 40, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 170,
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(32% 0.02 80)', cursor: 'pointer' }}>
            <input type="checkbox" checked={p.isChild} onChange={p.onToggleChild} style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'oklch(50% 0.16 45)' }} />
            Child
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(32% 0.02 80)', cursor: 'pointer' }}>
            <input type="checkbox" checked={p.isMinor} onChange={p.onToggleMinor} style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'oklch(48% 0.18 264)' }} />
            Under 21
          </label>
          {p.showPlusOneToggle && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(32% 0.02 80)', cursor: 'pointer' }}>
              <input type="checkbox" checked={p.hasPlusOne} onChange={p.onTogglePlusOne} style={{ width: 14, height: 14, cursor: 'pointer', accentColor: 'oklch(55% 0.05 300)' }} />
              +1 (plus one)
            </label>
          )}
          <div style={{ borderTop: '1px solid oklch(92% 0.008 80)', marginTop: 2, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'oklch(55% 0.015 80)' }}>Side</span>
            <select
              value={p.sideId}
              onChange={p.onSideChange}
              style={{ fontSize: 13, padding: '5px 6px', borderRadius: 6, border: '1px solid oklch(85% 0.01 80)', fontFamily: "'Jost', sans-serif" }}
            >
              {sideOptions.map(sd => (
                <option key={sd.id} value={sd.id}>{sd.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
