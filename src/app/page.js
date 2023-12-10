'use client';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { MapboxLayer } from '@deck.gl/mapbox';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';
import {Tile3DLayer} from '@deck.gl/geo-layers';

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
          "baseIgn": {
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
            id: "baseIgn",
            type: "raster",
            source: "baseIgn",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      hash: true,
      center: [ -70.9055384313, -39.2364536512 ],
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
        const tile3dLayer = await new MapboxLayer({
          id: 'tile-3d-layer',
          type: Tile3DLayer,
          data: 'https://mesh3d.s3.eu-west-2.amazonaws.com/neuquen/b3dm_1_0-200/tileset.json',
          loader: Tiles3DLoader,
          onTilesetLoad: (tileset) => {
            console.log('tileset', tileset);
            // Recenter to cover the tileset
            const {cartographicCenter, zoom} = tileset;
            // this.setState({
            //     viewState: {
            //       ...this.state.viewState,
            //       longitude: cartographicCenter[0],
            //       latitude: cartographicCenter[1],
            //       zoom
            //     }
            // });
            console.log('cartographicCenter', cartographicCenter, deck);
            // goToMesh();
          },
          // override scenegraph subLayer prop
          _subLayerProps: {
            scenegraph: {_lighting: 'flat'}
          }
        });
      
        map.addLayer(
          tile3dLayer
        );
      });
    }
  }, [map]);

  return (
    <main className={styles.main}>
      <div id={idMapContainer} className={styles.map} />
    </main>
  )
}
