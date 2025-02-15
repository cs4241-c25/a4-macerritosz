import {useState} from "react";
import '../index.css'

function Homepage() {
    //useState to pass information to
    return (
        <section className="Homepage">
            <div className="App">
                <div className="App-header">
                    <div className="App-header__logo">
                        <h2> Track your Itinerary!</h2>
                    </div>
                    <div className="App-header__content">
                        <form>
                            <label> Add a new flight: </label>
                            <div>
                                <div>
                                    <input type="radio" name="flightType" id="r1" className="mr-2" checked="checked"
                                           value="One-Way" onChange="typeRoundTrip()"/>
                                    <label htmlFor="r1"> One Way </label>
                                    <input type="radio" name="flightType" id="r2" className="mr-2" value="Round-Trip"
                                           onChange="typeRoundTrip()"/>
                                    <label htmlFor="r2"> Round-Trip </label>
                                </div>
                                <div className="passenger options">
                                    <label htmlFor="numPassengers"> Passenger Count:</label>
                                    <select id="numPassengers" name="numPass" onChange="inputPassenger()"
                                            className="font-sans text-xl py-2 px-3 border-2 rounded-md border-[#7E4181]">
                                        <option value="1"> 1 Passenger</option>
                                        <option value="2"> 2 Passengers</option>
                                        <option value="3"> 3 Passengers</option>
                                        <option value="4"> 4 Passengers</option>
                                    </select>
                                </div>
                            </div>
                            <div className="PassengerList">
                                <div>
                                    <label htmlFor="passenger1">Your Name: </label>
                                    <input type="text" id="passenger1" name="passGroup" placeholder="Your name here"
                                           className="px-2 py-2 rounded-md border-2 border-[#7E4181]" required/>
                                </div>
                            </div>
                            <div className="Pairs">
                                <div className="city-Pair">
                                    <div id="city-pair-dept" className="inline-block px-4">
                                        <label htmlFor="cityDepart"> From: <input type="text" id="cityDepart"
                                                                                  placeholder="City or Airport"
                                                                                  className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                                  required/> </label>
                                    </div>
                                    <div id="city-pair-dest">
                                        <label htmlFor="cityDest"> To: <input type="text" id="cityDest"
                                                                              placeholder="City or Airport"
                                                                              className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                              required/> </label>
                                    </div>
                                </div>
                                <div className="date-Pair">
                                    <div>
                                        <label htmlFor="departDate"> Depart: <input type="date" id="departDate"
                                                                                    placeholder="mm/dd/yyyy"
                                                                                    pattern="\d{4}-\d{2}-\d{2}"
                                                                                    className="px-2 py-2 rounded-md border-2 border-[#7E4181]"
                                                                                    required/> </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button id="submit" className="py-2 px-6 bg-[#7E4181] text-white rounded-md"> Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Homepage;