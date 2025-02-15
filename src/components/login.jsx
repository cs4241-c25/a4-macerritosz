import {useState} from "react";
import '../index.css'

function LoginPage() {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-80 ">
            <div className='text-center underline decoration-[#7E4181] decoration-4 decoration-soli' d>
                <h2 id="Word" className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
            </div>


            <form>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username:</label>
                    <input type="text" id="username" required
                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password:</label>
                    <input type="password" id="password" required
                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <button type="button" id="login-button"
                        className="w-full py-2 bg-button text-black font-semibold border border-[#7E4181] rounded-md hover:bg-button-hover focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Login
                </button>
            </form>

            <div className="mt-4 text-center">
                <a href="javascript:switchStates()" id="switch-link"
                   className="text-accent hover:text-button-hover text-sm">
                    Sign up to save your flights!
                </a>
            </div>
        </div>
    )
}