import { useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/firebase';

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={user.photoURL} 
            alt="User profile" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}