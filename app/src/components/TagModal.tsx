import type { UIState } from '../types';

interface Props {
  ui: UIState;
  palette: string[];
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onUiChange: (patch: Partial<UIState>) => void;
}

export function TagModal({ ui, palette, onClose, onSave, onDelete, onUiChange }: Props) {
  const isEditing = !!ui.editingTagId;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'oklch(20% 0.01 80 / 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'oklch(99.5% 0.003 80)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px oklch(20% 0.02 80 / 0.25)' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
          {isEditing ? 'Edit Tag' : 'New Tag'}
        </div>

        <label style={{ fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'oklch(50% 0.015 80)' }}>Tag name</label>
        <input
          value={ui.newTagName}
          onChange={e => onUiChange({ newTagName: e.target.value })}
          placeholder="e.g. College Friends"
          autoFocus
          style={{ width: '100%', margin: '6px 0 16px', padding: '9px 10px', borderRadius: 8, border: '1px solid oklch(85% 0.01 80)', fontSize: 14, fontFamily: "'Jost', sans-serif" }}
        />

        <label style={{ fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'oklch(50% 0.015 80)' }}>Color</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '8px 0 20px' }}>
          {palette.map(color => (
            <button
              key={color}
              onClick={() => onUiChange({ newTagColor: color })}
              style={{
                width: 30, height: 30, borderRadius: '50%', background: color, cursor: 'pointer',
                border: ui.newTagColor === color ? '3px solid oklch(24% 0.02 80)' : '2px solid transparent',
                outline: ui.newTagColor === color ? '2px solid oklch(85% 0.01 80)' : 'none',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          {isEditing && (
            <button
              onClick={onDelete}
              style={{ background: 'transparent', border: '1px solid oklch(70% 0.08 25)', color: 'oklch(45% 0.1 25)', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: "'Jost', sans-serif" }}
            >
              Delete
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid oklch(82% 0.01 80)', color: 'oklch(40% 0.02 80)', padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: "'Jost', sans-serif" }}>Cancel</button>
          <button onClick={onSave} style={{ background: 'oklch(48% 0.18 264)', color: 'oklch(98% 0.005 80)', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: "'Jost', sans-serif" }}>Save</button>
        </div>
      </div>
    </div>
  );
}
