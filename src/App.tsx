import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage.tsx';
import ProfileForm from './pages/profile/ProfileForm.tsx';

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen w-full">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile/create" element={<ProfileForm />} />
                    {/*<Route path="/profile/:id" element={<ProfileDetailPage />} />*/}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
