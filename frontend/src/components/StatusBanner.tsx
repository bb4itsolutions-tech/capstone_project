interface Props {
  message: string;
  onRetry?: () => void;
}

export function StatusBanner({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: 'var(--put-dim)',
        border: '1px solid var(--put)',
        color: '#ffd8d3',
        borderRadius: 'var(--radius)',
        padding: '12px 18px',
        fontSize: 13,
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'var(--put)',
            color: '#2a0f0c',
            border: 'none',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
