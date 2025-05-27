import React, { useState, useEffect } from 'react';

const InfoForm = ({ name, setName, phoneNumber, setPhoneNumber, email, setEmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null); 

    useEffect(() => {
        if (name === '' && phoneNumber === '' && email === '' && userId === null) {
            setIsEditing(false);
        }
    }, [name, phoneNumber, email, userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !phoneNumber || !email) {
            alert('All fields are required.');
            return;
        }
        if (!/^\+\d+$/.test(phoneNumber)) {
            alert('Phone number must be in international format (e.g., +1234567890).');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        const userData = { name, phoneNumber, email };
        try {
            if (isEditing && userId) {
                console.log('Updating user (via props):', userId, userData);
                alert('User data update initiated (see console).'); 
            } else {
                console.log('Adding new user (via props):', userData);
                alert('User data submission initiated (see console).');
            }
        } catch (error) {
            console.error('API call failed:', error);
            alert('API call failed. See console for details.');
        }
    };

    const loadUserDataForEdit = (id) => {
        const dummyData = {
            '123': { name: 'Jane Doe (Loaded)', phoneNumber: '+11234567890', email: 'jane.doe.loaded@example.com' },
        };
        if (dummyData[id]) {
            const user = dummyData[id];
            setName(user.name);
            setPhoneNumber(user.phoneNumber);
            setEmail(user.email);
            setIsEditing(true);
            setUserId(id);
        } else {
            alert('User not found for editing.');
        }
    };

    return (
        <div className="InfoForm-container no-print">
            <h2 className="no-print">{isEditing ? 'Update Information' : 'Add Information'}</h2>
            <form onSubmit={handleSubmit} className="no-print">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-buttons-container no-print">
                    <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
                    {!isEditing && (
                        <button type="button" onClick={() => loadUserDataForEdit('123')}>
                            Load User '123' for Editing
                        </button>
                    )}
                    {isEditing && (
                        <button type="button" onClick={() => {
                            setName(''); 
                            setPhoneNumber('');
                            setEmail('');
                            setIsEditing(false);
                            setUserId(null);
                        }}>
                            Cancel Edit / Add New
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default InfoForm; 