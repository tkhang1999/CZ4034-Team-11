import React, { useEffect, useState } from "react";
import CountUp from 'react-countup';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, FormControl, Select, InputLabel, MenuItem, Paper } from '@material-ui/core';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Countries } from "../constants/Countries";

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const asianMarkers = [
    {
        markerOffset: 20,
        name: "Surabaya",
        coordinates: [112.7521, 7.2575]
    },
    { markerOffset: 15, name: "Jakarta", coordinates: [106.8456, 6.2088] },
    { markerOffset: 15, name: "Bali", coordinates: [115.0920, 8.3405] },
]

export default function Search() {
    const [filter, setFilter] = useState(0);
    const [country, setCountry] = useState(0);
    const classes = useStyles();

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    }

    let countryList = []
    for (const [key, value] of Object.entries(Countries)) {
        countryList.push(key);
    }

    return (
        <div className={classes.page}>
            <CountUp end={10000} duration={3} style={{ fontSize: 150, lineHeight: 1 }} separator="," />
            <Typography variant="h5" gutterBottom>
                toxic tweets in the United States
            </Typography>
            <div className={classes.formControl}>
                <FormControl variant="outlined" style={{ flex: 1, marginRight: 5, }}>
                    <InputLabel id="demo-simple-select-outlined-label">Countries</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={country}
                        onChange={handleCountryChange}
                        label="Countries"
                    >
                        <MenuItem value={0}>
                            <em>None</em>
                        </MenuItem>
                        {countryList.map((c, i) => (
                            <MenuItem value={i + 1}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ flex: 1, marginLeft: 5, }}>
                    <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={filter}
                        onChange={handleChange}
                        label="Filter"
                    >
                        <MenuItem value={0}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Toxic</MenuItem>
                        <MenuItem value={2}>Severe Toxic</MenuItem>
                        <MenuItem value={3}>Subjectivity</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div style={{ width: window.innerWidth * 0.5 }}>
                <ComposableMap>
                    <Geographies
                        geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => <Geography
                                key={geo.rsmKey} geography={geo}
                                fill="#EAEAEC"
                                stroke="#D6D6DA" />)
                        }
                    </Geographies>
                    {asianMarkers.map(({ name, coordinates, markerOffset }) => (
                        <Marker key={name} coordinates={coordinates}>
                            <g
                                fill="none"
                                stroke="#FF5533"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                transform="translate(-12, -24)"
                            >
                                <circle cx="12" cy="10" r="3" />
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                            </g>
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        </div >)
}

const useStyles = makeStyles((theme) => ({
    page: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    table: {
        width: window.innerWidth - 100,
        margin: 50,
        marginBottom: 0,
        maxHeight: 440,
    },
    searchInput: {
        marginBottom: 20,
        marginTop: 50,
        marginLeft: 50,
        marginRight: 50,
        backgroundColor: "#FFFFFF",
    },
    button: {
        marginLeft: 20,
        marginRight: 20,
        width: 200,
    },
    pagination: {
        display: "flex",
        paddingRight: 50,
        padding: 20,
        justifyContent: "flex-end"
    },
    icon: {
        paddingLeft: 30,
    },
    text: {
        padding: 20,
        textAlign: "center",
    },
    formControl: {
        display: "flex",
        justifyContent: "space-between",
        width: window.innerWidth - 100,
        marginTop: 20,
        marginBottom: 20,
    },
}));