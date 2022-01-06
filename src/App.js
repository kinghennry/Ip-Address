import React, { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import Form from "./components/Form";
import { findLocation } from "./api";
import L from "leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

function getParamsForQuery(query) {
  const reg = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (reg.test(query)) {
    return { ip: query };
  }
  return { domain: query };
}

function App() {
  const [map, setMap] = useState();
  const [placeholder, setPlaceholder] = useState();
  const [invalid, setInvalid] = useState(false);
  const [data, setData] = useState();
  const [query, setQuery] = useState();
  const [loading, setLoading] = useState(true);

  // Once on start, use user's IP
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await findLocation({ autoIp: true });
      if (data && !data.code) setData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  // Callback when non-blank query string submitted from form
  const onSubmit = useCallback((value) => setQuery(value), []);

  // When query changes, fetch data again
  useEffect(() => {
    if (!query) return;

    const params = getParamsForQuery(query);
    if (params) {
      const loadData = async () => {
        setLoading(true);
        const data = await findLocation(params);
        if (data && !data.code) {
          setData(data);
          setInvalid(false);
        } else {
          setInvalid(true);
        }
        setLoading(false);
      };

      loadData();
    }
  }, [query]);

  // Callback when window changes size to change placeholder text to be shorter
  // if on small screens
  const onWinResize = useCallback(
    () =>
      setPlaceholder(
        window.innerWidth > 500
          ? "Search for any IP address or domain"
          : "IP or domain"
      ),
    []
  );
  useEffect(() => {
    onWinResize();
    window.addEventListener("resize", onWinResize);
    return () => {
      window.removeEventListener("resize", onWinResize);
    };
  }, []);

  // The map does not update when props update, we need to use the reference and call things on it directly
  useEffect(() => {
    if (map && data && data.location) {
      map.flyTo([data.location.lat, data.location.lng], 17, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, data]);
  return (
    <div className="app">
      <div className="app__topWrap">
        <div className="app__container">
          <h1 className="title">IP Address Tracker</h1>
          <Form
            placeholder={placeholder}
            onSubmit={onSubmit}
            invalid={invalid}
          />
        </div>

        <div className="results__display">
          {data && (
            <section className="display__container">
              <div className="app__infoItem app__infoItem--ip">
                <h4 className="muted__title">IP Address</h4>
                <span className="results">{data.ip}</span>
              </div>
              <div className="app__infoItem app__infoItem--ip">
                <h4 className="muted__title">Location</h4>
                <span className="results">
                  {data.location.city}, {data.location.region}
                  {data.location.postalCode && `, ${data.location.postalCode}`}
                </span>
              </div>
              <div className="app__infoItem app__infoItem--ip">
                <h4 className="muted__title">Timestamp</h4>
                <span className="results">UTC{data.location.timezone}</span>
              </div>
              <div className="app__infoItem app__infoItem--ip none">
                <h4 className="muted__title">ISP</h4>
                <span className="results">{data.isp}</span>
              </div>
            </section>
          )}
        </div>
      </div>
      {data && (
        <MapContainer
          whenCreated={(map) => setMap(map)}
          className="app__map"
          center={[0, 0]}
          zoom={17}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[data.location.lat, data.location.lng]}
            icon={L.icon({ iconUrl: "./icon-location.svg" })}
          />
        </MapContainer>
      )}
      {loading && (
        <div className="lds-dual-ring">
          <h1>loading</h1>
        </div>
      )}
    </div>
  );
}

export default App;
