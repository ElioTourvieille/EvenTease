import {BrowserRouter as Router, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

// Components imports
import LayoutVisitor from "./LayoutVisitor";
import NavBar from "./NavBar";
import Footer from "./Footer";
import DefaultLayout from "./DefaultLayout";

// Pages imports
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Error404 from "../pages/Error404";
import Main from "../pages/Main";
import CreateEvent from "../pages/CreateEvent";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import MyEvents from "../pages/MyEvents";

function App() {

    return (
        <>
          <Router>
            <div className="App">
                <Routes>
                    <Route element={ <LayoutVisitor /> }>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<Error404 />} />
                    <Route path="/create" element={<CreateEvent/>} />

                    <Route element={ <> <NavBar /> <Outlet/> <Footer /> </> }>
                        <Route path="/main" element={<Main/>} />
                    </Route>

                    <Route path="/" element={  <DefaultLayout />  }>
                        <Route path="/profile" element={ <Profile/> } />
                        <Route path="/dashboard" element={ <Dashboard/> } />
                        <Route path="/calendar" element={ <Calendar/> } />
                        <Route path="/myevents" element={ <MyEvents/> } />
                    </Route>

                </Routes>
            </div>
          </Router>
            <ToastContainer />
        </>
    );
}

export default App;
