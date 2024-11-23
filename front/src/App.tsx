import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ProvideSources from './pages/ProvideSources.tsx';
import SelectTopics from "./pages/SelectTopics.tsx";
import {AiOutlineAim} from "react-icons/ai";
import ReviewArticle from "./pages/ReviewArticle.tsx";

function App() {
  return (
      <>
          <div className="navbar bg-base-300 mb-10">
              <a className="btn btn-ghost text-xl">
                  <AiOutlineAim />
                  HeadlineHunter
              </a>
          </div>
          <div className="max-w-screen-lg mx-auto">
          <Router>
              <Routes>
                  <Route path="/" element={<ProvideSources/>}/>
              </Routes>
              <Routes>
                  <Route path="/selectTopics" element={<SelectTopics/>}/>
              </Routes>
              <Routes>
                  <Route path="/reviewArticle" element={<ReviewArticle/>}/>
              </Routes>
          </Router>
          </div>
      </>
  )
}

export default App
