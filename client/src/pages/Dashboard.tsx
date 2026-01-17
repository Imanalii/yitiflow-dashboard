import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Car, Activity, MapPin, TrendingUp, Coins } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: vehicles, isLoading: vehiclesLoading } = trpc.vehicles.list.useQuery();
  const { data: trips, isLoading: tripsLoading } = trpc.trips.list.useQuery();

  const stats = [
    {
      title: "إجمالي المركبات",
      value: vehicles?.length || 0,
      icon: Car,
      description: "المركبات المسجلة في النظام",
      link: "/vehicles",
    },
    {
      title: "الرحلات النشطة",
      value: trips?.filter((t) => t.status === "active").length || 0,
      icon: Activity,
      description: "الرحلات الجارية حالياً",
      link: "/trips",
    },
    {
      title: "الخريطة التفاعلية",
      value: vehicles?.filter((v) => v.currentLatitude && v.currentLongitude).length || 0,
      icon: MapPin,
      description: "مركبات نشطة على الخريطة",
      link: "/map",
    },
    {
      title: "معدل الاستخدام",
      value: vehicles && trips ? `${Math.round((trips.length / vehicles.length) * 10) / 10}` : "0",
      icon: TrendingUp,
      description: "متوسط الرحلات لكل مركبة",
      link: "/dashboard",
    },
    {
      title: "نظام المكافآت",
      value: "YitiCoin",
      icon: Coins,
      description: "اكسب مكافآت مستدامة",
      link: "/rewards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم - YitiFlow Pro</h1>
          <p className="text-gray-600">نظام إدارة النقل السياحي الذكي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>الرحلات الأخيرة</CardTitle>
              <CardDescription>آخر 5 رحلات مسجلة في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              {tripsLoading ? (
                <p className="text-gray-500">جاري التحميل...</p>
              ) : trips && trips.length > 0 ? (
                <div className="space-y-4">
                  {trips.slice(0, 5).map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">رحلة #{trip.id}</p>
                        <p className="text-sm text-gray-500">الحالة: {trip.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{trip.price ? `${trip.price / 100} درهم` : "-"}</p>
                        <p className="text-xs text-gray-500">{new Date(trip.startTime).toLocaleDateString("ar-AE")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">لا توجد رحلات مسجلة</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المركبات المتاحة</CardTitle>
              <CardDescription>المركبات الجاهزة للاستخدام</CardDescription>
            </CardHeader>
            <CardContent>
              {vehiclesLoading ? (
                <p className="text-gray-500">جاري التحميل...</p>
              ) : vehicles && vehicles.length > 0 ? (
                <div className="space-y-4">
                  {vehicles.filter((v) => v.status === "available").slice(0, 5).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{vehicle.licensePlate}</p>
                        <p className="text-sm text-gray-500">النوع: {vehicle.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{vehicle.fuelType}</p>
                        <p className="text-xs text-gray-500">السعة: {vehicle.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">لا توجد مركبات متاحة</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
