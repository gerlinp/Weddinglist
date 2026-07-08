import type { Status, UIState } from '../types';

interface SideOption { id: string; name: string; }

interface Props {
  statuses: Status[];
  sideOptions: SideOption[];
  ui: UIState;
  palette: string[];
  onClose: () => void;
  onSubmit: () => void;
  onUiChange: (patch: Partial<UIState>) => void;
}

export function AddFamilyModal({ statuses, sideOptions, ui, palette, onClose, onSubmit, onUiChange }: Props) {
  const labelStyle: React.CSSProperties = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'oklch(50% 0.015 80)' };
  const inputStyle: React.CSSProperties = { width: '100%', margin: '6px 0 14px', padding: '9px 10px', borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, fontFamily: "'Jost', sans-serif" };
  const selectStyle: React.CSSProperties = { width: '100%', marginTop: 6, padding: '9px 10px', borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, background: 'white', fontFamily: "'Jost', sans-serif" };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'oklch(20% 0.01 80 / 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'oklch(99.5% 0.003 80)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px oklch(20% 0.02 80 / 0.25)' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Add Family</div>

        <label style={labelStyle}>Family name</label>
        <input value={ui.familyName} onChange={e => onUiChange({ familyName: e.target.value })} placeholder="e.g. Smith Family" style={inputStyle} />

        <label style={labelStyle}>Color</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '8px 0 16px' }}>
          {palette.map(color => (
            <button
              key={color}
              onClick={() => onUiChange({ familyColor: color })}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: color, cursor: 'pointer',
                border: ui.familyColor === color ? '3px solid oklch(24% 0.02 80)' : '2px solid transparent',
                outline: ui.familyColor === color ? '2px solid oklch(85% 0.01 80)' : 'none',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Group</label>
            <select value={ui.familyStatusId} onChange={e => onUiChange({ familyStatusId: e.target.value })} style={selectStyle}>
              {statuses.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Side</label>
            <select value={ui.familySideId} onChange={e => onUiChange({ familySideId: e.target.value })} style={selectStyle}>
              {sideOptions.map(sd => <option key={sd.id} value={sd.id}>{sd.name}</option>)}
            </select>
          </div>
        </div>

        <label style={labelStyle}>Adult 1 (optional)</label>
        <input value={ui.familyAdult1} onChange={e => onUiChange({ familyAdult1: e.target.value })} placeholder="e.g. Jane Smith" style={inputStyle} />

        <label style={labelStyle}>Significant other (optional)</label>
        <input value={ui.familyAdult2} onChange={e => onUiChange({ familyAdult2: e.target.value })} placeholder="e.g. John Smith" style={inputStyle} />

        <label style={labelStyle}>Children</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '6px 0 10px' }}>
          {ui.familyChildren.map((child, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={child}
                onChange={e => {
                  const next = [...ui.familyChildren];
                  next[idx] = e.target.value;
                  onUiChange({ familyChildren: next });
                }}
                placeholder="Child's name"
                style={{ flex: 1, padding: '9px 10px', borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, fontFamily: "'Jost', sans-serif" }}
              />
              <button
                onClick={() => onUiChange({ familyChildren: ui.familyChildren.filter((_, i) => i !== idx) })}
                style={{ background: 'transparent', border: 'none', color: 'oklch(60% 0.02 80)', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => onUiChange({ familyChildren: [...ui.familyChildren, ''] })}
          style={{ background: 'transparent', border: '1px dashed oklch(75% 0.01 80)', color: 'oklch(50% 0.015 80)', padding: '7px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', marginBottom: 18, fontFamily: "'Jost', sans-serif" }}
        >
          + Add Child
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid oklch(82% 0.01 80)', color: 'oklch(40% 0.02 80)', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: "'Jost', sans-serif" }}>Cancel</button>
          <button onClick={onSubmit} style={{ background: 'oklch(48% 0.18 264)', color: 'oklch(98% 0.005 80)', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Jost', sans-serif" }}>Create Family</button>
        </div>
      </div>
    </div>
  );
}
