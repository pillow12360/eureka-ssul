// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfileForm from './pages/profile/ProfileForm';
import RootLayout from './RootLayout';
import TestApi from "@/pages/TestApi.tsx";

const App = () => {
    return (
        <RootLayout>
            <BrowserRouter>
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile/create" element={<ProfileForm />} />
                        {/*<Route path="/profile/:id" element={<ProfileDetailPage />} />*/}
                        <Route path="/test-api" element={<TestApi />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </RootLayout>
    );
}

export default App;
