import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Coins, TrendingUp, Award, Gift, Calendar } from "lucide-react";
import { useState } from "react";

export default function Rewards() {
  // في التطبيق الحقيقي، سيتم الحصول على userId من المصادقة
  const [userId] = useState(1);
  
  const { data: balance, isLoading: balanceLoading } = trpc.rewards.getTotalBalance.useQuery({ userId });
  const { data: rewards, isLoading: rewardsLoading } = trpc.rewards.getByUser.useQuery({ userId });

  const rewardTypes = {
    sustainable_choice: { label: "اختيار مستدام", color: "text-green-600", bg: "bg-green-50" },
    off_peak: { label: "خارج أوقات الذروة", color: "text-blue-600", bg: "bg-blue-50" },
    frequent_user: { label: "مستخدم متكرر", color: "text-purple-600", bg: "bg-purple-50" },
    referral: { label: "إحالة صديق", color: "text-orange-600", bg: "bg-orange-50" },
  };

  const stats = [
    {
      title: "الرصيد الحالي",
      value: balance ? `${balance.balance.toLocaleString()}` : "0",
      icon: Coins,
      description: "YitiCoin",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "إجمالي المكاسب",
      value: balance ? `${balance.totalEarned.toLocaleString()}` : "0",
      icon: TrendingUp,
      description: "YitiCoin مكتسبة",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "تم الاستبدال",
      value: balance ? `${balance.totalRedeemed.toLocaleString()}` : "0",
      icon: Gift,
      description: "YitiCoin مستبدلة",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "عدد المكافآت",
      value: rewards ? rewards.length : 0,
      icon: Award,
      description: "مكافأة مكتسبة",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Coins className="h-10 w-10 text-yellow-600" />
            نظام المكافآت YitiCoin
          </h1>
          <p className="text-gray-600">اكسب مكافآت عند استخدام وسائل النقل المستدامة</p>
        </div>

        {/* إحصائيات الرصيد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* كيفية كسب المكافآت */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              كيف تكسب YitiCoin؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🌱 اختيار مستدام</h4>
                <p className="text-sm text-green-700">استخدم المركبات الكهربائية أو الهجينة واكسب حتى 100 عملة</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">⏰ خارج الذروة</h4>
                <p className="text-sm text-blue-700">احجز رحلاتك خارج أوقات الذروة واكسب 50 عملة</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🔄 مستخدم متكرر</h4>
                <p className="text-sm text-purple-700">استخدم النظام بانتظام واكسب مكافآت ولاء</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">👥 إحالة صديق</h4>
                <p className="text-sm text-orange-700">أحِل صديقاً واكسب 200 عملة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تاريخ المكافآت */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              تاريخ المكافآت
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rewardsLoading ? (
              <p className="text-gray-500 text-center py-8">جاري التحميل...</p>
            ) : rewards && rewards.length > 0 ? (
              <div className="space-y-3">
                {rewards.map((reward) => {
                  const type = rewardTypes[reward.type as keyof typeof rewardTypes] || {
                    label: reward.type,
                    color: "text-gray-600",
                    bg: "bg-gray-50",
                  };
                  return (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${type.bg}`}>
                          <Award className={`h-5 w-5 ${type.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{type.label}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(reward.earnedAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-600">+{reward.amount}</p>
                        <p className="text-xs text-gray-500">
                          {reward.redeemed > 0 ? `تم استبدال ${reward.redeemed}` : "غير مستبدلة"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Coins className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">لا توجد مكافآت بعد</p>
                <p className="text-gray-400 text-sm">ابدأ باستخدام النظام لكسب YitiCoin!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 نصيحة:</span> يمكنك استبدال YitiCoin الخاصة بك للحصول على خصومات على
            رحلاتك القادمة أو هدايا مميزة!
          </p>
        </div>
      </div>
    </div>
  );
}
