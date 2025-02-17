import {useEffect, useState} from "react";
import '../index.css'
import PropTypes from 'prop-types';

function Table(props){
    //where all the rows are saved
    const [rows, setRows] = useState([]);
    //on render, try and parse incoming data from the submit post if data changed
    useEffect(()=>{
        if(props.data){
            console.log( props.data);
            setRows(prevRows => [...prevRows, props.data]);
        }
    }, [props.data]);

    const createRow = (row) => {
        //go use the parsed data and access
        return (
            <tr key={row.id}>
                <td>{row.flightType}</td>
                <td>{row.names.join(", ")}</td>
                <td>{row.cityDepart}</td>
                <td>{row.cityDest}</td>
                <td>{row.departDate}</td>
                <td>{row.returnDate ? row.returnDate : "N/A"}</td>
                <td>{row.daysUntil}</td>
                <td>
                    <button className="modifyButton"  id={`mod-button-${row.id}`} > Edit</button>
                </td>
                <td>
                    <button className="deleteButton" id={`Button-${row.id}`}> Delete</button>
                </td>
            </tr>
        )
    }
    return (
        <section className="p-4">
            <table className="w-full">
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
                <tbody id="flightTable">
                    {
                        rows.length > 0 ? rows.map((row) => (createRow(row))) : console.log("Empty")
                    }
                </tbody>
            </table>
        </section>
    )
}
Table.propTypes = {
    data: PropTypes.object.isRequired,  // Assuming 'data' is an array
};

export default Table;