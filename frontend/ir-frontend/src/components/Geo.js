import React, { useEffect, useState } from "react";
import CountUp from 'react-countup';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Countries } from "../constants/Countries";

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


export default function Search() {
    const markerOffset = 15;
    const [filter, setFilter] = useState(0);
    const [country, setCountry] = useState(0);
    const [data, setData] = useState(null);
    const [markers, setMarkers] = useState([{}])
    const classes = useStyles();

    useEffect(() => {
        if (country != 0) {
            onCountrySelect();
        }
    }, [country, filter])

    function createData(name, user_geo) {
        let elements = "";
        let long = 0.0;
        let lat = 0.0;
        elements = user_geo[0].slice(1, -1).split(",");
        lat = parseFloat(elements[0]);
        long = parseFloat(elements[1]);
        return { name, long, lat }
    }

    function clearMarkers() {
        console.log("HERE: clearMarkers")
        console.log(markers)
        if (markers != null && markers.length == 0) {
            console.log("HERE: already 0")
            return;
        }
        while (markers.length > 0) {
            markers.pop()
        }
        console.log(markers)
        // setMarkers(markers)
        console.log("HERE: should be 0")
        renderEmptyMap();
    }

    const onCountrySelect = async () => {
        let user_location = "";
        let data = "";
        if (country != 0) {
            user_location = countryList[country - 1].replace(" ", "%20")
            data = await axios.get(`/solr/toxictweets/select?q=user_location:"${user_location}"&rows=100000`);
            console.log(data);
            setData(data.data.response.docs);
        }
    }

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    const handleCountryChange = (event) => {
        // renderEmptyMap();
        setCountry(event.target.value);
        onCountrySelect();
        // setMarkers(markers);
    }

    // const handleGoTo = (locationIndex) => () => {
    //     const location = locations[locationIndex];
    //     setLocation(location);
    // };

    let countryList = []
    for (const [key, value] of Object.entries(Countries)) {
        countryList.push(key);
    }

    const renderMarker = () => {
        if (data == null) {
            return null;
        }

        if (country == 0) {
            return renderEmptyMap();
        }

        const rows = data.map(item => {
            return createData(countryList[country - 1], item.user_geo)
        });
        // let markers = []

        console.log("HERE: renderMarker");
        // console.log(markers.length)
        console.log(markers)
        console.log("HERE: renderMarker - adding things")

        var i;
        for (i = 0; i < rows.length; i++) {
            console.log(rows[0]['name']);
            markers.push({
                markerOffset: markerOffset,
                name: rows[i]['name'],
                coordinates: [rows[i]['long'], rows[i]['lat']]
            })
        }

        // console.log(markers.length)
        console.log(markers)
        // setMarkers(markers)

        return (
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
                {markers.map(({ name, coordinates, markerOffset }) => (
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
            </ComposableMap>);
    }

    const renderEmptyMap = () => {
        console.log("HERE: renderEmptyMap");
        return (
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
            </ComposableMap>);
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
                {clearMarkers()}
                {country ? renderMarker() : renderEmptyMap()}
            </div>
        </div >)
}

const useStyles = makeStyles((theme) => ({
    page: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    formControl: {
        display: "flex",
        justifyContent: "space-between",
        width: window.innerWidth - 100,
        marginTop: 20,
        marginBottom: 20,
    },
}));