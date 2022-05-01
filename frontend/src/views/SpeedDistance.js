import React, { useEffect, useState } from "react"
import "../App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Telemetry } from "../Components/Telemetry"
import { Row, Col } from "react-bootstrap"
import Box from "@mui/material/Box"
import {
    LineChart,
    Label,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Brush,
} from "recharts"
import moment from "moment"

const getYAxis = (dataKey, value) => {
    if (dataKey === "Speed") {
        return (
            <span style={{ color: "#" }}>
                {dataKey}: {value} km/h
            </span>
        )
    } else if (dataKey === "nGear") {
        return (
            <span style={{ color: "#" }}>
                {dataKey}: {value}
            </span>
        )
    } else if (dataKey === "Throttle") {
        return (
            <span style={{ color: "#" }}>
                {dataKey}: {value}%
            </span>
        )
    } else {
        return (
            <span style={{ color: "#" }}>
                {dataKey}: {value}
            </span>
        )
    }
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        console.log(payload[0])
        return (
            <div
                className="custom-tooltip"
                style={{
                    color: "white",
                    fontFamily: "Montserrat",
                    fontWeight: 300,
                    border: "1px solid",
                    borderRadius: "7px",
                    padding: "15px",
                }}
            >
                <p className="label" style={{ fontWeight: "normal" }}>
                    {`Distance:`} {Math.round(`${label}`)}
                </p>
                <p className="label">
                    <span style={{ color: `${payload[0].color}` }}>
                        {`${payload[0].name} `}
                    </span>
                    {getYAxis(`${payload[0].dataKey}`, `${payload[0].value}`)}
                    {/* {` ${payload[0].dataKey}: ${payload[0].value} km/h`} */}
                </p>
            </div>
        )
    }

    return null
}
let renderLabel = function (entry) {
    return entry
}

export const SpeedDistance = () => {
    const [currentChartData, setCurrentChartData] = useState([])
    // const [opacity, setOpacity] = useState({ HAM: 1, ALO: 1, LAT: 1 })

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/speed_distance")
            .then((res) => res.json())
            .then((data) => {
                console.log("speed distance data: ", data)
                setCurrentChartData(data)
            })
    }, [])
    // const handleMouseEnter = (o) => {
    //     const { dataKey } = o
    //     setOpacity({ ...opacity, [dataKey]: 0.5 })
    // }

    // const handleMouseLeave = (o) => {
    //     const { dataKey } = o
    //     setOpacity({ ...opacity, [dataKey]: 1 })
    // }
    return (
        <Box>
            <h3
                style={{
                    color: "#8a9c9b",
                    alignSelf: "left",
                    // marginTop: 50,
                }}
            >
                Fastest Lap Telemetry Analysis
            </h3>
            {/* <div className="responsive"> */}
            <div className="responsive-container">
                {/* <Telemetry
                    currentChartData={currentChartData}
                    CustomTooltip={CustomTooltip}
                /> */}
                <ResponsiveContainer width={"100%"} height={"70%"}>
                    <LineChart
                        width={1000}
                        height={400}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 30,
                            bottom: 5,
                        }}
                    >
                        {Object.keys(currentChartData).map((key, index) => {
                            const data = currentChartData[key]
                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    data={data}
                                    Label
                                    dataKey="Speed"
                                    dot={false}
                                    stroke={data[0].color}
                                    label={key}
                                    name={key}
                                    // stroke={currentChartData.HAM.color}
                                    // strokeOpacity={opacity.HAM}
                                    // active_dot={{ r: 8 }}
                                >
                                    {key}
                                </Line>
                            )
                        })}
                        <XAxis
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            domain={["auto", "auto"]}
                            name="Speed"
                            type="number"
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width={"100%"} height={"70%"}>
                    <LineChart
                        width={1000}
                        height={400}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 30,
                            bottom: 5,
                        }}
                    >
                        {Object.keys(currentChartData).map((key, index) => {
                            const data = currentChartData[key]
                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    data={data}
                                    Label
                                    dataKey="nGear"
                                    dot={false}
                                    stroke={data[0].color}
                                    label={key}
                                    name={key}
                                    // stroke={currentChartData.HAM.color}
                                    // strokeOpacity={opacity.HAM}
                                    // active_dot={{ r: 8 }}
                                >
                                    {key}
                                </Line>
                            )
                        })}
                        <XAxis
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            domain={["auto", "auto"]}
                            name="nGear"
                            type="number"
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer width={"100%"} height={"70%"}>
                    <LineChart
                        width={1000}
                        height={400}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 30,
                            bottom: 5,
                        }}
                    >
                        {Object.keys(currentChartData).map((key, index) => {
                            const data = currentChartData[key]
                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    data={data}
                                    Label
                                    dataKey="Throttle"
                                    dot={false}
                                    stroke={data[0].color}
                                    label={key}
                                    name={key}
                                    // stroke={currentChartData.HAM.color}
                                    // strokeOpacity={opacity.HAM}
                                    // active_dot={{ r: 8 }}
                                >
                                    {key}
                                </Line>
                            )
                        })}
                        <XAxis
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            domain={["auto", "auto"]}
                            name="nGear"
                            type="number"
                        />
                        <Tooltip content={CustomTooltip} />
                        <Legend
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer width={"100%"} height={"70%"}>
                    <LineChart
                        width={1000}
                        height={400}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 30,
                            bottom: 5,
                        }}
                    >
                        {Object.keys(currentChartData).map((key, index) => {
                            const data = currentChartData[key]
                            return (
                                <Line
                                    key={key}
                                    type="monotone"
                                    data={data}
                                    Label
                                    dataKey="Brake"
                                    dot={false}
                                    stroke={data[0].color}
                                    label={key}
                                    name={key}
                                    // stroke={currentChartData.HAM.color}
                                    // strokeOpacity={opacity.HAM}
                                    // active_dot={{ r: 8 }}
                                >
                                    {key}
                                </Line>
                            )
                        })}
                        <XAxis
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            domain={["auto", "auto"]}
                            name="nGear"
                            type="number"
                        />
                        <Tooltip content={CustomTooltip} />
                        <Brush
                            // tickFormatter={xAxisTickFormatter}
                            dataKey="LapNumber"
                            height={30}
                        />
                        <Legend
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* </div> */}
        </Box>
    )
}
