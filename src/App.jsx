import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Home from './components/Home';
import SubmitForm from './components/SubmitForm';
import Standings from './components/Standings';
import AdminPanel from './components/AdminPanel';
import Background from "./assets/background.jsx";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
    const [currentView, setCurrentView] = useState('home');
    const [participants, setParticipants] = useState([]);
    const [dailyResults, setDailyResults] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [partsRes, resultsRes] = await Promise.all([
                supabase.from('participants').select('*'),
                supabase.from('daily_results').select('*'),
            ]);
            if (partsRes.data) setParticipants(partsRes.data);
            if (resultsRes.data) setDailyResults(resultsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    return (
        <div>
            <Background />

            {currentView === 'home' && (
                <Home setCurrentView={setCurrentView} />
            )}
            {currentView === 'submit' && (
                <SubmitForm
                    setCurrentView={setCurrentView}
                    onSubmit={() => {
                        loadData();
                        setCurrentView('home');
                    }}
                />
            )}
            {currentView === 'standings' && (
                <Standings
                    setCurrentView={setCurrentView}
                    participants={participants}
                    dailyResults={dailyResults}
                />
            )}
            {currentView === 'admin' && (
                <AdminPanel
                    setCurrentView={setCurrentView}
                    onSubmit={() => {
                        loadData();
                        setCurrentView('home');
                    }}
                />
            )}
        </div>
    );
}