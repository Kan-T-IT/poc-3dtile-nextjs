'use client';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from './page.module.css'
import { useState, useEffect } from "react";

const idMapContainer = 'map';

export default function Home() {
  const [map, setMap] = useState();

  const initMap = () => {
    const mapInstance = new maplibregl.Map({
      container: idMapContainer,
      style: {
        version: 8,
        sources: {
          "baseCepal": {
            type: "raster",
            scheme: "tms",
            tiles: [
              "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG:3857@png/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          }
        },
        layers: [
          {
            id: "baseCepal",
            type: "raster",
            source: "baseCepal",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      hash: true,
      center: [-66.336888, -33.301862],
      zoom: 16,
    });
    setMap(mapInstance);
  };

  useEffect(() => {
    if (!map && document.getElementById(idMapContainer)) {
      initMap();
    }
    if(map) {
      map.on('load', async () => {
        console.log('load');
        // map.addLayer(
        //   await DeckGL_IconLayer(),
        //   MapTilerAPIKey.length > 0 ? 'road_pier' : ''
        // );
      });
    }
  }, [map]);

  return (
    <main className={styles.main}>
      <div id={idMapContainer} className={styles.map} />
    </main>
  )
}
