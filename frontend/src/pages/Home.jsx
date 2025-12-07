import React from 'react';
import Hero from '../components/Hero';
import VerificationTerminal from '../components/VerificationTerminal';
import History from '../components/History';

const Home = ({ appState, setAppState, isAuthenticated, user }) => {
    return (
        <div className="space-y-12 pb-20">
            <Hero appState={appState} />

            <div id="verify" className="-mt-32 relative z-30">
                <VerificationTerminal
                    setAppState={setAppState}
                    isAuthenticated={isAuthenticated}
                />
            </div>

            {isAuthenticated && <History user={user} />}
        </div>
    );
};

export default Home;
