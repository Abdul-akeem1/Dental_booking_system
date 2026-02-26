import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Footer from '../components/layout/Footer';
import './AdminLogin.css'

/*   <div className="appointment-page">
            <Navbar />
            <main>
                <Hero />
                <Services />
                {/* for dentists and adminastrastion to login to services*//*}
            </main>
            <Footer />
        </div>*/ 
    const LoginIn = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/login' : '/api/register';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(isLogin ? 'Login successful!' : 'Registration successful! Please log in.');
                if (!isLogin) {
                    setIsLogin(true);
                    setPassword('');
                } else {
                    // Login successful
                    login({ email }); // You might want to pass more user info from backend
                    navigate('/');
                }
            } else {
                setMessage(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Login/Register error:', error);
            setMessage('Server error. Please try again later. Ensure the backend server is running on port 5000.');
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            <div className="login-container">
                <div className="login-card">
                    <button className="close-btn">×</button>

                    <button className="google-btn">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">PASSWORD</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            {isLogin ? 'Log in' : 'Create account'}
                        </button>
                    </form>

                    {message && <p className="message">{message}</p>}

                    <div className="login-footer">
                        {isLogin ? (
                            <>
                                <a href="#" className="link">Use single sign-on</a>
                                <a href="#" className="link">Reset password</a>
                                <p className="toggle-text">
                                </p>
                            </>
                        ) : (
                            <p className="toggle-text">
                                Already have an account? <button onClick={() => setIsLogin(true)} className="link-btn">Log in</button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginIn;