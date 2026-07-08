interface Props {
  title: string;
  subtitle: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubtitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function Header({ title, subtitle, onTitleChange, onSubtitleChange, onSignOut, userEmail }: Props) {
  return (
    <div style={{ padding: '44px 40px 28px', maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
      <input
        value={title}
        onChange={onTitleChange}
        placeholder="Our Wedding Guest List"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 44,
          fontWeight: 600,
          color: 'oklch(22% 0.02 80)',
          border: 'none',
          background: 'transparent',
          outline: 'none',
          width: '100%',
          padding: 0,
        }}
      />
      <input
        value={subtitle}
        onChange={onSubtitleChange}
        placeholder="e.g. Sarah & James — October 10, 2026"
        style={{
          fontSize: 16,
          color: 'oklch(48% 0.015 80)',
          border: 'none',
          background: 'transparent',
          outline: 'none',
          width: '100%',
          padding: '4px 0 0',
          fontStyle: 'italic',
          fontFamily: "'Jost', sans-serif",
        }}
      />

      <div style={{ position: 'absolute', top: 44, right: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        {userEmail && (
          <span style={{ fontSize: 13, color: 'oklch(55% 0.015 80)' }}>{userEmail}</span>
        )}
        <button
          onClick={onSignOut}
          style={{
            fontSize: 13,
            fontFamily: "'Jost', sans-serif",
            color: 'oklch(48% 0.015 80)',
            background: 'transparent',
            border: '1px solid oklch(82% 0.01 80)',
            borderRadius: 7,
            padding: '5px 12px',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'oklch(94% 0.006 80)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
