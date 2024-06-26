// @ts-nocheck
import React, { useState } from 'react';
/* <Router> that keeps the history of your “URL” in memory (does not read/write to the address bar)
 Useful in tests and non-browser environments like React Native.
*/
import { MemoryRouter as Router, Route, NavLink, Routes, Outlet } from 'react-router-dom';
import StateRoute from '../components/StateRoute/StateRoute';
import DiffRoute from '../components/DiffRoute/DiffRoute';
import { StateContainerProps } from '../FrontendTypes';
import { Outlet } from 'react-router';
import HeatMapLegend from '../components/StateRoute/ComponentMap/heatMapLegend';

// eslint-disable-next-line react/prop-types
const StateContainer = (props: StateContainerProps): JSX.Element => {
  const {
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    viewIndex, // from 'tabs[currentTab]' object in 'MainContainer'
    webMetrics, // from 'tabs[currentTab]' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
    axSnapshots,// from 'tabs[currentTab]' object in 'MainContainer'
  } = props;

  return (
    <>
    <div className='state-container'>
      <div className='main-navbar-container'>
        <div className='main-navbar-text' />
        <div className='main-navbar'>
          <NavLink
            className={(navData) =>
              navData.isActive ? 'is-active main-router-link' : 'main-router-link'
            }
            to='/'
          >
            State
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive ? 'is-active main-router-link' : 'main-router-link'
            }
            to='/diff'
          >
            Diff
          </NavLink>
        </div>
      </div>
      <HeatMapLegend />
      <Routes>
        <Route
          path='/diff/*'
          element={
            <div>
              <DiffRoute snapshot={snapshot} />
              {/* <Outlet/> */}
            </div>
          }
        />
        <Route
          path='/*'
          element={
            <div style={{ height: '100%' }}>
              <StateRoute
                axSnapshots={axSnapshots}
                webMetrics={webMetrics}
                viewIndex={viewIndex}
                snapshot={snapshot}
                hierarchy={hierarchy}
                snapshots={snapshots}
                currLocation={currLocation}
              />
              {/* <Outlet/> */}
              {/* <HeatMapLegend /> */}
            </div>
          }
        />
      </Routes>
    </div>
    </>
  );
};

export default StateContainer;
