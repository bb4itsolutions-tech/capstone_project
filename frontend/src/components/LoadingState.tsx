export function LoadingState({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: '80px 20px',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--brand)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 13 }}>{label}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
