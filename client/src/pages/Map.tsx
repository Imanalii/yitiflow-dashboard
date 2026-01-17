import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { Map as MapIcon, Navigation } from "lucide-react";

export default function Map() {
  const { data: vehicles, isLoading, refetch } = trpc.vehicles.list.useQuery();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // تحديث الخريطة كل 10 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  // تحديث العلامات على الخريطة
  useEffect(() => {
    if (!map || !vehicles) return;

    // حذف العلامات القديمة
    markers.forEach((marker) => marker.setMap(null));

    // إضافة علامات جديدة
    const newMarkers = vehicles
      .filter((v) => v.currentLatitude && v.currentLongitude)
      .map((vehicle) => {
        const position = {
          lat: parseFloat(vehicle.currentLatitude!),
          lng: parseFloat(vehicle.currentLongitude!),
        };

        const marker = new google.maps.Marker({
          position,
          map,
          title: vehicle.licensePlate,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: vehicle.status === "available" ? "#10b981" : vehicle.status === "busy" ? "#f59e0b" : "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        // إضافة نافذة معلومات
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; direction: rtl;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${vehicle.licensePlate}</h3>
              <p style="margin: 2px 0;">النوع: ${vehicle.type}</p>
              <p style="margin: 2px 0;">الحالة: ${
                vehicle.status === "available" ? "متاح" : vehicle.status === "busy" ? "مشغول" : "صيانة"
              }</p>
              <p style="margin: 2px 0;">السعة: ${vehicle.capacity} راكب</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

    setMarkers(newMarkers);
  }, [map, vehicles]);

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);

    // تعيين المركز الافتراضي (يتي، الإمارات)
    if (vehicles && vehicles.length > 0 && vehicles[0].currentLatitude && vehicles[0].currentLongitude) {
      mapInstance.setCenter({
        lat: parseFloat(vehicles[0].currentLatitude),
        lng: parseFloat(vehicles[0].currentLongitude),
      });
    } else {
      // إحداثيات يتي الافتراضية
      mapInstance.setCenter({ lat: 25.2048, lng: 55.2708 });
    }
    mapInstance.setZoom(13);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MapIcon className="h-10 w-10" />
            الخريطة التفاعلية
          </h1>
          <p className="text-gray-600">تتبع المركبات في الزمن الحقيقي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* الخريطة */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                موقع المركبات الحالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
                <MapView onMapReady={handleMapReady} />
              </div>
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>متاح</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>مشغول</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>صيانة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* قائمة المركبات */}
          <Card>
            <CardHeader>
              <CardTitle>المركبات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500 text-sm">جاري التحميل...</p>
              ) : vehicles && vehicles.length > 0 ? (
                <div className="space-y-3">
                  {vehicles
                    .filter((v) => v.currentLatitude && v.currentLongitude)
                    .map((vehicle) => (
                      <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm">{vehicle.licensePlate}</p>
                        <p className="text-xs text-gray-600">{vehicle.type}</p>
                        <p
                          className={`text-xs mt-1 ${
                            vehicle.status === "available"
                              ? "text-green-600"
                              : vehicle.status === "busy"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {vehicle.status === "available" ? "متاح" : vehicle.status === "busy" ? "مشغول" : "صيانة"}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">لا توجد مركبات نشطة</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">ملاحظة:</span> يتم تحديث مواقع المركبات تلقائياً كل 10 ثواني
          </p>
        </div>
      </div>
    </div>
  );
}
