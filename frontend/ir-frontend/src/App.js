import React, { useState } from "react";
import './App.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Box, Tab, Tabs } from '@material-ui/core';
import SwipeableViews from "react-swipeable-views";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import Search from "./components/Search";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function App() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const classes = useStyles();

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.page}>
      <Box
        boxShadow={3}
        className={classes.header}
      >
        Welcome
      </Box>
      <Paper style={{ width: "100%" }}>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTabs}
          aria-label="disabled tabs example"
          variant="fullWidth"
        >
          <Tab label="Search" />
          <Tab label="Map" />
        </Tabs>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Search />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
        </TabPanel>
        </SwipeableViews>
      </Paper>
    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  header: {
    height: 300,
    width: "100%",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize: 200,
    fontStyle: "bold",
    textJustify: "center",
    textAlign: "center",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
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