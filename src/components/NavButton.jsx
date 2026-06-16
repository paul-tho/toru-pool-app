export default function NavButton({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                marginBottom: '20px',
                backgroundColor: '#fff',
                color: '#1a1a1a',
                border: '2px solid #1a1a1a',
                borderRadius: '0px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#1a1a1a';
            }}
        >
            {children}
        </button>
    );
}
