import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// Components imports
import {Layout} from "./Layout";
import Footer from "./Footer";

// Pages imports
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Error404 from "../pages/Error404";

function App() {
    return (
        <>
          <Router>
            <div className="App">
                <Routes>
                    <Route element={<> <Layout /> <Footer /> </> }>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<Error404 />} />
                </Routes>
            </div>
          </Router>
        </>
    );
}

export default App;
