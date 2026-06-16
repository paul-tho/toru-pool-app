export default function Background() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
        }}>
            {/* Main background - Official Tour Yellow */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9E6 30%, #FFE680 100%)',
            }} />

            {/* SVG Pattern - Mountain silhouettes */}
            <svg
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '400px',
                    opacity: 0.08,
                }}
                viewBox="0 0 1200 400"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Mountains */}
                <polygon points="0,400 150,200 300,400" fill="#000" />
                <polygon points="250,400 400,150 550,400" fill="#000" />
                <polygon points="500,400 700,100 900,400" fill="#000" />
                <polygon points="850,400 1050,180 1200,400" fill="#000" />
            </svg>

            {/* Animated cycling elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '-100px',
                fontSize: '120px',
                opacity: 0.05,
                animation: 'slideBike 40s linear infinite',
            }}>
                🚴
            </div>

            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '-100px',
                fontSize: '100px',
                opacity: 0.05,
                animation: 'slideBikeReverse 45s linear infinite',
            }}>
                🏆
            </div>

            {/* Jersey colored accents */}
            <div style={{
                position: 'absolute',
                top: '5%',
                right: '5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '5%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(239, 51, 64, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Gradient overlay - subtle */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.3) 100%)',
                pointerEvents: 'none',
            }} />

            {/* CSS Animations */}
            <style>{`
        @keyframes slideBike {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes slideBikeReverse {
          0% {
            transform: translateX(100px);
          }
          100% {
            transform: translateX(calc(-100vw - 100px));
          }
        }
      `}</style>
        </div>
    );
}
