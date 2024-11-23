import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ProvideSources from './pages/ProvideSources.tsx';
import SelectInterestingTopics from "./pages/SelectInterestingTopics.tsx";
import {AiOutlineAim} from "react-icons/ai";

function App() {
  return (
      <>
          <div className="navbar bg-base-300 mb-10">
              <a className="btn btn-ghost text-xl">
                  <AiOutlineAim />
                  HeadlineHunter
              </a>
          </div>
          <Router>
              <Routes>
                  <Route path="/" element={<ProvideSources/>}/>
              </Routes>
              <Routes>
                  <Route path="/selectTopics" element={<SelectInterestingTopics/>}/>
              </Routes>
          </Router>
      </>
  )
}

export default App
