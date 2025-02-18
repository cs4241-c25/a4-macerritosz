import {useContext, useEffect, useState} from "react";
import '../index.css'
import Table from "./Table.jsx";
import {useNavigate} from "react-router-dom";
import CredContext from "./CredentialsContext.jsx";

function Homepage() {
    const {loggedIn, username} = useContext(CredContext)
    const [flightData, setFlightData] = useState({
        flightType: "One-Way",
        names: [],
        cityDepart: '',
        cityDest: '',
        departDate: '',
        returnDate: ''
    })
    const [responseData, setResponseData] = useState([]);

    /* Use state information to make sure that user is logged in, will change when user logs out */
    const navigate = useNavigate();
    //instead, use a get request to /profile to get the user
    useEffect(() => {
        if (loggedIn) {
            navigate('/');
        } else {
            navigate('/Login');
        }
    }, [loggedIn]);

    useEffect(() => {
        if (loggedIn) {
            async function getSavedFlights() {
                const response = await fetch('/getAllFlights')
                if (!response.ok) {
                    console.error('Failed to fetch flights');
                    return;
                }
                const data = await response.json();
                setResponseData(data)
            }

            getSavedFlights();
        }
    }, [loggedIn]);

    /*
    Manage what is shown based on options:
     */
    function checkTripType() {
        if (document.getElementById("r2").checked) {
            document.getElementById("returnDiv").style.visibility = "visible";
        } else {
            document.getElementById("returnDiv").style.visibility = "hidden";
        }
    }

    function checkPassengerCount() {
        const dropdown = document.getElementById("numPassengers");
        const value = Number(dropdown.value);

        let updatedNames = [...flightData.names];
        if (value < 4) updatedNames[3] = '';
        if (value < 3) updatedNames[2] = '';
        if (value < 2) updatedNames[1] = '';

        updatedNames = updatedNames.filter(name => name !== '');

        setFlightData({...flightData, names: updatedNames});

        switch (value) {
            case 2:
                document.getElementById("passOption2").style.visibility = "visible";
                document.getElementById("passOption3").style.visibility = "hidden";
                document.getElementById("passOption4").style.visibility = "hidden";
                document.getElementById("passenger3").value = '';
                document.getElementById("passenger4").value = '';
                break;
            case 3:
                document.getElementById("passOption2").style.visibility = "visible";
                document.getElementById("passOption3").style.visibility = "visible";
                document.getElementById("passOption4").style.visibility = "hidden";
                document.getElementById("passenger4").value = '';
                break;
            case 4:
                document.getElementById("passOption2").style.visibility = "visible";
                document.getElementById("passOption3").style.visibility = "visible";
                document.getElementById("passOption4").style.visibility = "visible";
                break;
            default:
                document.getElementById("passenger1").style.visibility = "visible";
                document.getElementById("passOption2").style.visibility = "hidden";
                document.getElementById("passOption3").style.visibility = "hidden";
                document.getElementById("passOption4").style.visibility = "hidden";
                document.getElementById("passenger2").value = '';
                document.getElementById("passenger3").value = '';
                document.getElementById("passenger4").value = '';
                break;
        }
    }

    /*
    Handle Submit button
     */
    const handleChange = (e, index) => {
        if (e.target.name === "passGroup") {
            const names = [...flightData.names];
            names[index] = e.target.value;
            setFlightData({...flightData, names: names});
        } else
            setFlightData({...flightData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (event) => {
        event.preventDefault()

        const jsonStr = JSON.stringify(flightData);
        const response = await fetch('/submit', {
            headers: {
                "Content-type": "application/json"
            },
            method: 'POST',
            body: jsonStr
        })

        const table = await response.json()
        setResponseData(Array.of(table))
    }


    return (
        <section className="font-sans text-left ">
            <div className=" p-6">
                <div className="flex flex-col p-4">
                    <div id="heading-container"
                         className="text-center underline decoration-[#7E4181] decoration-5 decoration-solid text-decor-skip-ink">
                        <h2 className="text-2xl"> Track your Itinerary!</h2>
                    </div>
                    <div className="mt-4 mb-4 p-4 bg-white rounded-lg flex">
                        <form className="flex flex-col w-full">
                            <label> Add a new flight: </label>
                            <div className="flex items-center justify-between pt-3 pb-3 pl-4 pr-4">
                                <div>
                                    <label htmlFor="r1" className="inline-flex items-center cursor-pointer">
                                        <input type="radio" name="flightType" id="r1" className="peer hidden"
                                               value="One-Way" onChange={(e) => {
                                            checkTripType();
                                            handleChange(e);
                                        }} defaultChecked={true}/>
                                        <span
                                            className={"w-4 h-4 mr-2 ml-2 border border-black rounded-full peer-checked:bg-[#7E4181]"}> </span>
                                        One-Way
                                    </label>
                                    <label htmlFor="r2" className="inline-flex items-center cursor-pointer">
                                        <input type="radio" name="flightType" id="r2" className="peer hidden"
                                               value="One-Way" onChange={(e) => {
                                            checkTripType();
                                            handleChange(e);
                                        }}/>
                                        <span
                                            className={"w-4 h-4 mr-2 ml-2 border border-black rounded-full peer-checked:bg-[#7E4181]"}> </span>
                                        Round-Trip
                                    </label>
                                </div>
                                <div className="passengerOptions">
                                    <label htmlFor="numPassengers" className="mr-2"> Passenger Count:</label>
                                    <select id="numPassengers" name="numPass" onChange={checkPassengerCount}
                                            className=" py-2 px-3 border-2 rounded-md border-[#7E4181]">
                                        <option value="1"> 1 Passenger</option>
                                        <option value="2"> 2 Passengers</option>
                                        <option value="3"> 3 Passengers</option>
                                        <option value="4"> 4 Passengers</option>
                                    </select>
                                </div>
                            </div>
                            <div className="PassengerList flex pr-4 pl-4 justify-between">
                                <div>
                                    <label htmlFor="passenger1">Your Name:
                                        <input type="text" id="passenger1" name="passGroup" placeholder="Your name here"
                                               className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                               onChange={(e) => {
                                                   handleChange(e, 0)
                                               }} required/>
                                    </label>

                                </div>
                                <div className="hiddenOption invisible" id="passOption2">
                                    <label htmlFor="passenger2">Passenger2:
                                        <input type="text" id="passenger2" name="passGroup" placeholder="Passenger 2"
                                               className="px-2 py-2 rounded-md border-2 border-[#7E4181]"

                                               onChange={(e) => {
                                                   handleChange(e, 1)
                                               }} required/>
                                    </label>

                                </div>
                                <div className="hiddenOption invisible" id="passOption3">
                                    <label htmlFor="passenger3">Passenger3:
                                        <input type="text" id="passenger3" name="passGroup" placeholder="Passenger 3"
                                               className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                               onChange={(e) => {
                                                   handleChange(e, 2)
                                               }} required/>
                                    </label>
                                </div>
                                <div className="hiddenOption invisible" id="passOption4">
                                    <label htmlFor="passenger4">Passenger4:
                                        <input type="text" id="passenger4" name="passGroup" placeholder="Passenger 4"
                                               className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                               onChange={(e) => {
                                                   handleChange(e, 3)
                                               }} required/>
                                    </label>

                                </div>
                            </div>
                            <div className="Pairs flex pt-4 pb-4 w-full items-baseline justify-between ">
                                <div id="city-Pair" className="m-2">
                                    <div id="city-pair-dept" className="inline-block px-2">
                                        <label htmlFor="cityDepart"> From: <input type="text" id="cityDepart"
                                                                                  name="cityDepart"
                                                                                  placeholder="City or Airport"
                                                                                  className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                                  onChange={handleChange}
                                                                                  required/> </label>
                                    </div>
                                    <div id="city-pair-dest" className="inline-block px-2">
                                        <label htmlFor="cityDest"> To: <input type="text" id="cityDest"
                                                                              name="cityDest"
                                                                              placeholder="City or Airport"
                                                                              className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                              onChange={handleChange}
                                                                              required/> </label>
                                    </div>
                                </div>
                                <div id="date-Pair" className=" m-2 justify-end">
                                    <div className="inline-block px-2">
                                        <label htmlFor="departDate"> Depart: <input type="date" id="departDate"
                                                                                    name="departDate"
                                                                                    placeholder="mm/dd/yyyy"
                                                                                    pattern="\d{4}-\d{2}-\d{2}"
                                                                                    className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                                    onChange={handleChange}
                                                                                    required/> </label>
                                    </div>
                                    <div className="inline-block px-2 invisible" id="returnDiv">
                                        <label htmlFor="returnDate"> Return: <input type="date" id="returnDate"
                                                                                    name="returnDate"
                                                                                    placeholder="mm/dd/yyyy"
                                                                                    pattern="\d{4}-\d{2}-\d{2}"
                                                                                    className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                                    onChange={handleChange}
                                                                                    required/> </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button id="submit"
                                        className="py-2 px-6 bg-[#7E4181] text-white rounded-md  active:border-[#a16aa3] active:bg-[#a16aa3] cursor-pointer"
                                        onClick={handleSubmit}> Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {(responseData && username) && <Table data={responseData}/>}

            </div>
        </section>
    )
}

export default Homepage;