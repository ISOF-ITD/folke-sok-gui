import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecordList from './views/RecordList';
import { createParamsFromPlacesRoute } from '../utils/routeHelper';

import ShortStatistics from './ShortStatistics';

export default function StatisticsOverlay() {
  const [visible, setVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const params = {
    size: 10,
    recordtype: 'one_record',
    transcriptionstatus: 'published',
    sort: 'transcriptiondate', // 'approvedate',
    order: 'desc',
  };

  useEffect(() => {
    // listen for the event that is dispatched when the user clicks the hamburger menu button
    window.eventBus.addEventListener('overlay.sideMenu', (event, data) => {
      if (event.target === 'visible') {
        setVisible(true);
        setHasBeenVisible(true);
      }
    });
  }, []);

  return (
    <div className={`statistics-overlay ${visible ? 'visible' : ''}`}>
      <div className="container-header">
        <button type="button" aria-label="stäng" className="close-button white" onClick={() => setVisible(false)} />
        <h2>Upptäck</h2>
      </div>
      <div className="row">
        {/* Show how many records that have been transcribed the last month */}
        {/* Antal avskrivna uppteckningar den här månaden */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
            // +2h to account for the time difference between
            // the server and the timestamps in the database
            // "now/M" is the start of the current month
            range: 'transcriptiondate,now/M,now%2B2h',
          }}
          label="avskrivna uppteckningar senaste månaden"
          visible={visible}
        />
        {/* Antal avskrivna uppteckningar totalt  */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
          }}
          label="avskrivna uppteckningar totalt"
          visible={visible}
        />

        {/* Show how many pages that have been transcribed the last month */}
        {/* Antal avskrivna sidor den här månaden */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
            // +2h to account for the time difference between
            // the server and the timestamps in the database
            // urlencode the range parameter. range = 'transcriptiondate,now-1M,now+2h'
            // "now/M" is the start of the current month
            range: 'transcriptiondate,now/M,now%2B2h',
            aggregation: 'sum,archive.total_pages',
          }}
          label="avskrivna sidor senaste månaden"
          visible={visible}
        />

        {/* Antal avskrivna sidor totalt  */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
            aggregation: 'sum,archive.total_pages',
          }}
          label="avskrivna sidor totalt"
          visible={visible}
        />

        {/* Show how many different users have transcribed in the last month */}
        {/* Antal personer som skrivit av dne här kalendermånaden */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
            // +2h to account for the time difference between
            // the server and the timestamps in the database
            // "now/M" is the start of the current month
            range: 'transcriptiondate,now/M,now%2B2h',
            aggregation: 'cardinality,transcribedby.keyword',
          }}
          label="användare som har skrivit av uppteckningar senaste månaden"
          visible={visible}
        />

        {/* Antal personer som skrivit av totalt */}
        <ShortStatistics
          params={{
            recordtype: 'one_record',
            transcriptionstatus: 'published',
            aggregation: 'cardinality,transcribedby.keyword',
          }}
          label="användare som har skrivit av uppteckningar totalt"
          visible={visible}
        />

        <h3>Senast avskrivna uppteckningar</h3>
        {/* get the records, when state visible is set to true
        and the component has not been visible before */}
        {(visible || hasBeenVisible)
                    && (
                    <RecordList
                      key="latest-RecordList"
                      disableRouterPagination
                      params={params}
                      disableListPagination
                      columns={['title', 'year', 'place', 'transcribedby']}
                        // create siteSearchParams in order to
                        // keep the global search params when navigating to a record
                    //   siteSearchParams={createParamsFromPlacesRoute(location.pathname)}
                      tableClass="table-compressed"
                        // möjliggör att visa 50 poster efter en klick på "visa fler"
                      sizeMore={50}
                        // interval is 60 sec, if visible is true and the web browser is in focus
                      interval={visible ? 60000 : null}
                    />
                    )}
      </div>
    </div>
  );
}
