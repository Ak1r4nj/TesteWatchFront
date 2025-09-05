"use client";

import React from "react";

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    category: string;
    progress: number;
  };
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div
      key={activity.id}
      className="p-3 mb-2 bg-customPrimaryLight border rounded shadow-sm cursor-pointer hover:bg-gray-900"
      onClick={() => (window.location.href = `/activities/${activity.id}`)}
    >
      <p className="font-medium">{activity.name}</p>
      <p className="text-sm text-gray-600">Progresso: {activity.progress}%</p>

      {activity.category && (
        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {activity.category}
        </span>
      )}
    </div>
  );
}
