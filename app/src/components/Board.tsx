import { GuestRow } from './GuestRow';
import type { PersonVM } from './GuestRow';

interface TagOption { id: string; name: string; }
interface SideOption { id: string; name: string; }

interface Group {
  key: string;
  isTagGroup: boolean;
  isLoose: boolean;
  tagId?: string;
  tagName?: string;
  tagColor?: string;
  tintBg?: string;
  memberCount?: number;
  members: PersonVM[];
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

interface StatusColumn {
  id: string;
  name: string;
  color: string;
  count: number;
  isEmpty: boolean;
  canDelete: boolean;
  groups: Group[];
  bodyBg: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

interface Props {
  statusColumns: StatusColumn[];
  tagOptions: TagOption[];
  sideOptions: SideOption[];
  isEmpty: boolean;
  onAddStatus: () => void;
  onClearDrag: () => void;
}

export function Board({ statusColumns, tagOptions, sideOptions, isEmpty, onAddStatus, onClearDrag }: Props) {
  return (
    <>
      {isEmpty && (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '10px 40px 0' }}>
          <div style={{ border: '1px dashed oklch(82% 0.01 80)', borderRadius: 12, padding: 36, textAlign: 'center', color: 'oklch(52% 0.015 80)', fontSize: 15 }}>
            No guests yet. Click <strong>+ Add Guests</strong> above to paste in your list.
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 40px 60px', display: 'flex', gap: 22, overflowX: 'auto', alignItems: 'flex-start' }}>
        {statusColumns.map(col => (
          <div key={col.id} style={{ flex: '1 1 300px', minWidth: 290, background: 'oklch(99.5% 0.003 80)', border: '1px solid oklch(91% 0.008 80)', borderRadius: 12 }}>
            <div style={{ height: 4, background: col.color, borderRadius: '12px 12px 0 0' }} />
            <div style={{ padding: '14px 16px', borderBottom: '1px solid oklch(92% 0.008 80)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color, display: 'inline-block', flexShrink: 0 }} />
              <input
                value={col.name}
                onChange={col.onNameChange}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 16, fontWeight: 600, color: 'oklch(24% 0.02 80)', flex: 1, minWidth: 0, padding: '2px 0', fontFamily: "'Jost', sans-serif" }}
              />
              <span style={{ background: 'oklch(94% 0.01 80)', color: 'oklch(40% 0.02 80)', fontSize: 12, padding: '2px 9px', borderRadius: 12, flexShrink: 0 }}>{col.count}</span>
              {col.canDelete && (
                <button onClick={col.onDelete} style={{ background: 'transparent', border: 'none', color: 'oklch(60% 0.02 80)', fontSize: 16, cursor: 'pointer', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}>×</button>
              )}
            </div>

            <div
              onDragOver={col.onDragOver}
              onDrop={col.onDrop}
              style={{ minHeight: 140, padding: 10, display: 'flex', flexDirection: 'column', gap: 4, background: col.bodyBg, transition: 'background 0.15s' }}
            >
              {col.isEmpty && (
                <div style={{ textAlign: 'center', color: 'oklch(65% 0.01 80)', fontSize: 13, fontStyle: 'italic', padding: '24px 8px' }}>No guests here</div>
              )}

              {col.groups.map(grp => (
                <div key={grp.key}>
                  {grp.isTagGroup && (
                    <div
                      draggable
                      onDragStart={grp.onDragStart}
                      onDragEnd={onClearDrag}
                      onDragOver={grp.onDragOver}
                      onDrop={grp.onDrop}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${grp.tagColor}`, background: grp.tintBg, marginTop: 10, cursor: 'grab' }}
                    >
                      <span style={{ color: 'oklch(50% 0.02 80)', fontSize: 12 }}>⠿</span>
                      <span style={{ fontSize: 17, fontWeight: 700, color: 'oklch(22% 0.03 80)', flex: 1 }}>{grp.tagName}</span>
                      <span style={{ fontSize: 12, color: 'oklch(40% 0.02 80)' }}>{grp.memberCount}</span>
                    </div>
                  )}

                  {grp.isLoose && (
                    <div style={{ padding: '7px 9px', marginTop: 10, fontSize: 12, fontStyle: 'italic', color: 'oklch(60% 0.01 80)' }}>No family tag</div>
                  )}

                  {grp.members.map(p => (
                    <GuestRow
                      key={p.id}
                      person={p}
                      tagOptions={tagOptions}
                      sideOptions={sideOptions}
                      onClearDrag={onClearDrag}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
          <button
            onClick={onAddStatus}
            style={{ background: 'transparent', border: '1px dashed oklch(80% 0.01 80)', color: 'oklch(50% 0.015 80)', padding: '12px 20px', borderRadius: 10, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Jost', sans-serif" }}
          >
            + Add Group
          </button>
        </div>
      </div>
    </>
  );
}
