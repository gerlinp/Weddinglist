import type { RefObject } from 'react';
import type { Tag, UIState } from '../types';
import { tint } from '../utils';

interface Props {
  tags: Tag[];
  ui: UIState;
  filtersActive: boolean;
  onOpenAddModal: () => void;
  onAddStatus: () => void;
  onOpenNewTagModal: () => void;
  onOpenFamilyModal: () => void;
  onEditTag: (tag: Tag) => void;
  onToggleExportMenu: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onTriggerImport: () => void;
  onToggleFilters: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Toolbar({
  tags, ui, filtersActive,
  onOpenAddModal, onAddStatus, onOpenNewTagModal, onOpenFamilyModal, onEditTag,
  onToggleExportMenu, onExportJSON, onExportCSV, onTriggerImport, onToggleFilters,
  fileInputRef, onImportFile,
}: Props) {
  return (
    <div style={{ background: 'oklch(99.5% 0.004 80)', borderTop: '1px solid oklch(90% 0.01 80)', borderBottom: '1px solid oklch(90% 0.01 80)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>

        <button
          onClick={onOpenAddModal}
          style={{ background: 'oklch(48% 0.18 264)', color: 'oklch(98% 0.005 80)', border: 'none', padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
        >
          + Add Guests
        </button>
        <button
          onClick={onAddStatus}
          style={{ background: 'transparent', color: 'oklch(45% 0.16 45)', border: '1px solid oklch(75% 0.1 45)', padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
        >
          + New Group
        </button>

        <div style={{ width: 1, height: 26, background: 'oklch(88% 0.01 80)', margin: '0 4px' }} />

        <span style={{ fontSize: 13, color: 'oklch(52% 0.015 80)', letterSpacing: '0.02em' }}>Family tags:</span>

        {tags.map(t => (
          <button
            key={t.id}
            onClick={e => { e.stopPropagation(); onEditTag(t); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: tint(t.color, 0.38),
              border: `1.5px solid ${t.color}`,
              padding: '7px 18px',
              borderRadius: 20,
              fontSize: 16,
              fontWeight: 700,
              color: 'oklch(24% 0.03 80)',
              cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}
          >
            {t.name}
          </button>
        ))}

        <button
          onClick={e => { e.stopPropagation(); onOpenNewTagModal(); }}
          style={{ background: 'transparent', border: '1px dashed oklch(75% 0.01 80)', color: 'oklch(50% 0.015 80)', padding: '5px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
        >
          + New Tag
        </button>
        <button
          onClick={e => { e.stopPropagation(); onOpenFamilyModal(); }}
          style={{ background: 'transparent', border: '1px solid oklch(75% 0.1 45)', color: 'oklch(45% 0.16 45)', padding: '5px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
        >
          + Add Family
        </button>

        <div style={{ width: 1, height: 26, background: 'oklch(88% 0.01 80)', margin: '0 4px' }} />

        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); onToggleExportMenu(); }}
            style={{ background: 'transparent', color: 'oklch(35% 0.02 80)', border: '1px solid oklch(80% 0.01 80)', padding: '10px 16px', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
          >
            Export ▾
          </button>
          {ui.showExportMenu && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ position: 'absolute', top: '110%', left: 0, background: 'oklch(99.5% 0.003 80)', border: '1px solid oklch(88% 0.008 80)', borderRadius: 8, boxShadow: '0 10px 28px oklch(20% 0.02 80 / 0.18)', zIndex: 50, minWidth: 210, overflow: 'hidden' }}
            >
              <button
                onClick={onExportJSON}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', background: 'transparent', border: 'none', fontSize: 14, cursor: 'pointer', color: 'oklch(30% 0.02 80)', fontFamily: "'Jost', sans-serif" }}
              >
                Backup (.json)
              </button>
              <button
                onClick={onExportCSV}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', background: 'transparent', border: 'none', borderTop: '1px solid oklch(92% 0.008 80)', fontSize: 14, cursor: 'pointer', color: 'oklch(30% 0.02 80)', fontFamily: "'Jost', sans-serif" }}
              >
                Spreadsheet (.csv)
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onTriggerImport}
          style={{ background: 'transparent', color: 'oklch(35% 0.02 80)', border: '1px solid oklch(80% 0.01 80)', padding: '10px 16px', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
        >
          Import
        </button>
        <input type="file" accept="application/json,.json" ref={fileInputRef} onChange={onImportFile} style={{ display: 'none' }} />

        <div style={{ flex: 1 }} />

        <button
          onClick={e => { e.stopPropagation(); onToggleFilters(); }}
          style={{
            background: filtersActive ? 'oklch(94% 0.03 75)' : 'transparent',
            color: filtersActive ? 'oklch(40% 0.06 75)' : 'oklch(40% 0.02 80)',
            border: '1px solid oklch(80% 0.01 80)',
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: "'Jost', sans-serif",
          }}
        >
          Filters{filtersActive ? ' •' : ''}
        </button>
      </div>
    </div>
  );
}
