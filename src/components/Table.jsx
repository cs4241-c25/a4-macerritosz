import {useState} from "react";
import '../index.css'

function Table() {
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
                </tbody>
            </table>
        </section>
    )
}

export default Table;