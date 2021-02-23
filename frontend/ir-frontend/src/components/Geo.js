import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, Button, Select, InputLabel, MenuItem, Paper } from '@material-ui/core';
import { Search as SearchIcon, ChevronLeft, ChevronRight, Check, Clear } from '@material-ui/icons';

export default function Search() {
    return (<div>

    </div>);
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