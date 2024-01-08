// @ts-nocheck
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React from 'react';
import { MemoryRouter as Router, Route, NavLink, Routes, Outlet, Link } from 'react-router-dom';
import { ParentSize } from '@visx/responsive';
import Tree from './Tree';
import ComponentMap from './ComponentMap/ComponentMap';
import { changeView, changeSlider } from '../../slices/mainSlice';
import { useSelector } from 'react-redux';
import PerformanceVisx from './PerformanceVisx/PerformanceVisx';
// import WebMetrics from '../WebMetrics';
import WebMetricsContainer from '../WebMetricsContainer';
import { MainState, RootState, StateRouteProps } from '../../FrontendTypes';

/*
  Loads the appropriate StateRoute view and renders the Map, Performance, History, Webmetrics, and Tree navbar buttons after clicking on the 'State' button located near the top rightmost corner.
*/

const History = require('./History').default;
const NO_STATE_MSG = 'No state change detected. Trigger an event to change state'; // message to be returned if there has been no state change detected in our hooked/target app

const StateRoute = (props: StateRouteProps) => {
  const {
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    hierarchy: propsHierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    viewIndex: propsViewIndex, // from 'tabs[currentTab]' object in 'MainContainer'
    webMetrics, // from 'tabs[currentTab]' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
  } = props;

  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);
  const { hierarchy: tabsHierarchy, sliderIndex, viewIndex: tabsViewIndex } = tabs[currentTab];
  const hierarchy = propsHierarchy || tabsHierarchy; //JR: RETURN TO THIS: alias to deconstruct from props and tab with the same name, aliases were deleted above
  const viewIndex = propsViewIndex || tabsViewIndex;

  return (
    <div className='app-body'>
      <div className='navbar'>
        <NavLink to='/' className='router-link map-tab' end>
          Map
        </NavLink>
        <Link className='router-link performance-tab' to='/performance'>
          Performance
        </Link>
        <NavLink className='router-link history-tab' to='/history'>
          History
        </NavLink>
        <NavLink className='router-link web-metrics-tab' to='/webMetrics'>
          Web Metrics
        </NavLink>
        <NavLink className='router-link tree-tab' to='/tree'>
          Tree
        </NavLink>
      </div>
      <div className='app-content'>
        <Routes>
          <Route
            path='/history'
            element={
              hierarchy ? (
                <ParentSize>
                  {({ width, height }) => (
                    <History
                      width={width}
                      height={height}
                      hierarchy={hierarchy}
                      // Commented out dispatch that was prop drilled as conversion to RTK might invalidate need for prop drilling to access dispatch
                      // dispatch={dispatch}
                      sliderIndex={sliderIndex}
                      viewIndex={viewIndex}
                      currLocation={currLocation}
                      snapshots={snapshots}
                    />
                  )}
                </ParentSize>
              ) : (
                <div className='noState'>{NO_STATE_MSG}</div>
              )
            }
          />
          <Route
            path='/performance/*'
            element={
              hierarchy ? (
                <div style={{ height: '100%' }}>
                  <ParentSize className='performanceContainer'>
                    {({ width, height }) => (
                      <PerformanceVisx
                        width={width}
                        height={height}
                        snapshots={snapshots}
                        // note: is propdrilled within Performance Visx, but doesn't seem to be used
                        changeSlider={changeSlider}
                        changeView={changeView}
                        hierarchy={hierarchy}
                      />
                    )}
                  </ParentSize>
                  <Outlet />
                </div>
              ) : (
                <div className='noState'>{NO_STATE_MSG}</div>
              )
            }
          />
          <Route path='/webMetrics' element={<WebMetricsContainer webMetrics={webMetrics} />} />
          <Route
            path='/tree'
            element={<Tree snapshot={snapshot} snapshots={snapshots} currLocation={currLocation} />}
          />
          <Route
            path='*'
            element={
              hierarchy ? (
                <ParentSize className='componentMapContainer'>
                  {({ width, height }) => {
                    // eslint-disable-next-line react/prop-types
                    const maxHeight: number = 1200;
                    const h = Math.min(height, maxHeight);
                    return (
                      <ComponentMap
                        currentSnapshot={currLocation.stateSnapshot}
                        width={width}
                        height={h}
                      />
                    );
                  }}
                </ParentSize>
              ) : null
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default StateRoute;
