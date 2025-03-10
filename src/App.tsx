import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileForm from './pages/profile/ProfileForm';
import RootLayout from './RootLayout';
import TestApi from "@/pages/TestApi.tsx";
import ProfileDetail from "@/pages/profile/ProfileDetail.tsx";
import ProfileList from "@/pages/profile/ProfileList.tsx";

const App = () => {
    return (
        <RootLayout>
            <BrowserRouter>
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<ProfileList />} />
                        <Route path="/profile/create" element={<ProfileForm />} />
                        <Route path="/test-api" element={<TestApi />} />
                        <Route path="/profile/:id" element={<ProfileDetail />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </RootLayout>
    );
}

export default App;
