// components/Home.js

import React, { useState } from 'react';

function CSPP() {
    const [data, setData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Client-side Prototype Pollution Example</h1>
            <form>
                <label>
                    Username:
                    <input type="text" name="username" onChange={handleChange} />
                </label>
            </form>
            <h2>State Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default CSPP;
