import { useState } from 'react';
import SignInUpPage from '../signInUpPage';
import { isSignedIn } from '../../services/authService';
import Fight from '../fight';
import SignOut from '../signOut';

export default function StartScreen() {
    const [loggedIn, setLoggedIn] = useState(isSignedIn());

    if (!loggedIn) {
        return <SignInUpPage setIsLoggedIn={setLoggedIn} />;
    }

    return (
        <>
            <Fight />
            <SignOut isSignedIn={loggedIn} onSignOut={() => setLoggedIn(false)} />
        </>
    );
}
