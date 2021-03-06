import React, { useEffect, useState } from "react"
import "../App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Telemetry } from "../Components/Telemetry"
import { Row, Col } from "react-bootstrap"
import Background from "../images/tex.jpeg"
import Box from "@mui/material/Box"
import {
    LineChart,
    Label,
    Scatter,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    ScatterChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Brush,
    ZAxis,
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
        // console.log(payload[1])
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
                    backgroundColor: "rgba(21,17,4,0.8)",
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
                    <br></br>
                    <span style={{ color: `${payload[1].color}` }}>
                        {`${payload[1].name} `}
                    </span>
                    {getYAxis(`${payload[1].dataKey}`, `${payload[1].value}`)}
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
    const [currentRace, setCurrentRace] = useState([])
    // const [opacity, setOpacity] = useState({ HAM: 1, ALO: 1, LAT: 1 })

    useEffect(() => {
        fetch("http://127.0.0.1:5000/formula/speed_distance")
            .then((res) => res.json())
            .then((data) => {
                // console.log("speed distance data: ", data)
                setCurrentChartData(data[1])
                setCurrentRace(data[0])
            })
    }, [])
    const renderLabel = function (entry) {
        return entry.name
    }
    // const handleMouseEnter = (o) => {
    //     const { dataKey } = o
    //     setOpacity({ ...opacity, [dataKey]: 0.5 })
    // }

    // const handleMouseLeave = (o) => {
    //     const { dataKey } = o
    //     setOpacity({ ...opacity, [dataKey]: 1 })
    // }
    return (
        <Box
            style={{
                backgroundImage: `url(${Background})`,
                height: "220vh",
                backgroundSize: "150px 150px",
            }}
        >
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
            <div
                className="responsive-container"
                style={{ position: "relative" }}
            >
                <ResponsiveContainer width={"70%"} height={"70%"}>
                    <ScatterChart
                        width={600}
                        height={600}
                        // syncId="anyId"
                        data={
                            currentChartData[Object.keys(currentChartData)[0]]
                        }
                        margin={{
                            top: 35,
                            right: 30,
                            left: 30,
                            bottom: 45,
                        }}
                    >
                        <XAxis
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                            type="number"
                            dataKey="X"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                            domain={["auto", "auto"]}
                            dataKey="Y"
                        />
                        <ZAxis range={[10, 10]} />
                        {currentChartData[Object.keys(currentChartData)[0]] ? (
                            <Scatter>
                                {currentChartData[
                                    Object.keys(currentChartData)[0]
                                ].map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.trackColor}
                                    />
                                ))}
                            </Scatter>
                        ) : (
                            <>Not Found</>
                        )}
                        {/* <Legend /> */}
                    </ScatterChart>
                </ResponsiveContainer>
                <div
                    style={{
                        position: "absolute",
                        left: "67vw",
                        top: "15vh",
                    }}
                >
                    <p
                        style={{
                            color: "#8a9c9b",
                            fontSize: "25px",
                            fontWeight: "600",
                        }}
                    >
                        {currentRace}
                    </p>
                    <p
                        style={{
                            color: "#8a9c9b",
                            fontSize: "15px",
                            fontWeight: "400",
                        }}
                    >
                        Fastest sections of the track by driver color.
                    </p>
                </div>

                <ResponsiveContainer width={"100%"} height={"70%"}>
                    <LineChart
                        width={1000}
                        height={400}
                        syncId="anyId"
                        margin={{
                            top: 35,
                            right: 30,
                            left: 30,
                            bottom: 45,
                        }}
                        // label="Speed"
                        // label={renderLabel}
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
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={["auto", "auto"]}
                            name="Speed"
                            type="number"
                        />
                        <Tooltip
                            content={CustomTooltip}
                            // key={currentRace}
                        />
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
                        syncId="anyId"
                        margin={{
                            top: 35,
                            right: 30,
                            left: 30,
                            bottom: 45,
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
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
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
                        syncId="anyId"
                        margin={{
                            top: 35,
                            right: 30,
                            left: 30,
                            bottom: 45,
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
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
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
                        syncId="anyId"
                        margin={{
                            top: 35,
                            right: 30,
                            left: 30,
                            bottom: 45,
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
                            axisLine={false}
                            tickLine={false}
                            type="number"
                            dataKey="Distance"
                            domain={["auto", "auto"]}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
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
