import React, { useEffect, useState } from "react"
import "../App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import Box from "@mui/material/Box"
import ListItemText from "@material-ui/core/ListItemText"
import OutlinedInput from "@mui/material/OutlinedInput"
import Chip from "@mui/material/Chip"
import { orange } from "@mui/material/colors"
import { SelectionForm } from "../Components/SelectionForm"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}
const outerTheme = createTheme({
    palette: {
        secondary: {
            main: orange[500],
        },
    },
})

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    }
}

export const DropdownPage = () => {
    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState()

    const [races, setRaces] = useState([])
    const [selectedRace, setSelectedRace] = useState()

    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState()

    const [drivers, setDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState([])

    const theme = useTheme()

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/getyear", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setYears(data)
            })
    }, [])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/getrace", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setRaces(data)
            })
    }, [])
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/getevent", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setEvents(data)
            })
    }, [])
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/getdriver", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setDrivers(data)
            })
    }, [])

    useEffect(() => {
        if (selectedYear) {
            fetch("http://127.0.0.1:5000/api/selectyear", {
                method: "POST",
                body: JSON.stringify(selectedYear),
                headers: { "content-type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) return Promise.reject(res)
                    return res.json()
                })
                .then((data) => {
                    getLatestRace()
                })
                .catch(console.error)
        }
    }, [selectedYear])

    useEffect(() => {
        if (selectedRace) {
            fetch("http://127.0.0.1:5000/api/selectrace", {
                method: "POST",
                body: JSON.stringify(selectedRace),
                headers: { "content-type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) return Promise.reject(res)
                    return res.json()
                })
                .then((data) => {
                    getLatestEvent()
                })
                .catch(console.error)
        }
    }, [selectedRace])

    useEffect(() => {
        if (selectedEvent) {
            fetch("http://127.0.0.1:5000/api/selectevent", {
                method: "POST",
                body: JSON.stringify(selectedEvent),
                headers: { "content-type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) return Promise.reject(res)
                    return res.json()
                })
                .then((data) => {
                    getLatestDriver()
                })
                .catch(console.error)
        }
    }, [selectedEvent])

    // const SelectionComplete = ({selectedDriver}) => {
    useEffect(() => {
        if (selectedDriver) {
            fetch("http://127.0.0.1:5000/api/selectdriver", {
                method: "POST",
                body: JSON.stringify(selectedDriver),
                headers: { "content-type": "application/json" },
            })
                .then((res) => {
                    if (!res.ok) return Promise.reject(res)
                    return res.json()
                })
                // .then((data) => {})
                .catch(console.error)
        }
    }, [selectedDriver])
    // return selectedDriver}

    const handleDropdownSelectYear = (e) => {
        setSelectedYear(e.target.value)
    }
    const handleDropdownSelectRace = (e) => {
        setSelectedRace(e.target.value)
    }
    const handleDropdownSelectEvent = (e) => {
        setSelectedEvent(e.target.value)
    }
    const handleDropdownSelectDriver = (e) => {
        const values = [...e.target.selectedOptions].map((opt) => opt.value)
        console.log(values)
        setSelectedDriver(values)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setSelectedDriver(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        )
    }
    const getLatestRace = () => {
        fetch("http://127.0.0.1:5000/api/getrace")
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then((response) => setRaces(response))
    }
    const getLatestEvent = () => {
        fetch("http://127.0.0.1:5000/api/getevent")
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then((response) => setEvents(response))
    }
    const getLatestDriver = () => {
        fetch("http://127.0.0.1:5000/api/getdriver")
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then((response) => setDrivers(response))
    }

    return (
        <div>
            <Box
                sx={{
                    paddingBottom: 5,
                }}
            >
                <SelectionForm
                    selection={selectedYear}
                    data={years}
                    handleDropdown={handleDropdownSelectYear}
                    input="Year"
                />
                <SelectionForm
                    selection={selectedRace}
                    data={races}
                    handleDropdown={handleDropdownSelectRace}
                    input="Circuit"
                />
                <SelectionForm
                    selection={selectedEvent}
                    data={events}
                    handleDropdown={handleDropdownSelectEvent}
                    input="Session"
                />

                {/* <FormControl sx={{ m: 1, minWidth: 220 }}>
                    <InputLabel id="demo-multiple-chip-label">
                        Driver
                    </InputLabel>
                    <Select
                        multiple
                        value={selectedDriver}
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        label="Age"
                        // onChange={handleDropdownSelectDriver}
                        onChange={handleChange}
                        input={
                            <OutlinedInput
                                id="select-multiple-chip"
                                label="Chip"
                            />
                        }
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {drivers.map((driver) => (
                            <MenuItem
                                value={driver.content}
                                key={driver.id}
                                style={getStyles(
                                    driver.content,
                                    selectedDriver,
                                    theme
                                )}
                            >
                                {driver.content}
                                <ListItemText primary={driver} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
                <div>
                    <select onChange={handleDropdownSelectDriver} multiple>
                        <option value="">Select Drivers</option>
                        {drivers.map((event) => (
                            <option key={event.id}>{event.content}</option>
                        ))}
                    </select>
                </div>
            </Box>
        </div>
    )
}

// export default SelectionComplete
