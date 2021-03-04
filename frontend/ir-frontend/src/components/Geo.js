import React, { useEffect, useState } from "react";
import CountUp from 'react-countup';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, FormControl, Select, InputLabel, MenuItem, List, ListItem, Divider, ListItemText, CircularProgress, Chip } from '@material-ui/core';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Countries } from "../constants/Countries";

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const subjectivityFilterList = ["", "Neutral", "Subjective"]
const toxicityFilterList = ["", "Toxic", "Severe Toxic", "Non Toxic"]

const columnDict = {
    toxicity: "T",
    subjectivity: "S",
}

export default function Search() {
    const markerOffset = 15;
    const [subjectivityFilter, setSubjectivityFilter] = useState(0);
    const [toxicityFilter, setToxicityFilter] = useState(0);
    const [country, setCountry] = useState(0);
    const [markers, setMarkers] = useState([])
    const [count, setCount] = useState(0);
    const [tweets, setTweets] = useState(null);
    const [page, setPage] = useState(0);
    const [mapGeo, setMapGeo] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        onCountrySelect();
    }, [country, subjectivityFilter, toxicityFilter, page]);

    useEffect(() => {
        handleMapMarker();
    }, [country, subjectivityFilter, toxicityFilter])

    function createData(name, user_geo) {
        let long = 0.0;
        let lat = 0.0;
        lat = user_geo[0]
        long = user_geo[1]
        return { name, long, lat }
    }

    const onCountrySelect = async () => {
        let user_location = "";
        let response = "";
        //put the switch case here and append it to the query params below
        let queryparams = "";
        switch (subjectivityFilter) {
            case 1:
                queryparams = "&fq=subjectivity:0";
                break;
            case 2:
                queryparams = "&fq=subjectivity:1";
                break;
            default:
                queryparams = "";
        }

        switch (toxicityFilter) {
            case 1:
                queryparams += "&fq=toxicity:1"
                break;
            case 2:
                queryparams += "&fq=toxicity:2"
                break;
            case 3:
                queryparams += "&fq=toxicity:0"
                break;
        }
        if (country !== 0) {
            user_location = "'" + countryList[country - 1].replace(" ", "%20") + "'";
        } else {
            user_location = "*";
            // setCount(0);
        }

        response = await axios.get(`/solr/toxictweets/select?q=user_location:${user_location}&rows=10&start=${page * 10}${queryparams}`);
        setCount(response.data.response.numFound);
        setTweets(response.data.response.docs);
    }

    const handleMapMarker = async () => {
        let queryparams = "";
        let user_location = "";
        setMarkers([])
        switch (subjectivityFilter) {
            case 1:
                queryparams = "&fq=subjectivity:0";
                break;
            case 2:
                queryparams = "&fq=subjectivity:1";
                break;
            default:
                queryparams = "";
        }

        switch (toxicityFilter) {
            case 1:
                queryparams += "&fq=toxicity:1"
                break;
            case 2:
                queryparams += "&fq=toxicity:2"
                break;
            case 3:
                queryparams += "&fq=toxicity:0"
                break;
        }
        if (country !== 0) {
            user_location = "'" + countryList[country - 1].replace(" ", "%20") + "'";
        } else {
            user_location = "*";
            // setCount(0);
        }
        const geo = await axios.get(`/solr/toxictweets/select?fl=user_geo&q=tweet:*&rows=20000&user_location:${user_location}${queryparams}`);
        setMapGeo(geo.data.response.docs);
        const rows = geo.data.response.docs.map(item => {
            return createData(countryList[country - 1], item.user_geo)
        });
        let newMarkers = [];
        var i;
        for (i = 0; i < rows.length; i++) {
            newMarkers.push({
                markerOffset: markerOffset,
                name: rows[i]['name'],
                coordinates: [rows[i]['long'], rows[i]['lat']]
            })
        }
        setMarkers(newMarkers);
    }

    const handleSubjectivityChange = (event) => {
        setSubjectivityFilter(event.target.value);
    };

    const handleToxicityChange = (event) => {
        setToxicityFilter(event.target.value);
    };

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    }

    let countryList = []
    for (const [key, value] of Object.entries(Countries)) {
        countryList.push(key);
    }

    const renderMarker = () => {
        return markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
                <g
                    fill="none"
                    stroke="#3F51B5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-12, -24)"
                >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </g>
            </Marker>
        ));
    }

    const renderCaption = () => {
        let text = ""
        if (toxicityFilter !== 0 && subjectivityFilter != 0) {
            text = `${subjectivityFilterList[subjectivityFilter]}, ${toxicityFilterList[toxicityFilter]}`
        } else {
            text = `${subjectivityFilterList[subjectivityFilter]}${toxicityFilterList[toxicityFilter]}`
        }

        if (country !== 0) {
            return (<Typography variant="h5" gutterBottom>
                {text} tweets in the {countryList[country - 1]}
            </Typography>)
        }
        return (<Typography variant="h5" gutterBottom>
            {text} tweets in our database
        </Typography>)
    }

    const renderTweetList = () => {
        console.log(tweets);
        if (tweets == null) {
            return null;
        }

        return tweets.map(t => (
            <div>
                <ListItem alignItems="flex-start" style={{ flexDirection: "column" }}>
                    <ListItemText
                        primary={t.tweet}
                    />

                    <div style={{ display: "flex" }}>
                        {renderStatusIcon(columnDict.toxicity, t.toxicity)}
                        {renderStatusIcon(columnDict.subjectivity, t.subjectivity)}
                    </div>

                </ListItem>
                <Divider />
            </div>
        ))
    }

    const renderArrowLeft = () => {
        if (page == 0) {
            return (
                <div className={classes.icon} style={{ color: "white" }}>
                    <ChevronLeft />
                </div>);
        }
        return (<div className={classes.icon} onClick={() => setPage(page - 1)}>
            <ChevronLeft />
        </div>)
    }

    const renderArrowRight = () => {
        if (count < 10) {
            return (
                <div className={classes.icon} style={{ color: "white" }}>
                    <ChevronRight />
                </div>);
        }
        return (<div className={classes.icon} onClick={() => setPage(page + 1)}>
            <ChevronRight />
        </div>);
    }

    const renderStatusIcon = (col, value) => {
        switch (col) {
            case columnDict.toxicity:
                if (value == 0) {
                    return (
                        <div style={{ margin: 5 }}>
                            <Chip
                                label="Non Toxic"
                                color="secondary"
                            />
                        </div>)
                }
                if (value == 1) {
                    return (
                        <div style={{ margin: 5 }}>
                            <Chip
                                label="Toxic"
                                color="secondary"
                            />
                        </div>)
                }
                if (value == 2) {
                    return (
                        <div style={{ margin: 5 }}>
                            <Chip
                                label="Severe Toxic"
                                color="secondary"
                            />
                        </div>)
                }
                break;
            case columnDict.subjectivity:
                if (value == 0) {
                    return (<div style={{ margin: 5 }}><Chip
                        label="Neutral"
                        color="primary"
                    /></div>)
                }
                else {
                    return (<div style={{ margin: 5 }}>
                        <Chip
                            label="Subjective"
                            color="primary"
                        />
                    </div>)
                }
        }
    }

    return (
        <div className={classes.page}>
            <CountUp end={count} duration={3} style={{ fontSize: 150, lineHeight: 1 }} separator="," />
            {renderCaption()}
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
                <FormControl variant="outlined" style={{ flex: 1, marginRight: 5, }}>
                    <InputLabel id="demo-simple-select-outlined-label">Subjectivity</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={subjectivityFilter}
                        onChange={handleSubjectivityChange}
                        label="Subjectivity"
                    >
                        <MenuItem value={0}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Neutral</MenuItem>
                        <MenuItem value={2}>Subjective</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ flex: 1, }}>
                    <InputLabel id="demo-simple-select-outlined-label">Toxicity</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={toxicityFilter}
                        onChange={handleToxicityChange}
                        label="Toxicity"
                    >
                        <MenuItem value={0}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Toxic</MenuItem>
                        <MenuItem value={2}>Severe Toxic</MenuItem>
                        <MenuItem value={3}>Non Toxic</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div style={{ display: "flex", }}>
                <div style={{ width: window.innerWidth * 0.5, marginRight: 20, }}>
                    <Typography variant="h3">Map</Typography>
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
                        {renderMarker()}
                    </ComposableMap>
                </div>
                <div>
                    <Typography variant="h3">Tweets</Typography>
                    <List className={classes.root}>
                        {renderTweetList()}
                    </List>
                    <div className={classes.pagination}>
                        Page: {page + 1}
                        {renderArrowLeft()}
                        {renderArrowRight()}
                    </div>
                </div>
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
    root: {
        width: window.innerWidth * 0.5 - 150,
        maxHeight: window.innerHeight - 400,
        overflow: "auto",
        backgroundColor: theme.palette.background.paper,
        marginTop: 20,
    },
    pagination: {
        display: "flex",
        paddingRight: 50,
        padding: 20,
        justifyContent: "flex-end"
    },
}));