export interface TermDefinition {
  term: string;
  aliases: string[];
  shortDesc: string;
  detailedExplanation: string;
  officialAdvice: string;
  category: "Passport & Identity" | "Application & Fees" | "Immigration & Border" | "Travel & Stay";
}

export interface CuratedFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  link?: string;
}

export const VISA_TERMS_DICTIONARY: TermDefinition[] = [
  {
    term: "e-Visa vs Regular Sticker Visa",
    aliases: ["difference", "regular visa", "sticker visa", "embassy visa", "paper visa"],
    shortDesc: "e-Visa is processed 100% online; Regular visa is stamped directly into your passport via an Indian Embassy or VFS.",
    detailedExplanation:
      "An Indian e-Visa (Electronic Travel Authorization) is applied for and approved online without visiting an embassy or sending physical passports. Once granted, you receive an email (ETA) to print and carry. A Regular (Paper/Sticker) Visa requires submitting your physical passport to an Indian Embassy, Consulate, or outsourcing partner (like VFS/BLS), usually necessary for long-term study, employment, research, or journalists.",
    officialAdvice: "Always verify if your nationality is in the 165+ e-Visa eligible list on indianvisaonline.gov.in before booking an embassy appointment.",
    category: "Application & Fees",
  },
  {
    term: "6-Month Passport Validity Rule",
    aliases: ["validity", "6 months", "passport expire", "expiration", "blank pages"],
    shortDesc: "Your passport must remain valid for at least 180 days from your date of arrival in India and possess at least 2 blank pages.",
    detailedExplanation:
      "Indian Bureau of Immigration strictly requires all foreign nationals to hold a machine-readable passport valid for at least 6 months beyond the arrival date. If your passport expires 5 months after arrival, airlines will deny boarding and immigration officers will refuse entry. Your passport must also have at least two consecutive blank pages for entry/exit stamps.",
    officialAdvice: "If your passport has less than 6 months remaining, renew it in your home country before submitting an Indian visa application.",
    category: "Passport & Identity",
  },
  {
    term: "Reference in India",
    aliases: ["reference", "sponsor", "contact in india", "local contact", "hotel reference"],
    shortDesc: "A local contact person or accommodation address where you will be staying in India.",
    detailedExplanation:
      "On the visa application form, applicants are asked for a 'Reference Name in India'. If you do not have personal relatives or business partners in India, you should legally provide the name, full address, and phone number of your booked hotel, resort, or tour operator. For business or medical visas, provide your corporate host or hospital coordinator.",
    officialAdvice: "Never leave the reference field blank. Providing your confirmed hotel reservation details is completely standard and accepted for tourists.",
    category: "Application & Fees",
  },
  {
    term: "Designated Ports of Entry",
    aliases: ["port of entry", "airports", "seaports", "land border", "arrival city"],
    shortDesc: "Authorized entry points where electronic visa biometrics and immigration gates operate.",
    detailedExplanation:
      "e-Visa holders can only enter India through 31 designated international airports (such as Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Kochi, Goa, Hyderabad, etc.) and 5 designated seaports (Cochin, Goa, Mangalore, Mumbai, Chennai). You CANNOT enter India via land borders (e.g., from Nepal, Bangladesh, or Pakistan) on an e-Visa. However, once legally entered, you can exit through any authorized Immigration Check Post.",
    officialAdvice: "Check your flight ticket to confirm your first port of landing is an approved e-Visa airport.",
    category: "Immigration & Border",
  },
  {
    term: "Continuous Stay Limit (90 vs 180 Days)",
    aliases: ["stay limit", "continuous stay", "duration", "how long can i stay", "90 days", "180 days"],
    shortDesc: "The maximum number of consecutive days you are permitted to stay inside India on each single visit.",
    detailedExplanation:
      "Even if you hold a 1-year or 5-year Tourist e-Visa with multiple entries, you cannot stay continuously for the whole year. For most nationalities (including USA, UK, Canada, Japan, EU), continuous stay on each tourist visit cannot exceed 90 days (180 days for US and UK nationals under specific bilateral agreements). Business visas generally allow up to 180 continuous days per visit.",
    officialAdvice: "Overstaying your permitted continuous duration results in heavy financial penalties, detention, and future entry bans.",
    category: "Travel & Stay",
  },
  {
    term: "Biometric Capture upon Arrival",
    aliases: ["biometrics", "fingerprints", "face scan", "immigration counter"],
    shortDesc: "Mandatory fingerprint scanning and digital photograph taken at the airport immigration counter.",
    detailedExplanation:
      "When arriving at an Indian airport on an e-Visa, you proceed to the dedicated 'e-Visa Counters'. The immigration officer will scan your 10 fingerprints electronically, take a digital webcam photo, and stamp your passport with the physical entry visa stamp citing your ETA details.",
    officialAdvice: "Ensure your fingers are clean, dry, and free from cuts or temporary henna tattoos that can interfere with optical fingerprint scanners.",
    category: "Immigration & Border",
  },
  {
    term: "Restricted / Protected Area Permits (RAP / PAP)",
    aliases: ["rap", "pap", "restricted area", "ladakh", "andaman", "sikkim", "northeast"],
    shortDesc: "Special additional permits required to travel to sensitive border regions in India.",
    detailedExplanation:
      "A standard Indian visa or e-Visa does NOT automatically authorize travel to protected or restricted border zones, including certain areas of Ladakh, Sikkim, Arunachal Pradesh, parts of Himachal Pradesh/Uttarakhand, and specific Andaman & Nicobar islands. Foreigners must obtain a RAP or PAP from the Ministry of Home Affairs or designated local magistrates.",
    officialAdvice: "Check whether your planned tour itinerary enters restricted zones and apply for the permit through registered tour agencies.",
    category: "Travel & Stay",
  },
  {
    term: "FRRO Registration",
    aliases: ["frro", "foreigners registration", "registration", "180 days"],
    shortDesc: "Foreigners Regional Registration Office requirement for long-term foreign residents.",
    detailedExplanation:
      "Foreigners visiting India on long-term visas (such as Student, Employment, Research, or Medical visas exceeding 180 days) are required to register online with the FRRO (e-FRRO portal) within 14 days of arrival. Tourist e-Visa holders staying within the 90/180 day limit do NOT need to register with FRRO.",
    officialAdvice: "Registration is done completely online at indianfrro.gov.in; do not visit physical police stations unless summoned.",
    category: "Immigration & Border",
  },
];

export const CURATED_FAQS: CuratedFaq[] = [
  {
    id: "faq_evisa_window",
    question: "When should I submit my Indian e-Visa application?",
    category: "Timeline & Submission",
    keywords: ["when", "window", "timeline", "how early", "advance", "days before"],
    answer:
      "For 1-year and 5-year Tourist e-Visas, you can apply between 120 days and 4 days prior to your travel date. For 30-day Tourist e-Visas, you can apply 30 days to 4 days before arrival. We strongly recommend applying 2 to 3 weeks in advance to allow for document clarifications.",
  },
  {
    id: "faq_processing_time",
    question: "How long does official Indian e-Visa processing take?",
    category: "Timeline & Submission",
    keywords: ["how long", "processing time", "duration", "hours", "wait"],
    answer:
      "Standard processing time is typically 72 hours (3 business days), though some applications are approved within 24–48 hours. However, applications from certain nationalities or with unclear scans may take 5 to 7 days. Track your official status on indianvisaonline.gov.in.",
  },
  {
    id: "faq_photo_specs",
    question: "What are the exact photo specifications for the application?",
    category: "Documents & Specs",
    keywords: ["photo", "picture", "specifications", "size", "dimensions", "glasses", "white background"],
    answer:
      "The photo must be: 1) Square aspect ratio (equal height and width), 2) Minimum 350x350 pixels (recommended 600x600), 3) Plain white background, 4) JPEG format between 10 KB and 1 MB, 5) Full face view with eyes open, no shadows, and no spectacles/tinted glasses.",
  },
  {
    id: "faq_passport_pdf_specs",
    question: "What are the passport file scan specifications?",
    category: "Documents & Specs",
    keywords: ["passport scan", "pdf size", "passport requirements", "bio page"],
    answer:
      "Your passport bio-data page must be uploaded in PDF format only. File size must be between 10 KB and 300 KB on the official portal (up to 1 MB in our practice tool). It must clearly show your photo, full name, date of birth, passport number, issue/expiry dates, and machine-readable code lines.",
  },
  {
    id: "faq_extendable",
    question: "Can an Indian e-Visa be extended or converted once inside India?",
    category: "Immigration & Border",
    keywords: ["extend", "extension", "convert", "stay longer", "renew visa"],
    answer:
      "No. Indian e-Visas are strictly NON-EXTENDABLE and NON-CONVERTIBLE under Indian Immigration Law. You cannot convert an e-Tourist visa into an employment, student, or business visa within India. If you need a longer stay, you must depart before your permitted duration expires.",
  },
  {
    id: "faq_fees",
    question: "How much does the Indian e-Visa fee cost?",
    category: "Application & Fees",
    keywords: ["fee", "cost", "price", "how much", "payment", "dollars"],
    answer:
      "Fees vary significantly by nationality, visa type, and season. For example, 30-day tourist e-Visas often cost $10–$25 (depending on off-peak vs peak season), while 1-year and 5-year tourist e-Visas range from $40 to $80 for most Western countries. Certain nationalities (e.g. Japan, Singapore) have reciprocal reduced rates. Verify exact fees directly on the official portal payment step.",
  },
  {
    id: "faq_multiple_entry",
    question: "What does 'Multiple Entry' mean for Indian Tourist Visas?",
    category: "Travel & Stay",
    keywords: ["multiple entry", "double entry", "re-enter", "leave and come back", "nepal"],
    answer:
      "Multiple Entry allows you to enter and exit India multiple times during the overall validity period of the visa (e.g., 1 year or 5 years), provided each continuous stay does not exceed 90 days. This is ideal if you plan to visit neighboring countries like Nepal, Bhutan, or Sri Lanka and re-enter India.",
  },
  {
    id: "faq_satellite_phone",
    question: "Are satellite phones or drone cameras permitted in India?",
    category: "Immigration & Border",
    keywords: ["satellite phone", "thuraya", "iridium", "drone", "camera", "customs", "prohibited"],
    answer:
      "STRICT WARNING: Satellite phones (such as Thuraya, Iridium, or Inmarsat) are strictly banned in India under the Indian Telegraph Act unless pre-authorized by the Ministry of Communications. Carrying an unauthorized satellite phone can lead to arrest and confiscation. Drones also require specific DGCA permissions and cannot be flown recreationally by foreign tourists.",
  },
];

/**
 * Returns contextual quick questions based on the page route.
 */
export function getContextualSuggestions(routePath: string): string[] {
  if (routePath.includes("document-checker")) {
    return [
      "What are the photo dimensions?",
      "Why must passport be a PDF?",
      "Can I take photo with my smartphone?",
      "How to compress my PDF under 1MB?",
    ];
  }
  if (routePath.includes("apply")) {
    return [
      "What should I write for 'Reference in India'?",
      "What is the 6-month passport validity rule?",
      "Can I use my hotel as my address?",
      "What if my name has special characters?",
    ];
  }
  if (routePath.includes("visa-finder") || routePath.includes("compare")) {
    return [
      "e-Visa vs Regular Sticker Visa",
      "Continuous stay limit (90 vs 180 days)",
      "Can I do remote work on a tourist visa?",
      "Which nationalities need embassy visit?",
    ];
  }
  if (routePath.includes("tracker")) {
    return [
      "How long does official processing take?",
      "What does 'ETA Granted' mean?",
      "What if my application is marked 'Documents Required'?",
      "Where do I track real applications?",
    ];
  }
  if (routePath.includes("dashboard")) {
    return [
      "How do I achieve 100% readiness score?",
      "When is my official submission window?",
      "Can I print my practice application summary?",
      "Are satellite phones allowed in India?",
    ];
  }
  return [
    "When should I apply for an e-Visa?",
    "6-Month Passport Validity Rule",
    "What is 'Reference in India'?",
    "Photo & passport specifications",
  ];
}

/**
 * Intelligent question answerer matching against the curated dataset,
 * dictionary definitions, and FAQ entries.
 */
export function answerQuestion(query: string, currentPath = "/"): {
  text: string;
  source: "faq" | "dictionary" | "general" | "greeting";
  matchedTitle?: string;
  officialNotice?: string;
} {
  const q = query.trim().toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|namaste|greetings|good morning|good evening)/i.test(q)) {
    return {
      text: "Namaste! 🙏 I am Yatra, your VisaEase intelligence guide. I can explain confusing visa terms (like 'Reference in India', '6-month rule', 'e-Visa vs Regular'), provide photo/PDF specs, or help you prepare your application.",
      source: "greeting",
    };
  }

  // Dictionary Lookup
  for (const def of VISA_TERMS_DICTIONARY) {
    const matchesTerm = q.includes(def.term.toLowerCase());
    const matchesAlias = def.aliases.some((alias) => q.includes(alias.toLowerCase()));
    if (matchesTerm || matchesAlias) {
      return {
        text: `**${def.term}**\n\n${def.shortDesc}\n\n${def.detailedExplanation}\n\n*Important:* ${def.officialAdvice}`,
        source: "dictionary",
        matchedTitle: def.term,
        officialNotice: "Official requirements are managed by the Indian Bureau of Immigration.",
      };
    }
  }

  // FAQ Lookup
  for (const faq of CURATED_FAQS) {
    const hits = faq.keywords.filter((kw) => q.includes(kw));
    if (hits.length >= 1 || q.includes(faq.question.toLowerCase())) {
      return {
        text: `${faq.answer}`,
        source: "faq",
        matchedTitle: faq.question,
        officialNotice: "Always verify on the official portal: indianvisaonline.gov.in",
      };
    }
  }

  // Context-specific fallback
  if (currentPath.includes("document-checker") && (q.includes("file") || q.includes("upload") || q.includes("format"))) {
    return {
      text: "For the Document Checker: Indian e-Visa rules require your Passport bio-page as a PDF (up to 1 MB in practice) and your Photograph as JPEG or PNG (minimum 350x350px with a solid white background). Check both slots on this page to test your files locally.",
      source: "general",
    };
  }

  return {
    text: "I do not have a verified answer for that specific query in my curated dataset. To maintain strict accuracy and prevent misinformation, please check the official Government of India portal at **indianvisaonline.gov.in** or try asking about: *photo requirements, 6-month validity rule, reference in India, processing times, or e-Visa vs regular visa*.",
    source: "general",
    officialNotice: "VisaEase never invents official immigration rules.",
  };
}
