import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, Button, Select, InputLabel, MenuItem, Paper, Dialog, ListItem, ListItemText, List, DialogTitle } from '@material-ui/core';
import { Search as SearchIcon, ChevronLeft, ChevronRight, Check, Clear } from '@material-ui/icons';

export default function Search() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [subjectivityFilter, setSubjectivityFilter] = useState(0);
  const [toxicityFilter, setToxicityFilter] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (query != "") {
      onSearch();
    }
  }, [page, subjectivityFilter, toxicityFilter, searchToggle])

  function createData(id, tweet, link, toxic, severe_toxic, subjectivity) {
    return { id, tweet, link, toxic, severe_toxic, subjectivity };
  }

  const onSearch = async () => {
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
    const data = await axios.get(`/solr/toxictweets/select?q=tweet:${query}&rows=10&start=${page * 10}${queryparams}`);
    setData(data.data.response.docs);
    // console.log(data.data.spellcheck);
    if (data.data.spellcheck && data.data.spellcheck.suggestions[1] && data.data.spellcheck.suggestions[1].suggestion.length > 0) {
      setSuggestions(data.data.spellcheck.suggestions[1].suggestion);
    }
  }

  const handleToxicityChange = (event) => {
    setToxicityFilter(event.target.value);
  };

  const handleSubjectivityChange = (event) => {
    setSubjectivityFilter(event.target.value);
  }

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

  const handleListItemClick = (value) => {
    setQuery(value);
    setShowTooltip(false);
    setSuggestions(null);
    setSearchToggle(!searchToggle);
  };

  const renderDialog = () => {
    if (suggestions == null) {
      return null;
    }
    return (
      // <div classesName={classes.dialog}>
      <Dialog onClose={() => { setShowTooltip(false) }} aria-labelledby="simple-dialog-title" open={showTooltip} classes={{ paper: classes.dialog }} >
        <DialogTitle id="simple-dialog-title">More Suggestions</DialogTitle>
        <List>
          {suggestions.slice(1).map(s => (
            <ListItem button onClick={() => { handleListItemClick(s) }} key={s}>
              <ListItemText primary={s} />
            </ListItem>
          ))}
        </List>
      </Dialog >
      // </div>
    )
  }

  const renderSuggestions = () => {
    if (suggestions == null) {
      return;
    }

    if (suggestions.length > 0) {
      return (<p>Did you mean <i onClick={() => { handleListItemClick(suggestions[0]) }} style={{
        color: '#0000b2',
        cursor: 'pointer'
      }}>"{suggestions[0]}"</i> <b onClick={() => setShowTooltip(true)} style={{
        color: '#808080',
        cursor: 'pointer'
      }}>more</b></p>)
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.suggestionText}>
        {renderSuggestions()}
        {renderDialog()}
      </div>
      <div className={classes.formControl}>
        <FormControl style={{ flex: 5, marginRight: 20 }}>
          <TextField id="outlined-basic" label="Type your search query here" variant="outlined" value={query} onChange={(event) => setQuery(event.target.value)} onKeyPress={handleKeyPress} />
        </FormControl>
        <FormControl variant="outlined" style={{ flex: 1 }}>
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
        <FormControl variant="outlined" style={{ flex: 1, marginLeft: 20, }}>
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
    textAlight: "left",
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
  suggestionText: {
    width: "100%",
    display: "flex",
    justifyContent: "left",
    marginLeft: 100,
  },
  dialog: {
    position: 'absolute',
    left: 210,
    top: 120,
  }

}));