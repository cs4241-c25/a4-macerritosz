import {useEffect, useState} from "react";
import '../index.css'
import PropTypes from "prop-types";



function Modal(props) {
    console.log(props);
    /*
    From props should have the true value to show it, and also the id of the row to be modified
     */
    //static data from the table row
    const [input, setInput] = useState({cityDepart: '', cityDest: '', departDate: '', returnDate: null});
    useEffect(() => {
        if (props.data) {
            setInput({
                ...props.data,
                cityDepart: props.data.cityDepart || '',
                cityDest: props.data.cityDest || '',
                departDate: props.data.departDate || '',
                returnDate: props.data.returnDate || null
            });
        }
    }, [props.data]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setInput((prev) => ({...prev, [name]: value}));
    }

    async function modifyData(event){
        event.preventDefault();
        console.log(input)

        try {
            const response = await fetch(`/modifyFlightData/` + props.target, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input)
            });

            if (response.ok) {
                const updatedFlight = await response.json();
                console.log("Flight modified successfully");
                //close modal and pass the data back to the Table with a function and call it
                props.close()
                props.getUpdatedFlight(updatedFlight); // Reload on screen data
            } else {
                console.error("Error modifying flight: " + response.status);
            }
        } catch (err) {
            console.error("Request error:", err);
        }
    }

    return (
        <div id="modifyModal" className={`modal fixed inset-0 bg-white/65 pt-16 
        ${props.showModal ? 'block' : 'hidden'} z-50`}>
            <div className="modal-content bg-white m-10 p-5 border border-transparent w-4/5 mx-auto">
                <span className="close cursor-pointer m-2" id="closeModal" onClick={props.close} >X</span>
                <h3 className={"pt-1 pb-1"}>Modify Flight: </h3>
                <form id="modifyForm" >
                    <div className={"flex"}>
                        <label htmlFor="modalCityDepart">
                            Departure City: <input type="text"
                                                   id="modalCityDepart" name="cityDepart"
                                                   value={input.cityDepart}
                                                   onChange={handleChange}
                                                   className="p-2 rounded-md border-2 border-[#7E4181]"
                        />
                        </label>

                        <label htmlFor="modalCityDest" className={"pl-2"}>
                            Destination City: <input type="text" id="modalCityDest" name="cityDest"
                                                     value={input.cityDest}
                                                     onChange={handleChange}
                                                     className="p-2 rounded-md border-2 border-[#7E4181]"
                        />
                        </label>

                    </div>
                    <br/>
                    <div className={"flex"}>
                        <label htmlFor="modalDepartDate" >
                            Departure Date: <input type="date" id="modalDepartDate" name="departDate"
                                                   value={input.departDate}
                                                   onChange={handleChange}
                                                   className="p-2 rounded-md border-2 border-[#7E4181]"
                        />
                        </label>

                        <label id="modalReturnDateLabel" htmlFor="modalReturnDate" className={`pl-2 ${props.data.returnDate !== "" ? 'visible' : 'hidden'}`}>
                            Return Date: <input type="date" id="modalReturnDate" name="returnDate"
                                                value={input.returnDate}
                                                onChange={handleChange}
                                                className="p-2 rounded-md border-2 border-[#7E4181]"
                        />
                        </label>

                    </div>
                    <br/>
                    <div>
                        <button id="modalSubmit" type="submit" className="py-2 px-6 bg-[#7E4181] text-white rounded-md
                         active:border-[#a16aa3] active:bg-[#a16aa3] cursor-pointer" onClick={modifyData}>
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
Modal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    target: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    getUpdatedFlight: PropTypes.func.isRequired
};

export default Modal;