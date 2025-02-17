import {useState} from "react";
import '../index.css'

function Header() {
    return (
        <header>
            <div className="bg-[#7E4181] w-full">
                <nav>
                    <div className="">
                        <a href="/">
                            <button className="py-2 px-4 bg-[#7E4181] text-white rounded-md" id="login-button"> Login </button>
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Header;