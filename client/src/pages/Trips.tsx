import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MapPin } from "lucide-react";

export default function Trips() {
  const { data: trips, isLoading } = trpc.trips.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">الرحلات</h1>
          <p className="text-gray-600">عرض وإدارة جميع الرحلات</p>
        </div>

        {isLoading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    رحلة #{trip.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">معلومات الرحلة</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">الحالة:</span>{" "}
                          <span
                            className={`font-medium ${
                              trip.status === "active"
                                ? "text-green-600"
                                : trip.status === "completed"
                                ? "text-blue-600"
                                : trip.status === "cancelled"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {trip.status === "active"
                              ? "نشط"
                              : trip.status === "completed"
                              ? "مكتمل"
                              : trip.status === "cancelled"
                              ? "ملغي"
                              : "قيد الانتظار"}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">المسافة:</span>{" "}
                          <span className="font-medium">{trip.distance ? `${(trip.distance / 1000).toFixed(2)} كم` : "-"}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">المدة:</span>{" "}
                          <span className="font-medium">{trip.duration ? `${Math.round(trip.duration / 60)} دقيقة` : "-"}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">السعر:</span>{" "}
                          <span className="font-medium">{trip.price ? `${trip.price / 100} درهم` : "-"}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">نقطة البداية</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{trip.startAddress || "غير محدد"}</p>
                        <p className="text-xs text-gray-500">
                          {trip.startLatitude}, {trip.startLongitude}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(trip.startTime).toLocaleString("ar-AE")}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">نقطة الوصول</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{trip.endAddress || "غير محدد"}</p>
                        {trip.endLatitude && trip.endLongitude && (
                          <p className="text-xs text-gray-500">
                            {trip.endLatitude}, {trip.endLongitude}
                          </p>
                        )}
                        {trip.endTime && <p className="text-xs text-gray-500">{new Date(trip.endTime).toLocaleString("ar-AE")}</p>}
                      </div>
                    </div>
                  </div>

                  {trip.carbonEmissions && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">الانبعاثات الكربونية:</span> {trip.carbonEmissions} جرام CO2
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لا توجد رحلات مسجلة في النظام</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
