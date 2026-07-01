"use client";

import {
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  WorkerProfile,
  getCategoryLabel,
  getWorkerId,
} from "@/types/worker";

interface WorkerProfileProps {
  profile: WorkerProfile;
}

export default function WorkerProfileCard({ profile }: WorkerProfileProps) {
  const workerId = getWorkerId(profile);

  const infoRows = [
    { icon: User, label: "Name", value: profile.name },
    { icon: Phone, label: "Mobile", value: profile.mobile },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: User, label: "Gender", value: profile.gender },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: profile.date_of_birth
        ? new Date(profile.date_of_birth).toLocaleDateString()
        : "—",
    },
    { icon: Briefcase, label: "Category", value: getCategoryLabel(profile.category_id) },
    {
      icon: Briefcase,
      label: "Experience",
      value: `${profile.experience_years} year${profile.experience_years === 1 ? "" : "s"}`,
    },
    { icon: MapPin, label: "City", value: profile.city },
    { icon: MapPin, label: "State", value: profile.state },
    { icon: MapPin, label: "Pincode", value: profile.pincode },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-lg backdrop-blur-md">
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-8 text-white">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {profile.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profile_image}
              alt={profile.name}
              className="h-24 w-24 rounded-2xl border-2 border-white/40 object-cover shadow-md"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-emerald-100">{getCategoryLabel(profile.category_id)}</p>
            {workerId && (
              <p className="mt-1 text-sm text-emerald-100/90">Worker ID: #{workerId}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4"
            >
              <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Address</h3>
          <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
        </div>

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Skills</h3>
          <p className="mt-1 text-sm text-gray-900">{profile.skills}</p>
        </div>

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">About</h3>
          <p className="mt-1 text-sm text-gray-900">{profile.about}</p>
        </div>
      </div>
    </div>
  );
}
