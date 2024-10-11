import { Routes } from '@/routes';
import { useAuthStore } from '@/stores';
import { useEffect, useState } from 'react';

function App() {
    const [initialized, setInitialized] = useState(false);
    const getUserData = useAuthStore((v) => v.getUserData);

    useEffect(() => {
        getUserData();
        setInitialized(true);
    }, []);

    return initialized ? <Routes /> : null;
}

export default App;
