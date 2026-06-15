import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Building2, ExternalLink, Phone, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const orangeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Mapa() {
  const [selectedOng, setSelectedOng] = useState(null);

  const { data: ongs, isLoading } = useQuery({
    queryKey: ["ongs", "map"],
    queryFn: () => base44.entities.ONG.filter({ status: "approved" }),
    initialData: [],
  });

  const milagresCenter = [-7.313, -38.945];

  return (
    <div className="relative h-[calc(100vh-57px)]">
      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={milagresCenter}
        zoom={14}
        className="h-full w-full z-10"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {ongs.map((ong) => (
          ong.latitude && ong.longitude && (
            <Marker
              key={ong.id}
              position={[ong.latitude, ong.longitude]}
              icon={orangeIcon}
              eventHandlers={{ click: () => setSelectedOng(ong) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <strong className="text-sm">{ong.name}</strong>
                  <p className="text-xs text-muted-foreground mt-1">{ong.address}</p>
                  <Link
                    to={`/ong/${ong.id}`}
                    className="text-xs text-primary font-medium hover:underline mt-1 inline-block"
                  >
                    Ver perfil
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Bottom Sheet */}
      {selectedOng && (
        <div className="absolute bottom-0 left-0 right-0 z-40 p-3">
          <Card className="rounded-2xl shadow-xl border-border p-4 max-w-lg mx-auto">
            <div className="flex items-start gap-3">
              <img
                src={selectedOng.logo_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=60&h=60&fit=crop"}
                alt={selectedOng.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground text-sm">{selectedOng.name}</h3>
                  {selectedOng.verified && (
                    <span className="text-[10px] bg-info text-info-foreground px-1.5 py-0.5 rounded-full font-medium">
                      Verificada
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {selectedOng.description || "Instituição sem descrição."}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  <span className="truncate">{selectedOng.address || "Milagres, CE"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link to={`/ong/${selectedOng.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full gap-1">
                  <Building2 size={14} /> Perfil
                </Button>
              </Link>
              <Button size="sm" className="flex-1 gap-1" onClick={() => setSelectedOng(null)}>
                <Heart size={14} /> Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Stats bar */}
      <div className="absolute top-3 left-3 z-40 bg-card/90 backdrop-blur-lg rounded-xl px-3 py-2 border border-border shadow-sm">
        <p className="text-xs font-medium text-foreground">
          <MapPin size={12} className="inline mr-1 text-primary" />
          {ongs.length} ONGs mapeadas
        </p>
      </div>
    </div>
  );
}