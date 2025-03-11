import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileForm from './pages/profile/ProfileForm';
import RootLayout from './RootLayout';
import ProfileList from "@/pages/profile/ProfileList.tsx";
import AuthCallback from "@/pages/auth/AuthCallback.tsx";
import AuthCodeError from "@/pages/auth/AuthCodeError.tsx";
import Login from "@/pages/auth/LoginPage.tsx";

const App = () => {
    return (
            <BrowserRouter>
                <RootLayout>
                <div className="min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<ProfileList />} />
                        <Route path="/profile/create" element={<ProfileForm />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth/auth-code-error" element={<AuthCodeError />} />

                    </Routes>
                </div>
                </RootLayout>
            </BrowserRouter>
    );
}

export default App;
