import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Store from './Redux/Store';
import { Provider } from "react-redux";
import UserWrapper from './Components/User/UserWrapper/UserWrapper';
import ManagerWrapper from './Components/Manager/ManagerWrapper/ManagerWrapper';
import AdminWrapper from './Components/Admin/AdminWrapper/AdminWrapper';
import VendorWrapper from './Components/Vendor/VendorWrapper/VendorWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS for toastify

function App() {
  return (
    <Provider store={Store}>
           
      <Router>
        <Routes>
          <Route path="/*" element={<UserWrapper />} />
          <Route path="/manager/*" element={<ManagerWrapper />} />
          <Route path="/admin/*" element={<AdminWrapper />} />
          <Route path="/vendor/*" element={<VendorWrapper />} />
        </Routes>
      </Router>
      <ToastContainer />
    </Provider>
  );
}

export default App;

