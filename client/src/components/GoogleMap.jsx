import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function GoogleMap({ latitude, longitude }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.VITE_GOOGLE_MAPS_ID;
  const position = { lat: latitude, lng: longitude };
  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-96">
        <Map zoom={15} center={position} mapId={mapId}>
          <Marker position={position}></Marker>
        </Map>
      </div>
    </APIProvider>
  );
}
