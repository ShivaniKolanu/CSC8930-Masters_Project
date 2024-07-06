import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import VoteProcessPage from './pages/VoteProcessPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <div className="App">
      
      

      <BrowserRouter>
        <Routes>
          <Route path = "/welcome" element = {<WelcomePage />} />
          <Route path = "/register" element = {<RegisterPage />} />
          <Route path = "/main-landing" element = {<LandingPage />} />
          <Route path = "/vote-online" element = {<VoteProcessPage/>} />
          <Route path = "/results" element = {<ResultsPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
