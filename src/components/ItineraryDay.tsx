import { MapPin, Train, Clock, Utensils, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Activity {
  time: string;
  title: string;
  description: string;
  type: 'transport' | 'attraction' | 'food' | 'other';
  cost?: number;
}

interface ItineraryDayProps {
  day: number;
  title: string;
  activities: Activity[];
  transportation: string;
}

export function ItineraryDay({ day, title, activities, transportation }: ItineraryDayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transport':
        return <Train className="size-4" />;
      case 'attraction':
        return <Camera className="size-4" />;
      case 'food':
        return <Utensils className="size-4" />;
      default:
        return <MapPin className="size-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transport':
        return 'bg-blue-500/10 text-blue-700';
      case 'attraction':
        return 'bg-purple-500/10 text-purple-700';
      case 'food':
        return 'bg-orange-500/10 text-orange-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Day {day}</CardTitle>
            <CardDescription className="text-white/90 mt-1">{title}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Train className="size-3 mr-1" />
            {transportation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center size-8 rounded-full bg-rose-100 text-rose-600 shrink-0">
                  {getIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-full bg-gray-200 my-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{activity.time}</span>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                  </div>
                  {activity.cost && (
                    <span className="text-sm font-medium text-rose-600">¥{activity.cost}</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
