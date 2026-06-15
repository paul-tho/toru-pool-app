import { useState } from 'react';
import { RIDERS_2025 } from '../data/riders';

export default function RiderSelect({ value, onChange, label }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = RIDERS_2025.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        !value
    );

    return (
        <div style={{ marginBottom: '10px' }}>
            <label>{label}</label>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 100)}
                placeholder="Search rider..."
                style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            {open && filtered.length > 0 && (
                <div style={{
                    border: '1px solid #ccc',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    position: 'absolute',
                    width: '100%',
                    zIndex: 10,
                    backgroundColor: '#fff',
                }}>
                    {filtered.map(rider => (
                        <div
                            key={rider.id}
                            onClick={() => {
                                onChange(rider.id);
                                setSearch('');
                                setOpen(false);
                            }}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee',
                            }}
                        >
                            {rider.name}
                        </div>
                    ))}
                </div>
            )}
            {value && <div style={{ marginTop: '4px', color: '#666' }}>✓ Selected</div>}
        </div>
    );
}