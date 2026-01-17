import { Button } from "@/components/ui/button";
import { ArrowRight, Car, MapPin, Activity, Coins } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const features = [
    {
      title: "إدارة المركبات",
      description: "عرض وإدارة جميع وسائل النقل في النظام",
      icon: Car,
      link: "/vehicles",
    },
    {
      title: "الخريطة التفاعلية",
      description: "تتبع المركبات في الزمن الحقيقي",
      icon: MapPin,
      link: "/map",
    },
    {
      title: "بيانات الحساسات",
      description: "عرض البيانات الحية من أجهزة IoT",
      icon: Activity,
      link: "/sensors",
    },
    {
      title: "نظام المكافآت",
      description: "اكسب YitiCoin عند استخدام النقل المستدام",
      icon: Coins,
      link: "/rewards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            YitiFlow Pro
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            نظام إدارة النقل السياحي الذكي
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-blue-50">
              الذهاب إلى لوحة التحكم
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.link}>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-all cursor-pointer">
                  <Icon className="h-12 w-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-blue-100 text-sm">
            مدعوم بالبلوكشين وإنترنت الأشياء لتحقيق الشفافية والاستدامة
          </p>
        </div>
      </div>
    </div>
  );
}
