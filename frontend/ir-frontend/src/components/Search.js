import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, Button, Select, InputLabel, MenuItem, Paper } from '@material-ui/core';
import { Search as SearchIcon, ChevronLeft, ChevronRight, Check, Clear } from '@material-ui/icons';

export default function Search() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (query != "") {
      onSearch();
    }
  }, [page, filter])

  function createData(id, tweet, link, toxic, severe_toxic, subjectivity) {
    return { id, tweet, link, toxic, severe_toxic, subjectivity };
  }

  const onSearch = async () => {
    let queryparams = "";
    switch (filter) {
      case 1:
        queryparams = "&fq=toxic:1";
        break;
      case 2:
        queryparams = "&fq=severe_toxic:1";
        break;
      case 3:
        queryparams = "&fq=subjectivity:1";
        break;
      default:
        queryparams = "";
    }
    const data = await axios.get(`/solr/toxictweets/select?q=tweet:${query}&rows=10&start=${page * 10}${queryparams}`);
    console.log("HELLO")
    console.log(data);
    setData(data.data.response.docs);
  }

  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setPage(0);
      onSearch();
    }
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
    if (data.length < 10) {
      return (
        <div className={classes.icon} style={{ color: "white" }}>
          <ChevronRight />
        </div>);
    }
    return (<div className={classes.icon} onClick={() => setPage(page + 1)}>
      <ChevronRight />
    </div>);
  }

  const renderWarning = () => {
    if (data.length == 0) {
      return <div className={classes.text}>No results</div>;
    }
  }

  const renderStatusIcon = ([bool]) => {
    if (bool) {
      return <div style={{ color: "green" }}>
        <Check />
      </div>
    }
    return <div style={{ color: "red" }}>
      <Clear />
    </div>
  }

  const renderTable = () => {
    if (data == null) {
      return null;
    }
    const rows = data.map(item => {
      return createData(item.id, item.tweet, item.link, item.toxic, item.severe_toxic, item.subjectivity);
    });

    return (
      <div>
        <TableContainer component={Paper} className={classes.table}>
          <Table stickyHeader aria-label="sticky table" >
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Tweet</TableCell>
                <TableCell align="center">URL</TableCell>
                <TableCell align="center">Toxic</TableCell>
                <TableCell align="center">Severe Toxic</TableCell>
                <TableCell align="center">Subjectivity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.tweet}</TableCell>
                  <TableCell align="left">{row.link}</TableCell>
                  <TableCell align="center">{renderStatusIcon(row.toxic)}</TableCell>
                  <TableCell align="center">{renderStatusIcon(row.severe_toxic)}</TableCell>
                  <TableCell align="center">{renderStatusIcon(row.subjectivity)}</TableCell>
                </TableRow>
              ))}</TableBody>
          </Table>
        </TableContainer>
        {renderWarning()}
        <div className={classes.pagination}>
          Page: {page + 1}
          {renderArrowLeft()}
          {renderArrowRight()}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.formControl}>
        <FormControl style={{ flex: 5, marginRight: 20 }}>
          <TextField id="outlined-basic" label="Type your search query here" variant="outlined" value={query} onChange={(event) => setQuery(event.target.value)} onKeyPress={handleKeyPress} />
        </FormControl>
        <FormControl variant="outlined" style={{ flex: 1 }}>
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
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<SearchIcon />}
        onClick={() => { setPage(0); onSearch(); }}
      >
        Search
      </Button>
      {renderTable()}
    </div>
  )
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