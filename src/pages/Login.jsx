import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useEffect } from 'react';
import GoogleButton from '../components/Auth/GoogleButton';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) navigate('/home');
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <div className="space-y-4">
          <GoogleButton />
        </div>
      </div>
    </div>
  );
}