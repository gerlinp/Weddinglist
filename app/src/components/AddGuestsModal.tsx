import type { Status, UIState } from '../types';

interface TagOption { id: string; name: string; }
interface SideOption { id: string; name: string; }

interface Props {
  statuses: Status[];
  tagOptions: TagOption[];
  sideOptions: SideOption[];
  ui: UIState;
  onClose: () => void;
  onSubmit: () => void;
  onUiChange: (patch: Partial<UIState>) => void;
}

export function AddGuestsModal({ statuses, tagOptions, sideOptions, ui, onClose, onSubmit, onUiChange }: Props) {
  const labelStyle: React.CSSProperties = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'oklch(50% 0.015 80)' };
  const selectStyle: React.CSSProperties = { width: '100%', margin: '6px 0 14px', padding: '9px 10px', borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, background: 'white', fontFamily: "'Jost', sans-serif" };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'oklch(20% 0.01 80 / 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'oklch(99.5% 0.003 80)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px oklch(20% 0.02 80 / 0.25)' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Add Guests</div>

        <label style={labelStyle}>Add to group</label>
        <select value={ui.pasteTargetStatusId} onChange={e => onUiChange({ pasteTargetStatusId: e.target.value })} style={selectStyle}>
          {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label style={labelStyle}>Family tag (optional)</label>
        <select value={ui.pasteTargetTagId} onChange={e => onUiChange({ pasteTargetTagId: e.target.value })} style={selectStyle}>
          {tagOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>

        <label style={labelStyle}>Side</label>
        <select value={ui.pasteTargetSideId} onChange={e => onUiChange({ pasteTargetSideId: e.target.value })} style={selectStyle}>
          {sideOptions.map(sd => <option key={sd.id} value={sd.id}>{sd.name}</option>)}
        </select>

        <label style={labelStyle}>Names — one per line</label>
        <textarea
          value={ui.pasteText}
          onChange={e => onUiChange({ pasteText: e.target.value })}
          placeholder={"Jane Smith\nJohn Smith\nLittle Timmy Smith"}
          rows={8}
          style={{ width: '100%', margin: '6px 0 12px', padding: 10, borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, resize: 'vertical', fontFamily: "'Jost', sans-serif" }}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 14, color: 'oklch(32% 0.02 80)', cursor: 'pointer' }}>
          <input type="checkbox" checked={ui.pasteWithPlusOne} onChange={e => onUiChange({ pasteWithPlusOne: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'oklch(48% 0.18 264)' }} />
          Give each guest a +1
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid oklch(82% 0.01 80)', color: 'oklch(40% 0.02 80)', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: "'Jost', sans-serif" }}>Cancel</button>
          <button onClick={onSubmit} style={{ background: 'oklch(48% 0.18 264)', color: 'oklch(98% 0.005 80)', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Jost', sans-serif" }}>Add Guests</button>
        </div>
      </div>
    </div>
  );
}
