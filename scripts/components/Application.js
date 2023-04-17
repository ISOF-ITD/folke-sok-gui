import React, { useState, useEffect } from 'react';
import {
  useNavigate, useLoaderData, useParams, Outlet, Await,
} from 'react-router-dom';

import EventBus from 'eventbusjs';

import PropTypes from 'prop-types';
import MapView from './views/MapView';
import MapMenu from './MapMenu';
// import PlaceView from './views/PlaceView';
// import PersonView from './views/PersonView';
// import RecordView from './views/RecordView';
import RoutePopupWindow from './RoutePopupWindow';
import RecordListWrapper from './views/RecordListWrapper';
import StatisticsOverlay from './StatisticsOverlay';
import LocalLibraryView from '../../ISOF-React-modules/components/views/LocalLibraryView';
import ImageOverlay from '../../ISOF-React-modules/components/views/ImageOverlay';
import FeedbackOverlay from '../../ISOF-React-modules/components/views/FeedbackOverlay';
// import HelpOverlay from './../../ISOF-React-modules/components/views/HelpOverlay';
import ContributeInfoOverlay from '../../ISOF-React-modules/components/views/ContributeInfoOverlay';
import TranscriptionHelpOverlay from '../../ISOF-React-modules/components/views/TranscriptionHelpOverlay';
import TranscriptionOverlay from '../../ISOF-React-modules/components/views/TranscriptionOverlay';
import PopupNotificationMessage from '../../ISOF-React-modules/components/controls/PopupNotificationMessage';
import SwitcherHelpTextOverlay from './views/SwitcherHelpTextOverlay';
import TranscribeButton from '../../ISOF-React-modules/components/views/TranscribeButton';
// import RecordListWrapper from './views/RecordListWrapper';

import { createSearchRoute, createParamsFromSearchRoute } from '../utils/routeHelper';

import folkelogga from '../../img/folkelogga.svg';

import config from '../config';

import Lang from '../../ISOF-React-modules/lang/Lang';

const l = Lang.get;

export default function Application({ children, mode }) {
  Application.propTypes = {
    children: PropTypes.node.isRequired,
    mode: PropTypes.string,
  };

  Application.defaultProps = {
    // children: null,
    mode: 'material',
  };

  window.eventBus = EventBus;

  // const location = useLocation();
  // const match = useMatches();
  const navigate = useNavigate();
  const { results } = useLoaderData();
  const [mapData, setMapData] = useState(null);
  const [recordsData, setRecordsData] = useState({ data: [], metadata: { } });

  const params = useParams();

  // const [popupVisible, setPopupVisible] = useState(false);

  const mapMarkerClick = (placeId) => {
    let target = `/places/${(placeId)}${createSearchRoute(createParamsFromSearchRoute(params['*']))}`;
    if (mode === 'transcribe') {
      target = `/transcribe${target}`;
    }
    navigate(target);
  };

  // when results is resolved, set mapData and recordsData
  useEffect(() => {
    results.then((data) => {
      setMapData(data[0]);
      setRecordsData(data[1]);
    });
  }, [results]);

  const windowClickHandler = () => {
    window.eventBus.dispatch('screen-clicked');
  };

  // useEffect
  useEffect(() => {
    document.getElementById('app').addEventListener('click', windowClickHandler);
    document.title = config.siteTitle;

    setTimeout(() => {
      document.body.classList.add('app-initialized');
    }, 1000);

    // when results resolves, set mapData and recordsData
    results.then((data) => {
      setMapData(data[0]);
      setRecordsData(data[1]);
    });
  }, []);

  return (

    <div className="app" id="app">

      <RoutePopupWindow manuallyOpenPopup>
        <RecordListWrapper
          openButtonLabel="Visa sökträffar som lista"
          disableRouterPagination
          mode={mode}
        />
      </RoutePopupWindow>

      <Outlet />
      {
        children
      }

      <div className="intro-overlay">

        <div className="map-wrapper">

          <MapMenu
            mode={mode}
            params={params}
            recordsData={recordsData}
          />

          <div className="map-progress">
            <div className="indicator" />
          </div>
          <div className="map-bottom-wrapper">

            <div className="popup-wrapper">
              <TranscribeButton
                className="popup-open-button map-bottom-control map-floating-control visible"
                label={l('Skriv av slumpmässig uppteckning')}
                random
              />
            </div>
            <div className="popup-wrapper">
              <LocalLibraryView
                headerText={l('Mina sägner')}
              />
            </div>
          </div>

          <MapView
            onMarkerClick={mapMarkerClick}
            mode={mode}
            params={params}
            mapData={mapData}
          />
        </div>
      </div>
      {/* <div className="map-progress"><div className="indicator" /></div> */}

      <ImageOverlay />
      <FeedbackOverlay />
      <ContributeInfoOverlay />
      <TranscriptionOverlay />
      <TranscriptionHelpOverlay />
      <SwitcherHelpTextOverlay />
      <PopupNotificationMessage />
      <StatisticsOverlay />
      <footer>
        <div className="logo">
          <div id="Logo" className="isof-app-header">
            {/* Logo */}
            <a href="https://www.isof.se/arkiv-och-insamling/digitala-arkivtjanster/folke">
              <img
                alt="Folke på Institutet för språk och folkminnen"
                className="sv-noborder"
                style={{ maxWidth: 326, maxHeight: 50 }}
                src={folkelogga}
              />
            </a>
          </div>
          <div id="portal" className="isof-app-header">
            <a
              href="https://www.isof.se/arkiv-och-insamling/digitala-arkivtjanster/folke"
              target="_blank"
              className="normal"
              style={{ display: 'block' }}
              rel="noreferrer"
            >
              Om Folke
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
