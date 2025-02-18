import {useContext} from "react";
import '../index.css'
import {useNavigate} from "react-router-dom";
import CredContext from "./CredentialsContext.jsx";

function Header() {
    const {loggedIn, username, logOut} = useContext(CredContext)
    const navigate = useNavigate();
    const handleLogout = async function () {
        try {
            // Send a request to the server to logout
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // call context logout
                console.log('Logout successful');
                logOut();
                // Redirect to the login page
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <header>
            <div className="bg-[#7E4181] w-full font-sans">
                <nav>
                    <div>
                        {
                            loggedIn ? (
                                <button className="py-2 px-4 bg-[#7E4181] text-white rounded-md" id="logout-button"  onClick={handleLogout}> Logout </button>
                            ) : (
                                <a href="/">
                                    <button className="py-2 px-4 bg-[#7E4181] text-white rounded-md" id="login-button"> Login </button>
                                </a>
                            )
                        }
                    </div>
                    <div>
                        Hey, {username}!
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Header;