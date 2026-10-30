import { useState, useEffect, useCallback, useMemo } from "react";
import type { ApplicationData, DocumentVerification, ActivityLog, VisaCategory } from "./types";
import { calculateReadinessScore } from "./readinessScore";
import { runApplicationHealthCheck } from "./healthCheck";
import { getPersonalizedChecklist } from "./documentRules";
import { generateTravelTimeline } from "./travelTimeline";

const STORAGE_KEY = "visaease_app_state_v2";

const DEFAULT_APPLICATION: ApplicationData = {
  given: "",
  surname: "",
  dob: "",
  gender: "",
  nationality: "",
  email: "",
  passport: "",
  issuePlace: "",
  issue: "",
  expiry: "",
  purpose: "Tourism",
  category: "Tourist",
  arrival: "",
  city: "Delhi",
  hotel: "",
  travelDate: "",
  referenceName: "",
  referencePhone: "",
  referenceAddress: "",
};

const SAMPLE_APPLICATION: ApplicationData = {
  given: "Emma",
  surname: "Clarke",
  dob: "1992-04-18",
  gender: "Female",
  nationality: "United Kingdom",
  email: "emma.clarke@example.com",
  passport: "533380006",
  issuePlace: "London",
  issue: "2021-06-10",
  expiry: "2031-06-09",
  purpose: "Tourism",
  category: "Tourist",
  arrival: "2026-12-14",
  city: "Delhi",
  hotel: "The Imperial Hotel, Janpath, New Delhi",
  travelDate: "2026-12-14",
  referenceName: "The Imperial Hotel Desk",
  referencePhone: "+91 11 2334 1234",
  referenceAddress: "Janpath, Connaught Place, New Delhi",
};

interface StoredState {
  data: ApplicationData;
  verifiedDocs: Record<string, DocumentVerification | undefined>;
  checkedList: Record<string, boolean>;
  activities: ActivityLog[];
  demoAppId: string;
}

function loadInitialState(): StoredState {
  if (typeof window === "undefined") {
    return {
      data: DEFAULT_APPLICATION,
      verifiedDocs: {},
      checkedList: { chk_passport: false, chk_photo: false, chk_itinerary: false },
      activities: [
        {
          id: "act_init",
          title: "New application draft initialized",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "review",
        },
      ],
      demoAppId: "VE-2026-1001",
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        data: { ...DEFAULT_APPLICATION, ...parsed.data },
        verifiedDocs: parsed.verifiedDocs || {},
        checkedList: parsed.checkedList || {},
        activities: parsed.activities || [],
        demoAppId: parsed.demoAppId || "VE-2026-1001",
      };
    }
  } catch (err) {
    console.error("Failed to parse visa store from localStorage", err);
  }

  return {
    data: DEFAULT_APPLICATION,
    verifiedDocs: {},
    checkedList: {},
    activities: [
      {
        id: "act_init",
        title: "New application draft initialized",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "review",
      },
    ],
    demoAppId: "VE-2026-1001",
  };
}

// Global subscribers for multi-component reactive sync
type Listener = () => void;
let globalState: StoredState = loadInitialState();
const listeners = new Set<Listener>();

function emitChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.warn("localStorage quota or error", e);
    }
  }
  listeners.forEach((l) => l());
}

export function useVisaStore() {
  const [state, setState] = useState<StoredState>(globalState);

  useEffect(() => {
    // Sync on mount in client
    setState(globalState);
    const onChange = () => setState({ ...globalState });
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const updateField = useCallback(<K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => {
    globalState = {
      ...globalState,
      data: {
        ...globalState.data,
        [key]: value,
        ...(key === "arrival" && !globalState.data.travelDate ? { travelDate: String(value) } : {}),
      },
    };
    emitChange();
  }, []);

  const setFormData = useCallback((partial: Partial<ApplicationData>) => {
    globalState = {
      ...globalState,
      data: {
        ...globalState.data,
        ...partial,
      },
    };
    emitChange();
  }, []);

  const fillSampleData = useCallback(() => {
    globalState = {
      ...globalState,
      data: { ...SAMPLE_APPLICATION },
      verifiedDocs: {
        passport: {
          kind: "passport",
          fileName: "passport_bio_emma_clarke.pdf",
          fileSizeKb: 340,
          fileType: "application/pdf",
          verified: true,
          notes: "Valid PDF format, clear MRZ visible",
          uploadedAt: new Date().toLocaleDateString(),
        },
        photo: {
          kind: "photo",
          fileName: "photo_white_bg.jpg",
          fileSizeKb: 210,
          fileType: "image/jpeg",
          verified: true,
          notes: "350x350px, white background detected",
          uploadedAt: new Date().toLocaleDateString(),
          dimensions: { w: 400, h: 400 },
        },
      },
      checkedList: {
        chk_passport: true,
        chk_photo: true,
        chk_itinerary: true,
        chk_hotel_booking: true,
      },
      activities: [
        {
          id: `act_${Date.now()}`,
          title: "Sample applicant data loaded (Emma Clarke)",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "profile",
        },
        ...globalState.activities,
      ],
    };
    emitChange();
  }, []);

  const setDocVerified = useCallback(
    (kind: DocumentVerification["kind"], info: Partial<DocumentVerification>) => {
      const full: DocumentVerification = {
        kind,
        fileName: info.fileName || `${kind}_file`,
        fileSizeKb: info.fileSizeKb || 150,
        fileType: info.fileType || "application/pdf",
        verified: info.verified ?? true,
        notes: info.notes || "Verified by client scanner",
        uploadedAt: new Date().toLocaleDateString(),
        dimensions: info.dimensions,
      };

      globalState = {
        ...globalState,
        verifiedDocs: {
          ...globalState.verifiedDocs,
          [kind]: full,
        },
        checkedList: {
          ...globalState.checkedList,
          [`chk_${kind}`]: true,
        },
        activities: [
          {
            id: `act_${Date.now()}`,
            title: `Document verified: ${full.fileName}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "doc",
          },
          ...globalState.activities,
        ],
      };
      emitChange();
    },
    []
  );

  const removeDoc = useCallback((kind: string) => {
    const updated = { ...globalState.verifiedDocs };
    delete updated[kind];
    globalState = {
      ...globalState,
      verifiedDocs: updated,
      checkedList: {
        ...globalState.checkedList,
        [`chk_${kind}`]: false,
      },
    };
    emitChange();
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    const nextVal = !globalState.checkedList[id];
    globalState = {
      ...globalState,
      checkedList: {
        ...globalState.checkedList,
        [id]: nextVal,
      },
    };
    emitChange();
  }, []);

  const setTravelDate = useCallback((dateStr: string) => {
    globalState = {
      ...globalState,
      data: {
        ...globalState.data,
        travelDate: dateStr,
        arrival: globalState.data.arrival || dateStr,
      },
      activities: [
        {
          id: `act_${Date.now()}`,
          title: `Intended travel date set to ${dateStr}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "travel",
        },
        ...globalState.activities,
      ],
    };
    emitChange();
  }, []);

  const addActivity = useCallback((title: string, type: ActivityLog["type"] = "review") => {
    globalState = {
      ...globalState,
      activities: [
        {
          id: `act_${Date.now()}`,
          title,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type,
        },
        ...globalState.activities.slice(0, 19),
      ],
    };
    emitChange();
  }, []);

  const resetAll = useCallback(() => {
    globalState = {
      data: DEFAULT_APPLICATION,
      verifiedDocs: {},
      checkedList: {},
      activities: [
        {
          id: `act_${Date.now()}`,
          title: "Application draft reset",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "review",
        },
      ],
      demoAppId: `VE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    emitChange();
  }, []);

  // Computed values
  const readiness = useMemo(() => {
    return calculateReadinessScore(state.data, state.verifiedDocs, state.checkedList);
  }, [state.data, state.verifiedDocs, state.checkedList]);

  const health = useMemo(() => {
    return runApplicationHealthCheck(state.data, state.verifiedDocs, state.checkedList);
  }, [state.data, state.verifiedDocs, state.checkedList]);

  const checklist = useMemo(() => {
    return getPersonalizedChecklist(
      state.data.nationality,
      state.data.purpose,
      state.data.category,
      state.verifiedDocs,
      state.checkedList
    );
  }, [state.data.nationality, state.data.purpose, state.data.category, state.verifiedDocs, state.checkedList]);

  const timeline = useMemo(() => {
    const targetDate = state.data.travelDate || state.data.arrival || "";
    return generateTravelTimeline(targetDate, Boolean(state.data.passport && state.data.given), readiness.total);
  }, [state.data.travelDate, state.data.arrival, state.data.passport, state.data.given, readiness.total]);

  return {
    data: state.data,
    verifiedDocs: state.verifiedDocs,
    checkedList: state.checkedList,
    activities: state.activities,
    demoAppId: state.demoAppId,
    readiness,
    health,
    checklist,
    timeline,
    updateField,
    setFormData,
    fillSampleData,
    setDocVerified,
    removeDoc,
    toggleChecklistItem,
    setTravelDate,
    addActivity,
    resetAll,
  };
}
