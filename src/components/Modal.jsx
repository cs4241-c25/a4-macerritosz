import {useState} from "react";
import '../index.css'

function Modal(props) {
    return (
        <div id="modifyModal" className="modal hidden fixed inset-0 bg-black bg-opacity-50 pt-16">
            <div className="modal-content bg-white m-10 p-5 border border-[#888] w-4/5 mx-auto">
                <span className="close" id="closeModal">X</span>
                <h3>Modify Flight</h3>
                <form id="modifyForm">
                    <label htmlFor="modalCityDepart">Departure City:</label>
                    <input type="text" id="modalCityDepart" name="cityDepart"
                           className="p-2 rounded-md border-2 border-[#7E4181]"/>
                    <label htmlFor="modalCityDest">Destination City:</label>
                    <input type="text" id="modalCityDest" name="cityDest"
                           className="p-2 rounded-md border-2 border-[#7E4181]"/>
                    <br/>
                    <label htmlFor="modalDepartDate">Departure Date:</label>
                    <input type="date" id="modalDepartDate" name="departDate"
                           className="p-2 rounded-md border-2 border-[#7E4181]"/>
                    <label id="modalReturnDateLabel" htmlFor="modalReturnDate">Return Date:</label>
                    <input type="date" id="modalReturnDate" name="ReturnDate"
                           className="p-2 rounded-md border-2 border-[#7E4181]"/>
                    <br/>
                    <button id="modalSubmit" type="submit" className="py-2 px-6 bg-[#7E4181] text-white rounded-md">Save
                        Changes
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Modal;