import React, { useState } from "react";
import './App.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Tab, Tabs, AppBar, Toolbar, CssBaseline, useScrollTrigger } from '@material-ui/core';
import SwipeableViews from "react-swipeable-views";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import Search from "./components/Search";
import Geo from "./components/Geo";
import TabPanel from "./components/TabPanel";

//Handles sticky header
function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function App(props) {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const classes = useStyles();

  const handleChangeTabs = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar style={{backgroundColor: "black"}}>
          <Toolbar>
            <Typography variant="h6">Welcome</Typography>
          </Toolbar>
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
          </Paper>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Search />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Geo />
        </TabPanel>
      </SwipeableViews>
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
    marginTop: 30,
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