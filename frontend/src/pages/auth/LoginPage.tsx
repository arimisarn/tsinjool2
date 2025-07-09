import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { slidesLogin } from '../../constant';
import { Link } from 'react-router-dom';

function Login() {
  const [index, setIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/token/login/', { username, password });
      localStorage.setItem('auth_token', response.data.auth_token);
      // navigate('/home');  // Rediriger vers la page d'accueil

      // Vérifie si c’est la première connexion (vérification de 'isFirstLogin' dans la réponse)
      const isFirstLogin = response.data.isFirstLogin;
      if (isFirstLogin) {
        navigate('/profile-setup');  // Rediriger vers la configuration du profil
      } else {
        navigate('/home');  // Rediriger vers la page d'accueil
      }
    } catch (error: any) {
      console.error('Erreur détaillée de l\'API :', error.response);  // Log des erreurs
      if (error.response?.status === 400) {
        const detail = error.response?.data?.non_field_errors?.[0] || '';
        if (detail.includes('Invalid credentials')) {
          setError("Nom d'utilisateur ou mot de passe incorrect.");
        } else {
          setError("Erreur lors de la connexion.");
        }
      } else {
        setError("Erreur serveur, veuillez réessayer.");
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };
  
  

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slidesLogin.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-around transition-colors duration-500">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full transition-all duration-500
        bg-white dark:bg-black
        [background:radial-gradient(125%_125%_at_50%_10%,theme(colors.white)_40%,#63e_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,theme(colors.black)_40%,#63e_100%)]"
      />
      {/* Carousel */}
      <div className="w-1/2 h-[400px] flex flex-wrap items-center justify-center">
        <div className="relative w-[80%] h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slidesLogin[index].id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 text-white text-2xl font-semibold ${slidesLogin[index].bg}`}
            >
              <div className='flex justify-center items-center '>
                <img src={slidesLogin[index].image} alt={slidesLogin[index].content} className="w-48 h-48 object-cover mt-16 mb-4 " />
              </div>
              <div className='flex justify-center items-center text-center'>
                <p className="text-xl text-black dark:text-white font-semibold">
                  {slidesLogin[index].content}
                </p> 
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full dark:bg-zinc-900"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 dark:text-white">Connexion</h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-zinc-800 dark:text-white"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md dark:bg-zinc-800 dark:text-white"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
            disabled={loading}
          >
            Se connecter
            {loading && (
              <svg
                className="ml-2 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                />
              </svg>
            )}
          </button>
        </form>
        <p className='mt-3 text-md font-[Arial] dark:text-white'>Vous avez déjà un compte ? </p>
        <Link to="/register" className='underline hover:text-md hover:font-semibold transition-all duration-500 text-blue-600'> S'inscrire maintenant</Link>
      </motion.div>
    </div>
  );
}

export default Login;
