import React, { useState, useEffect } from 'react';

const InfoForm = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (name === '' && phoneNumber === '' && email === '' && userId === null) {
            setIsEditing(false);
        }
    }, [name, phoneNumber, email, userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Basic validation
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
            // let response; // Uncomment if you use the fetch calls
            if (isEditing && userId) {
                // Placeholder for UPDATE API call
                console.log('Updating user:', userId, userData);
                // response = await fetch(`/api/users/${userId}`, {
                //     method: 'PUT',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(userData),
                // });
                alert('User data update initiated (see console).'); // Placeholder
            } else {
                // Placeholder for ADD API call
                console.log('Adding new user:', userData);
                // response = await fetch('/api/users', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(userData),
                // });
                alert('User data submission initiated (see console).'); // Placeholder
            }

            // const result = await response.json(); // Uncomment if you use the fetch calls
            // if (response.ok) {
            //     alert(`User data ${isEditing ? 'updated' : 'added'} successfully!`);
            //     // Reset form or redirect, etc.
            //     setName('');
            //     setPhoneNumber('');
            //     setEmail('');
            //     setIsEditing(false);
            //     setUserId(null);
            // } else {
            //     alert(`Error: ${result.message || 'Something went wrong.'}`);
            // }
        } catch (error) {
            console.error('API call failed:', error);
            alert('API call failed. See console for details.');
        }
    };

    // Dummy function to simulate loading data for editing
    const loadUserDataForEdit = (id) => {
        // In a real app, you'd fetch this from a backend
        const dummyData = {
            '123': { name: 'John Doe', phoneNumber: '+19876543210', email: 'john.doe@example.com' },
            // Add more dummy users if needed
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