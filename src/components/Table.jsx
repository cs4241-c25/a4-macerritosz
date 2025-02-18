import {useEffect, useState} from "react";
import '../index.css'
import PropTypes from 'prop-types';
import Modal from "./Modal.jsx";

function Table(props) {
    //props.data passed in as parsed JSON, so will need to handle as js objects
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    //on render, try and parse incoming data from the submit post if data changed
    useEffect(() => {
        if (props.data && props.data.length > 0) {
            setRows(prevRows => [...prevRows, ...props.data]);
        }
    }, [props.data]); // run everytime it changes

    const handleDelete = (id)=> {
        //get all the previous rows, and filter for given id, taking everything but that row
        //re-renders page to show the rows now
        setRows(prevRows => (prevRows.filter(row => row.flightID !== id)))
    }
    const handleEditClick = (flightID) => {
        console.log("Flight ID to edit:", flightID);
        setEditTarget(flightID);
        setShowModal(true);
    };
    //trigger re render after editTarget is assigned
    useEffect(() => {
        console.log("editTarget:", editTarget);
    }, [editTarget]);

    const handleModify = (id) => {
        //get the id from rows, open the modal
        const r = rows.find(row => row.flightID === id)
        if (!r) return {}; // Ensure we don't return null or undefined
        return r;
    }
    const getUpdatedFlight = updatedFlight => {
        //replaces the id that matched with the updated flight info
        const absDays = Math.abs(updatedFlight.daysTil)
        console.log(updatedFlight.daysTil)
        let daysUntil;
        if(updatedFlight.daysTil < 0){
            daysUntil = `${absDays} day(s) ago`
        } else {
            daysUntil = `${absDays} day(s)`
        }
        const row = document.getElementById(`row-${updatedFlight.flightID}`);
        if (row) { //check if the row hasnt been changed/error in indexing
            const daysUntilElement = row.querySelector('.daysUntil');
            if (daysUntilElement) {
                daysUntilElement.textContent = daysUntil; // Update the text in the "daysUntil" column
            }
        }
        setRows(prevRows => prevRows.map(row => row.flightID === updatedFlight.flightID ? updatedFlight : row));
    }

    const createRow = (row) => {
        //go use the parsed data and access
        let daysUntil;
        const absDays = Math.abs(row.daysTil)
        if(rows.daysTil < 0){
            daysUntil = `${absDays} day(s) ago`
        } else {
            daysUntil = `${absDays} day(s)`
        }

        return (
            <tr id={`row-${row.flightID}`}>
                <td>{row.flightType}</td>
                <td>{row.names.join(", ")}</td>
                <td>{row.cityDepart}</td>
                <td>{row.cityDest}</td>
                <td>{row.departDate}</td>
                <td>{row.returnDate ? row.returnDate : "N/A"}</td>
                <td className="daysUntil" >{daysUntil} </td> {/* Static Text, so maybe ok to access directly */}
                <td>
                    <button className="modifyButton"  id={`mod-button-${row.flightID}`} onClick={() => handleEditClick(row.flightID)}> Edit
                    </button>
                </td>
                <td>
                    <button className="deleteButton" id={`Button-${row.flightID}`} onClick={() => submitDelete(row.flightID)}>
                        Delete
                    </button>
                </td>
            </tr>
        )
    }

    const submitDelete = async function (index){
        console.log("Sending delete request for index:", index);
        const json = JSON.stringify({ flightIndex: index} )
        const response = await fetch( '/delete', {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE",
            body: json
        })
        const result = await response.json();
        console.log(result)
        if(result.result === "success") {
            handleDelete(index);
        }
    }


    return (
        <>
        <section className="p-4">
            <table className="w-full text-align-center">
                <thead>
                <tr>
                    <th className="underline decoration-[#7E4181] decoration-2">Flight Type</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Passenger List</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Depart City</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Destination City</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Depart Date</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Return Date</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Day(s) until Departure</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Modify Flight</th>
                    <th className="underline decoration-[#7E4181] decoration-2">Delete Flight</th>
                </tr>
                </thead>
                <tbody id="flightTable" >
                    {
                        rows.length > 0 ? (rows.map((row) => (createRow(row)))) : console.log("Empty")
                    }
                </tbody>
            </table>
        </section>
            {
                showModal &&
                <Modal
                    showModal = {showModal}
                    close = {() => setShowModal(false)}
                    data = {handleModify(editTarget) || {}}
                    target = {editTarget}
                    getUpdatedFlight = {getUpdatedFlight}
                />
            }
        </>
    )
}
Table.propTypes = {
    data: PropTypes.array.isRequired,  // Assuming 'data' is an array
};

export default Table;