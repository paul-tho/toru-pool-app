export default function Home({ setCurrentView }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
            padding: '20px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}>
                <h1 style={{ fontSize: '40px', marginBottom: '10px', color: '#FFD700' }}>
                    🚴 TOUR POULE
                </h1>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                    Family Fantasy League - Tour de France 2025
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => setCurrentView('submit')}
                        style={{
                            padding: '16px',
                            fontSize: '16px',
                            backgroundColor: '#FFD700',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#000',
                        }}
                    >
                        📝 Submit Your Top 10
                    </button>

                    <button
                        onClick={() => setCurrentView('standings')}
                        style={{
                            padding: '16px',
                            fontSize: '16px',
                            backgroundColor: '#FF6B6B',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#fff',
                        }}
                    >
                        🏆 View Standings
                    </button>

                    <button
                        onClick={() => setCurrentView('admin')}
                        style={{
                            padding: '16px',
                            fontSize: '16px',
                            backgroundColor: '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#fff',
                        }}
                    >
                        ⚙️ Admin Panel
                    </button>
                </div>
            </div>
        </div>
    );
}