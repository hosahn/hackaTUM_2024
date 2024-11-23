import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ProvideSources from './pages/ProvideSources.tsx';
import SelectTopics from "./pages/SelectTopics.tsx";
import ReviewArticle from "./pages/ReviewArticle.tsx";
import Finish from "./pages/Finish.tsx";

function App() {
    return (
        <>
            <div className="navbar bg-base-300 mb-10">
                <a className="btn btn-ghost text-xl">
                    📰🔫 HeadlineHunter
                </a>
            </div>
            <div className="max-w-screen-lg mx-auto">
                <Router>
                    <Routes>
                        <Route path="/" element={<ProvideSources/>}/>
                        <Route path="/selectTopics" element={<SelectTopics/>}/>
                        <Route path="/reviewArticle" element={<ReviewArticle/>}/>
                        <Route path="/finish" element={<Finish/>}/>
                    </Routes>
                </Router>
            </div>
        </>
    )
}

export default App
