"use client";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";
import {
  PATIENT_CHANNEL,
  PATIENT_RESET_EVENT,
  PATIENT_UPDATE_EVENT,
} from "@/lib/realtime";

import type { Patient } from "@/types/patient";

type PatientStatus = "active" | "inactive" | "submitted";

type PatientUpdate = {
  patient: Patient;
  status: PatientStatus;
  updatedAt: string;
};

type PatientFieldProps = {
  label: string;
  value?: string;
};

const STATUS_CONFIG: Record<
  PatientStatus,
  {
    label: string;
    containerClassName: string;
    dotClassName: string;
  }
> = {
  active: {
    label: "Active",
    containerClassName: "bg-green-100 text-green-700",
    dotClassName: "bg-green-500",
  },
  submitted: {
    label: "Submitted",
    containerClassName: "bg-blue-100 text-blue-700",
    dotClassName: "bg-blue-500",
  },
  inactive: {
    label: "Inactive",
    containerClassName: "bg-gray-100 text-gray-600",
    dotClassName: "bg-gray-400",
  },
};

export default function StaffView() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [status, setStatus] = useState<PatientStatus>("inactive");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const latestUpdatedAtRef = useRef(0);

  useEffect(() => {
    const channel = supabase
      .channel(PATIENT_CHANNEL)
      .on("broadcast", { event: PATIENT_RESET_EVENT }, () => {
        setPatient(null);
        setStatus("inactive");
        setLastUpdated(null);
        latestUpdatedAtRef.current = 0;

        console.log("Patient form reset");
      })
      .on("broadcast", { event: PATIENT_UPDATE_EVENT }, (payload) => {
        const data = payload.payload as PatientUpdate;
        const incomingUpdatedAt = new Date(data.updatedAt).getTime();

        // Ignore stale events that arrive late.
        if (incomingUpdatedAt <= latestUpdatedAtRef.current) {
          console.log("Ignoring stale realtime event:", data);
          return;
        }

        latestUpdatedAtRef.current = incomingUpdatedAt;

        setPatient(data.patient);
        setStatus(data.status);
        setLastUpdated(data.updatedAt);

        console.log("Staff received:", data);
      })
      .subscribe((channelStatus, error) => {
        console.log("Staff Realtime status:", channelStatus);

        if (error) {
          console.error("Staff Realtime error:", error);
        }

        if (channelStatus === "SUBSCRIBED") {
          console.log("Staff Realtime connected ✅");
          return;
        }

        if (
          channelStatus === "CHANNEL_ERROR" ||
          channelStatus === "TIMED_OUT"
        ) {
          console.error("Staff Realtime unavailable");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!lastUpdated || status === "submitted") {
      return;
    }

    const interval = setInterval(() => {
      const lastUpdateTime = new Date(lastUpdated).getTime();

      if (Date.now() - lastUpdateTime >= 5000) {
        setStatus("inactive");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, status]);

  const statusConfig = STATUS_CONFIG[status];

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Patient Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Real-time patient updates
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig.containerClassName}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${statusConfig.dotClassName}`}
          />

          {statusConfig.label}
        </span>
      </div>

      {patient ? (
        <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2">
          <PatientField label="First Name" value={patient.firstName} />

          <PatientField label="Middle Name" value={patient.middleName} />

          <PatientField label="Last Name" value={patient.lastName} />

          <PatientField label="Date of Birth" value={patient.dateOfBirth} />

          <PatientField label="Gender" value={patient.gender} />

          <PatientField label="Phone Number" value={patient.phone} />

          <PatientField label="Email" value={patient.email} />

          <PatientField label="Nationality" value={patient.nationality} />

          <PatientField
            label="Preferred Language"
            value={patient.preferredLanguage}
          />

          <PatientField
            label="Emergency Contact"
            value={patient.emergencyContactName}
          />

          <PatientField
            label="Relationship"
            value={patient.emergencyContactRelationship}
          />

          <PatientField label="Religion" value={patient.religion} />

          <div className="min-w-0 md:col-span-2">
            <PatientField label="Address" value={patient.address} />
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">Waiting for patient input...</p>
        </div>
      )}

      {lastUpdated && (
        <p className="mt-6 text-xs text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}
    </section>
  );
}

function PatientField({ label, value }: PatientFieldProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 min-w-0 break-words whitespace-pre-wrap font-medium text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}
