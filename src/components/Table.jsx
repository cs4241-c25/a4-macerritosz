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
    useEffect(()=> {
        if(props.data){
            console.log( props.data);
            //add all previous data and append new
            setRows(prevRows => [...prevRows, props.data]);
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
    useEffect(() => {
        console.log("editTarget:", editTarget);
        console.log("showModal:", showModal);
    }, [editTarget, showModal]);

    const handleModify = (id) => {
        //get the id from rows, open the modal
        const r = rows.find(row => row.flightID === id)
        return r;

    }

    const createRow = (row) => {
        //go use the parsed data and access
        let daysUntil;
        const absDays = Math.abs(row.daysTil)
        if(absDays < 0){
            daysUntil = `${absDays} day(s) ago`
        } else {
            daysUntil = `${absDays} day(s)`
        }


        return (
            <tr key={row.flightID} >
                <td>{row.flightType}</td>
                <td>{row.names.join(", ")}</td>
                <td>{row.cityDepart}</td>
                <td>{row.cityDest}</td>
                <td>{row.departDate}</td>
                <td>{row.returnDate ? row.returnDate : "N/A"}</td>
                <td>{daysUntil}</td>
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
        const response = await fetch( "/delete", {
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
                        rows.length > 0 ? rows.map((row) => (createRow(row))) : console.log("Empty")
                    }
                </tbody>
            </table>
        </section>
            {
                showModal && editTarget &&
                <Modal
                    showModal = {showModal}
                    close = {() => setShowModal(false)}
                    data = {handleModify(editTarget) || {}}
                    target = {editTarget}
                />
            }
        </>
    )
}
Table.propTypes = {
    data: PropTypes.object.isRequired,  // Assuming 'data' is an array
};

export default Table;