import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import CSPP from './components/CSPP';
import Navigation from './components/Navigation';

function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cspp" element={<CSPP />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;