import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function Sensors() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">بيانات الحساسات</h1>
          <p className="text-gray-600">عرض البيانات الحية من أجهزة IoT</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              البيانات الحية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">سيتم عرض البيانات الحية من الأجهزة هنا بمجرد بدء الإرسال</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">ملاحظة:</span> تأكد من تشغيل أجهزة ESP32 وتوصيلها بالشبكة لبدء استقبال البيانات
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
