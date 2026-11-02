import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Onboarding, { ONBOARDED_KEY } from './pages/Onboarding';

// Checked on every render of the route (not once in App), so it sees the flag set by "Get Started".
function RequireOnboarded({ children }) {
  let done = true;
  try {
    done = localStorage.getItem(ONBOARDED_KEY) === '1';
  } catch {
    /* storage blocked: skip onboarding */
  }
  return done ? children : <Navigate to="/welcome" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Onboarding />} />
      <Route
        path="/"
        element={
          <RequireOnboarded>
            <Home />
          </RequireOnboarded>
        }
      />
      <Route path="/search" element={<Search />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
