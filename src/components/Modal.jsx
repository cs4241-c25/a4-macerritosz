import {useEffect, useState} from "react";
import '../index.css'
import PropTypes from "prop-types";



function Modal(props) {
    console.log(props);
    /*
    From props should have the true value to show it, and also the id of the row to be modified
     */
    //static data from the table row
    const [fillData, setFillData] = useState({});
    const [input, setInput] = useState({cityDepart: '', cityDest: '', departDate: '', returnDate: null});
    useEffect(() => {
        if (props.data) {
            console.log(props.data);
            setFillData(props.data);
            setInput({
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

    return (
        <div id="modifyModal" className={`modal fixed inset-0 bg-black bg-opacity-50 pt-16 
        ${props.showModal ? 'block' : 'hidden'} z-50`}>
            <div className="modal-content bg-white m-10 p-5 border border-[#888] w-4/5 mx-auto">
                <span className="close" id="closeModal" onClick={props.close}>X</span>
                <h3>Modify Flight</h3>
                <form id="modifyForm">
                    <label htmlFor="modalCityDepart">
                        Departure City:
                    </label>
                    <input type="text"
                           id="modalCityDepart" name="cityDepart"
                           onChange={handleChange}
                           className="p-2 rounded-md border-2 border-[#7E4181]"
                    />
                    <label htmlFor="modalCityDest">
                        Destination City:
                    </label>
                    <input type="text" id="modalCityDest" name="cityDest"
                           onChange={handleChange}
                           className="p-2 rounded-md border-2 border-[#7E4181]"
                    />
                    <br/>
                    <label htmlFor="modalDepartDate">
                        Departure Date:
                    </label>
                    <input type="date" id="modalDepartDate" name="departDate"
                           onChange={handleChange}
                           className="p-2 rounded-md border-2 border-[#7E4181]"
                    />
                    <label id="modalReturnDateLabel" htmlFor="modalReturnDate">
                        Return Date:
                    </label>
                    <input type="date" id="modalReturnDate" name="returnDate"
                           onChange={handleChange}
                           className="p-2 rounded-md border-2 border-[#7E4181]"
                    />
                    <br/>
                    <button id="modalSubmit" type="submit" className="py-2 px-6 bg-[#7E4181] text-white rounded-md">Save
                        Changes
                    </button>
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
};

export default Modal;