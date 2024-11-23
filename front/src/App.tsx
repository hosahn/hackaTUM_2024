import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Start from './pages/Start.tsx';

function App() {
  return (
    <>
      <Router>
            <Routes>
                <Route path="/" element={<Start />} />
            </Routes>
      </Router>
    </>
  )
}

export default App
