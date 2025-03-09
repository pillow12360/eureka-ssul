import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage.tsx';
import ProfileForm from './pages/profile/ProfileForm.tsx';

const App = () => {
    return (
        <BrowserRouter>
            <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#7391e9" }}>
                <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/profile/create" element={<ProfileForm />} />
                        {/*<Route path="/profile/:id" element={<ProfileDetailPage />} />*/}
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
