import logo from '../assets/logo.svg'
export default function Home({ setCurrentView }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontFamily: '"Arial", "Helvetica", sans-serif',
        }}>
            {/* Main Card */}
            <div style={{
                maxWidth: '700px',
                backgroundColor: '#FFFFFF',
                borderRadius: '0px',
                padding: '60px 40px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                textAlign: 'center',
                border: '4px solid #FFD700',
            }}>
                {/* Logo Section */}
                <div style={{
                    marginBottom: '30px',
                }}>
                    <img src={logo} alt="Tour Poule logo"
                         style={{
                             width: '120px',
                             height: '120px',
                             marginBottom: '15px',
                         }}
                    />
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        margin: '0 0 10px 0',
                        color: '#FFD700',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}>
                        TOUR POULE
                    </h1>
                    <div style={{
                        height: '4px',
                        background: '#EF3340',
                        width: '100px',
                        margin: '15px auto',
                    }} />
                </div>
                {/* Subtitle */}
                <p style={{
                    fontSize: '18px',
                    color: '#333',
                    marginBottom: '10px',
                    fontWeight: '300',
                    letterSpacing: '1px',
                }}>
                    FAMILIE DE LEEUW WIELERPOULE
                </p>
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '50px',
                    fontWeight: '300',
                }}>
                    Tour de France 2026
                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    {/* Button 1 - Yellow */}
                    <button
                        onClick={() => setCurrentView('submit')}
                        style={{
                            padding: '20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            backgroundColor: '#FFD700',
                            color: '#000',
                            border: 'none',
                            borderRadius: '0px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#FFC700';
                            e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFD700';
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        VUL JE TOP 10 IN
                    </button>

                    {/* Button 2 - Red */}
                    <button
                        onClick={() => setCurrentView('standings')}
                        style={{
                            padding: '20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            backgroundColor: '#EF3340',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '0px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(239, 51, 64, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#D62E3A';
                            e.target.style.boxShadow = '0 6px 20px rgba(239, 51, 64, 0.4)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#EF3340';
                            e.target.style.boxShadow = '0 4px 15px rgba(239, 51, 64, 0.3)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        BEKIJK KLASSEMENT
                    </button>

                    {/* Button 3 - Black */}
                    <button
                        onClick={() => setCurrentView('admin')}
                        style={{
                            padding: '20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            backgroundColor: '#1a1a1a',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '0px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#000';
                            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1a1a1a';
                            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        BEHEERDERSPANEEL
                    </button>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '50px',
                    paddingTop: '30px',
                    borderTop: '2px solid #FFD700',
                    fontSize: '12px',
                    color: '#999',
                    letterSpacing: '0.5px',
                }}>
                    <p style={{ margin: 0 }}>
                        🚴 LE GRAND BOUCLE 2025 🚴
                    </p>
                    <p style={{ margin: '8px 0 0 0' }}>
                        © 2026 Familie de Leeuw — Alle rechten voorbehouden
                    </p>
                </div>
            </div>

            {/* Decorative bottom element */}
            <div style={{
                marginTop: '60px',
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
                maxWidth: '600px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
            }}>
            </div>
        </div>
    );
}
