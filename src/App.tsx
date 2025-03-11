import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileForm from './pages/profile/ProfileForm';
import RootLayout from './RootLayout';
import ProfileList from "@/pages/profile/ProfileList.tsx";

const App = () => {
    return (
        <RootLayout>
            <BrowserRouter>
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<ProfileList />} />
                        <Route path="/profile/create" element={<ProfileForm />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </RootLayout>
    );
}

export default App;
