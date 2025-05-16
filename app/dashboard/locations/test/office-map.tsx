'use client'
import {APIProvider, Map,  Marker,  useMap, useMarkerRef} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Office } from './locations';


export function OfficeMap() {
    return (
        
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
    <Map
      style={{width: '100%', height: '100%'}}
      center={{lat: 53.54992, lng: 10.00678}}
      defaultZoom={12}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
  </APIProvider>
    )
}

export function MapWithMarker( {lat, lng}: {lat: number, lng: number} ) {
    const [markerRef, marker] = useMarkerRef();

  useEffect(() => {
    if (!marker) {
      return;
    }

    // do something with marker instance here
  }, [marker]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          style={{width: '100%', height: '100%'}}
          center={{lat: lat, lng: lng}}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
            
                <Marker ref={markerRef} position={{lat: lat, lng: lng}} />
          
        </Map>
      </APIProvider>
    )
}

export function OfficeMapWithMarkers( {locations}: {locations: Office[]} ) {
    const [markerRef, marker] = useMarkerRef();
    //const [center, setCenter] = useState({lat: 49.8378185, lng: -97.1678022})
    const map = useMap();
    
    useEffect(() => {
        if (!marker) {
          return;
        }
        // do something with marker instance here
    }, [marker]);
    
    useEffect(() => {
        if (locations.length > 0 && locations[0].latitude && locations[0].longitude) {
            const initialCenter = {lat: locations[0].latitude , lng: locations[0].longitude}
            console.log(initialCenter)
            //setCenter(initialCenter)
        }
    }, [locations])
    
    // Handler for map drag end event
    const handleDragEnd = () => {
        if (map) {
            console.log(map.getCenter())
            const newCenter = map.getCenter();
            if (newCenter) {
                //setCenter({
                //    lat: newCenter.lat(),
                //    lng: newCenter.lng()
                //});
            }
        }
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <Map
                style={{
                    width: '100%', 
                    height: '100%',
                    borderRadius: '1rem'
                }}
                defaultCenter={map?.getCenter() ?? {lat: 53.54992, lng: -97.00678}}
                defaultZoom={4}
                onDragend={handleDragEnd}
                draggableCursor={'grabbing'}
                gestureHandling={'auto'}
                disableDefaultUI={false}
                mapId="d922b319b0c7530456449626"
                clickableIcons={true}
                fullscreenControl={true}
            >
                {locations.filter((location)=> location.latitude && location.longitude)
                .map((location)=> (
                    <Marker 
                        key={location.id} 
                        ref={markerRef} 
                        position={{lat: location.latitude ?? 0, lng: location.longitude ?? 0}} 
                    />
                ))}
            </Map>
           
        </APIProvider>
    )
}