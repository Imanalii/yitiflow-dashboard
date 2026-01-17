import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Car } from "lucide-react";

export default function Vehicles() {
  const { data: vehicles, isLoading } = trpc.vehicles.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">المركبات</h1>
          <p className="text-gray-600">إدارة جميع وسائل النقل في النظام</p>
        </div>

        {isLoading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {vehicle.licensePlate}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">النوع:</span>
                      <span className="font-medium">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوقود:</span>
                      <span className="font-medium">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">السعة:</span>
                      <span className="font-medium">{vehicle.capacity} راكب</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <span
                        className={`font-medium ${
                          vehicle.status === "available"
                            ? "text-green-600"
                            : vehicle.status === "busy"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {vehicle.status === "available" ? "متاح" : vehicle.status === "busy" ? "مشغول" : "صيانة"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">لا توجد مركبات مسجلة في النظام</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
