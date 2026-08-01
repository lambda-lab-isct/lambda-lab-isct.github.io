import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve("private-source/publications/abstract.csv");
const bibSourcePath = path.resolve(
  "private-source/publications/recent-publications-2022-2026.bib",
);
const outputPath = path.resolve("src/data/publications.json");
const overridesPath = path.resolve("scripts/publication-overrides.json");

const allowedRecordStatuses = new Set(["verified", "partially_verified"]);
const excludedRecordStatuses = new Set(["unresolved", "non_publication"]);
const internalFields = new Set([
  "verification_source",
  "verification_url",
  "verification_notes",
  "verified_fields",
  "source_row_number",
  "source_title",
  "abstract_source",
  "abstract_source_url",
  "abstract_checked_at",
  "abstract_notes",
  "notes",
]);
const publicFields = [
  "publication_id",
  "title",
  "title_english",
  "authors",
  "authors_romanized",
  "publication_type",
  "language",
  "peer_reviewed",
  "publication_year",
  "publication_date",
  "journal_or_proceedings_title",
  "journal_or_proceedings_title_abbrev",
  "volume",
  "issue",
  "start_page",
  "end_page",
  "article_number",
  "publisher",
  "conference_name",
  "conference_acronym",
  "conference_location",
  "series_title",
  "series_volume",
  "editors",
  "doi",
  "isbn",
  "issn",
  "url",
  "open_access_url",
  "repository_url",
  "abstract",
  "keywords",
  "research_area",
  "record_status",
  "source_key",
  "publisher_address",
];
const bibtexPublicationIds = {
  nishizaki2022extracting: "Nishizaki2022ExtractingEnvironments",
  kasuga2022formalizing: "Kasuga2022FormalizingDynamicWind",
  nishizaki2022preface: "Nishizaki2022PrefaceHagiya",
  nishizaki2023transplanting: "Nishizaki2023TransplantingEnvironments",
  daiki2024time: "Daiki2024TimeEfficiency",
  kaneshita2025strong: "Kaneshita2025StrongNormalizability",
  hirose2025verification: "Hirose2025ControllerInputFeasibility",
  kaneshita2026destructive: "Kaneshita2026DestructiveEnvironmentOperations",
  miyazawa2026matrix: "Miyazawa2026MatrixCoeffectAlgebra",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field);
  if (row.length > 1 || row[0] !== "") rows.push(row);
  return rows;
}

function rowsToObjects(rows) {
  const [headers, ...body] = rows;
  return body
    .filter((row) => row.some((field) => field.trim() !== ""))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? ""]),
      ),
    );
}

function normalizeDoi(value) {
  return value
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/[.,;)\s]+$/g, "")
    .toLowerCase();
}

function normalizeTitle(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSelectionText(value) {
  return `${value ?? ""}`
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "")
    .trim();
}

function normalizeEvidenceText(value) {
  return `${value ?? ""}`.normalize("NFKC").toLowerCase();
}

function publicationSelectionEvidence(record) {
  return normalizeEvidenceText(
    [
      record.publisher,
      record.journal_or_proceedings_title,
      record.conference_name,
      record.conference_acronym,
      record.series_title,
      record.doi,
      record.url,
      record.open_access_url,
      record.repository_url,
      record.isbn,
      record.issn,
    ].join(" | "),
  );
}

function publicationCategory(row) {
  const type = row.publication_type.toLowerCase();
  const venue = [
    row.journal_or_proceedings_title,
    row.conference_name,
    row.series_title,
  ]
    .join(" ")
    .toLowerCase();

  if (type.includes("journal") || type.includes("review")) return "journal";
  if (type.includes("book")) return "book";
  if (type.includes("workshop") || venue.includes("workshop"))
    return "workshop";
  if (type.includes("conference")) return "conference";
  return "other";
}

function cleanPublicRecord(row) {
  const record = {};
  for (const field of publicFields) {
    if (internalFields.has(field)) continue;
    const value = row[field]?.trim() ?? "";
    if (field === "doi") {
      record[field] = normalizeDoi(value);
    } else if (field === "publication_year") {
      record[field] = Number.parseInt(value, 10);
    } else if (field === "peer_reviewed") {
      record[field] = value === "" ? null : value.toLowerCase() === "true";
    } else {
      record[field] = value;
    }
  }

  record.category = publicationCategory(row);
  record.doi_url = record.doi ? `https://doi.org/${record.doi}` : "";
  return Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => value !== "" && value !== null && !Number.isNaN(value),
    ),
  );
}

function readBalancedValue(text, startIndex, opener, closer) {
  let depth = 0;
  let value = "";
  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i];
    if (char === opener) {
      depth += 1;
      if (depth > 1) value += char;
    } else if (char === closer) {
      depth -= 1;
      if (depth === 0) return { value, nextIndex: i + 1 };
      value += char;
    } else {
      value += char;
    }
  }
  throw new Error("Unclosed BibTeX value");
}

function readQuotedValue(text, startIndex) {
  let value = "";
  let escaped = false;
  for (let i = startIndex + 1; i < text.length; i += 1) {
    const char = text[i];
    if (escaped) {
      value += char;
      escaped = false;
    } else if (char === "\\") {
      value += char;
      escaped = true;
    } else if (char === '"') {
      return { value, nextIndex: i + 1 };
    } else {
      value += char;
    }
  }
  throw new Error("Unclosed quoted BibTeX value");
}

function readBareValue(text, startIndex) {
  let value = "";
  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i];
    if (char === "," || char === "\n" || char === "\r") {
      return { value: value.trim(), nextIndex: i };
    }
    value += char;
  }
  return { value: value.trim(), nextIndex: text.length };
}

function parseBibtexFields(body) {
  const fields = {};
  let index = 0;

  while (index < body.length) {
    while (index < body.length && /[\s,]/.test(body[index])) index += 1;
    if (index >= body.length) break;

    const nameStart = index;
    while (index < body.length && /[A-Za-z0-9_-]/.test(body[index])) index += 1;
    const name = body.slice(nameStart, index).trim().toLowerCase();
    while (index < body.length && /\s/.test(body[index])) index += 1;
    if (body[index] !== "=") {
      throw new Error(
        `Invalid BibTeX field near: ${body.slice(nameStart, nameStart + 40)}`,
      );
    }
    index += 1;
    while (index < body.length && /\s/.test(body[index])) index += 1;

    let parsed;
    if (body[index] === "{") {
      parsed = readBalancedValue(body, index, "{", "}");
    } else if (body[index] === '"') {
      parsed = readQuotedValue(body, index);
    } else {
      parsed = readBareValue(body, index);
    }

    fields[name] = parsed.value.trim();
    index = parsed.nextIndex;
    while (index < body.length && body[index] !== ",") index += 1;
    if (body[index] === ",") index += 1;
  }

  return fields;
}

function parseBibtex(text) {
  const entries = [];
  let index = 0;

  while (index < text.length) {
    const at = text.indexOf("@", index);
    if (at === -1) break;
    index = at + 1;

    const typeStart = index;
    while (index < text.length && /[A-Za-z]/.test(text[index])) index += 1;
    const entryType = text.slice(typeStart, index).toLowerCase();
    while (index < text.length && /\s/.test(text[index])) index += 1;

    const opener = text[index];
    const closer = opener === "{" ? "}" : ")";
    if (opener !== "{" && opener !== "(") {
      throw new Error(`Invalid BibTeX entry opener for @${entryType}`);
    }

    const parsedEntry = readBalancedValue(text, index, opener, closer);
    const body = parsedEntry.value;
    const keyEnd = body.indexOf(",");
    if (keyEnd === -1) throw new Error(`Missing BibTeX key for @${entryType}`);

    const sourceKey = body.slice(0, keyEnd).trim();
    entries.push({
      entryType,
      sourceKey,
      fields: parseBibtexFields(body.slice(keyEnd + 1)),
    });
    index = parsedEntry.nextIndex;
  }

  return entries;
}

function splitPages(value) {
  const normalized = value.trim().replace(/\s*--\s*/g, "-");
  const [start, end] = normalized.split("-", 2);
  return { start_page: start, end_page: end ?? "" };
}

function formatBibtexAuthors(value) {
  return value
    .split(/\s+and\s+/i)
    .map((author) => author.trim())
    .filter(Boolean)
    .join("; ");
}

function bibtexPublicationType(entryType) {
  if (entryType === "article") return "journal article";
  if (entryType === "inproceedings") return "conference paper";
  return entryType;
}

function bibtexRowToPublicRecord(entry) {
  const id = bibtexPublicationIds[entry.sourceKey];
  if (!id) {
    throw new Error(
      `No publication_id mapping for BibTeX key: ${entry.sourceKey}`,
    );
  }

  const fields = entry.fields;
  const pages = splitPages(fields.pages ?? "");
  const doi = normalizeDoi(fields.doi ?? "");
  const record = {
    publication_id: id,
    title: fields.title ?? "",
    authors: formatBibtexAuthors(fields.author ?? ""),
    authors_romanized: formatBibtexAuthors(fields.author ?? ""),
    publication_type: bibtexPublicationType(entry.entryType),
    language: "English",
    peer_reviewed: true,
    publication_year: Number.parseInt(fields.year ?? "", 10),
    journal_or_proceedings_title: fields.booktitle ?? fields.journal ?? "",
    volume: fields.volume ?? "",
    issue: fields.number ?? "",
    start_page: pages.start_page,
    end_page: pages.end_page,
    publisher: fields.publisher ?? "",
    publisher_address: fields.address ?? "",
    series_title: fields.series ?? "",
    doi,
    url: doi ? `https://doi.org/${doi}` : "",
    source_key: entry.sourceKey,
    record_status: "user_provided_bibtex",
  };

  record.category = publicationCategory(record);
  record.doi_url = record.doi ? `https://doi.org/${record.doi}` : "";
  return Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => value !== "" && value !== null && !Number.isNaN(value),
    ),
  );
}

function loadPublicationOverrides(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      excludedPublicationIds: new Map(),
      canonicalPublicationIds: new Set(),
      retainedSimilarPublicationPairs: new Set(),
      publicationSelectionPolicy: null,
    };
  }

  const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const excludedPublications =
    config.excludedPublications ?? config.excluded_publications ?? [];
  const retainedSimilarPublications =
    config.retainedSimilarPublications ??
    config.retained_similar_publications ??
    [];
  return {
    excludedPublicationIds: new Map(
      excludedPublications.map((item) => [
        item.excludePublicationId ?? item.publication_id,
        item,
      ]),
    ),
    canonicalPublicationIds: new Set(
      excludedPublications
        .map(
          (item) =>
            item.canonicalPublicationId ?? item.canonical_publication_id,
        )
        .filter(Boolean),
    ),
    retainedSimilarPublicationPairs: new Set(
      retainedSimilarPublications.map((item) =>
        [...item.publicationIds].sort().join("::"),
      ),
    ),
    publicationSelectionPolicy: config.publicationSelectionPolicy ?? null,
  };
}

function matchConfiguredPublication(record, configuredPublication) {
  if (configuredPublication.publicationId === record.publication_id) {
    return true;
  }

  if (!configuredPublication.title) {
    return false;
  }

  return (
    normalizeSelectionText(configuredPublication.title) ===
    normalizeSelectionText(record.title)
  );
}

function findSelectionEvidenceMatch(evidence, configuredEntries) {
  for (const entry of configuredEntries ?? []) {
    const matchedNeedle = (entry.needles ?? []).find((needle) =>
      evidence.includes(normalizeEvidenceText(needle)),
    );

    if (matchedNeedle) {
      return {
        name: entry.name,
        matchedNeedle,
        reason: entry.reason,
      };
    }
  }

  return null;
}

function selectPublicationForPublicList(record, selectionPolicy) {
  if (!selectionPolicy) {
    return {
      included: true,
      reason: "selection_policy_not_configured",
    };
  }

  const mandatoryExclusion = (selectionPolicy.mandatoryExclusions ?? []).find(
    (item) => matchConfiguredPublication(record, item),
  );
  if (mandatoryExclusion) {
    return {
      included: false,
      reason: "mandatory_preface_exclusion",
      selection_rule: "mandatory_exclusion",
      detail: mandatoryExclusion.reason,
    };
  }

  const mandatoryInclusion = (selectionPolicy.mandatoryInclusions ?? []).find(
    (item) => matchConfiguredPublication(record, item),
  );
  if (mandatoryInclusion) {
    return {
      included: true,
      reason: "mandatory_japanese_exception",
      selection_rule: "mandatory_inclusion",
      publisher_group: "Mandatory Japanese exception",
      detail: mandatoryInclusion.reason,
    };
  }

  const evidence = publicationSelectionEvidence(record);
  const disallowedPublisher = findSelectionEvidenceMatch(
    evidence,
    selectionPolicy.disallowedPublishers,
  );
  if (disallowedPublisher) {
    return {
      included: false,
      reason:
        disallowedPublisher.name === "ACTA Press"
          ? "disallowed_acta_press"
          : "disallowed_iasted",
      selection_rule: "disallowed_publisher",
      publisher_group: disallowedPublisher.name,
      matched_evidence: disallowedPublisher.matchedNeedle,
      detail: disallowedPublisher.reason,
    };
  }

  const allowedPublisher = findSelectionEvidenceMatch(
    evidence,
    selectionPolicy.allowedPublishers,
  );
  if (allowedPublisher) {
    return {
      included: true,
      reason: "allowed_publisher",
      selection_rule: "allowed_publisher",
      publisher_group: allowedPublisher.name,
      matched_evidence: allowedPublisher.matchedNeedle,
    };
  }

  if ((record.publisher ?? "").trim()) {
    return {
      included: false,
      reason: "not_allowed_publisher",
      selection_rule: "publisher_not_allowed",
      publisher_group: record.publisher,
    };
  }

  return {
    included: false,
    reason: "publisher_unconfirmed",
    selection_rule: "publisher_unconfirmed",
  };
}

function exclusionReportItem(record, selection, extra = {}) {
  return {
    publication_id: record.publication_id,
    publication_year: record.publication_year,
    title: record.title,
    reason: selection.reason,
    selection_rule: selection.selection_rule,
    publisher_group: selection.publisher_group,
    matched_evidence: selection.matched_evidence,
    ...extra,
  };
}

const raw = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "");
const rows = rowsToObjects(parseCsv(raw));
const publicationOverrides = loadPublicationOverrides(overridesPath);
const publicationIds = new Set();
const doiKeys = new Map();
const titleYearKeys = new Map();
const duplicateCandidates = [];
const excluded = [];
const records = [];
const selectionReport = {
  included: [],
  excluded: [],
};

function publicationYearValue(row) {
  return `${row.publication_year ?? ""}`.trim();
}

function isRetainedSimilarPair(publicationIds) {
  const key = [...publicationIds].sort().join("::");
  return publicationOverrides.retainedSimilarPublicationPairs.has(key);
}

function trackDuplicateCandidates(row) {
  const doi = normalizeDoi(row.doi ?? "");
  if (doi) {
    const previous = doiKeys.get(doi);
    if (previous) {
      const publicationIds = [previous.publication_id, row.publication_id];
      if (!isRetainedSimilarPair(publicationIds)) {
        duplicateCandidates.push({
          key: doi,
          reason: "doi",
          publication_ids: publicationIds,
        });
      }
    } else {
      doiKeys.set(doi, row);
    }
  }

  const title = normalizeTitle(row.title ?? "");
  const year = publicationYearValue(row);
  if (title && year) {
    const key = `${title}::${year}`;
    const previous = titleYearKeys.get(key);
    if (previous) {
      const publicationIds = [previous.publication_id, row.publication_id];
      if (!isRetainedSimilarPair(publicationIds)) {
        duplicateCandidates.push({
          key,
          reason: "title_year",
          publication_ids: publicationIds,
        });
      }
    } else {
      titleYearKeys.set(key, row);
    }
  }
}

for (const row of rows) {
  const recordStatus = row.record_status.trim();
  const requiredMissing = [
    "publication_id",
    "title",
    "authors",
    "publication_year",
  ].filter((field) => !row[field]?.trim());

  const overrideExclusion = publicationOverrides.excludedPublicationIds.get(
    row.publication_id,
  );
  if (overrideExclusion) {
    excluded.push({
      publication_id: row.publication_id,
      reason: "publication_override",
      canonical_publication_id:
        overrideExclusion.canonicalPublicationId ??
        overrideExclusion.canonical_publication_id,
    });
    continue;
  }

  if (excludedRecordStatuses.has(recordStatus)) {
    excluded.push({ publication_id: row.publication_id, reason: recordStatus });
    continue;
  }

  if (!allowedRecordStatuses.has(recordStatus)) {
    excluded.push({
      publication_id: row.publication_id,
      reason: "record_status",
    });
    continue;
  }

  if (requiredMissing.length > 0) {
    excluded.push({
      publication_id: row.publication_id,
      reason: `missing ${requiredMissing.join(", ")}`,
    });
    continue;
  }

  if (publicationIds.has(row.publication_id)) {
    duplicateCandidates.push({
      key: row.publication_id,
      reason: "publication_id",
    });
    continue;
  }
  publicationIds.add(row.publication_id);

  const publicRecord = cleanPublicRecord(row);
  const selection = selectPublicationForPublicList(
    publicRecord,
    publicationOverrides.publicationSelectionPolicy,
  );
  if (!selection.included) {
    excluded.push(exclusionReportItem(publicRecord, selection));
    selectionReport.excluded.push(exclusionReportItem(publicRecord, selection));
    continue;
  }

  trackDuplicateCandidates(publicRecord);
  selectionReport.included.push({
    publication_id: publicRecord.publication_id,
    publication_year: publicRecord.publication_year,
    title: publicRecord.title,
    reason: selection.reason,
    publisher_group: selection.publisher_group,
    matched_evidence: selection.matched_evidence,
  });
  records.push(publicRecord);
}

const bibtexEntries = fs.existsSync(bibSourcePath)
  ? parseBibtex(fs.readFileSync(bibSourcePath, "utf8").replace(/^\uFEFF/, ""))
  : [];
const bibtexRecords = bibtexEntries.map(bibtexRowToPublicRecord);

for (const record of bibtexRecords) {
  const requiredMissing = [
    "publication_id",
    "title",
    "authors",
    "publication_year",
  ].filter((field) => !record[field]);

  if (requiredMissing.length > 0) {
    excluded.push({
      publication_id: record.publication_id,
      reason: `missing ${requiredMissing.join(", ")}`,
    });
    continue;
  }

  if (publicationIds.has(record.publication_id)) {
    duplicateCandidates.push({
      key: record.publication_id,
      reason: "publication_id",
    });
    continue;
  }
  publicationIds.add(record.publication_id);
  const selection = selectPublicationForPublicList(
    record,
    publicationOverrides.publicationSelectionPolicy,
  );
  if (!selection.included) {
    excluded.push(exclusionReportItem(record, selection));
    selectionReport.excluded.push(exclusionReportItem(record, selection));
    continue;
  }

  trackDuplicateCandidates(record);
  selectionReport.included.push({
    publication_id: record.publication_id,
    publication_year: record.publication_year,
    title: record.title,
    reason: selection.reason,
    publisher_group: selection.publisher_group,
    matched_evidence: selection.matched_evidence,
  });
  records.push(record);
}

records.sort((a, b) => {
  const year = (b.publication_year ?? 0) - (a.publication_year ?? 0);
  if (year !== 0) return year;
  return (a.title ?? "").localeCompare(b.title ?? "");
});

const output = {
  policy: {
    included_record_statuses: [...allowedRecordStatuses],
    excluded_record_statuses: [...excludedRecordStatuses],
  },
  import_report: {
    source_rows: rows.length,
    bibtex_source_entries: bibtexEntries.length,
    public_records: records.length,
    csv_public_records: records.filter((record) => !record.source_key).length,
    bibtex_public_records: records.filter((record) => record.source_key).length,
    excluded_records: excluded.length,
    duplicate_candidates: duplicateCandidates.length,
    duplicate_candidate_details: duplicateCandidates,
    publication_overrides: {
      excluded_publications: publicationOverrides.excludedPublicationIds.size,
      canonical_publications: publicationOverrides.canonicalPublicationIds.size,
      retained_similar_publication_pairs:
        publicationOverrides.retainedSimilarPublicationPairs.size,
    },
    publication_selection: {
      policy_priority:
        publicationOverrides.publicationSelectionPolicy?.priority ?? [],
      included_by_publisher: selectionReport.included.reduce(
        (summary, item) => {
          const key = item.publisher_group ?? item.reason;
          summary[key] = (summary[key] ?? 0) + 1;
          return summary;
        },
        {},
      ),
      excluded_by_reason: selectionReport.excluded.reduce((summary, item) => {
        summary[item.reason] = (summary[item.reason] ?? 0) + 1;
        return summary;
      }, {}),
      mandatory_inclusions: selectionReport.included.filter(
        (item) => item.reason === "mandatory_japanese_exception",
      ),
      mandatory_exclusions: selectionReport.excluded.filter(
        (item) => item.reason === "mandatory_preface_exclusion",
      ),
    },
    excluded_record_summary: excluded.reduce((summary, item) => {
      summary[item.reason] = (summary[item.reason] ?? 0) + 1;
      return summary;
    }, {}),
    year_range: records.reduce(
      (range, record) => {
        const year = record.publication_year;
        if (typeof year === "number") {
          range.min = Math.min(range.min, year);
          range.max = Math.max(range.max, year);
        }
        return range;
      },
      { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
    ),
  },
  records,
};

if (output.import_report.year_range.min === Number.POSITIVE_INFINITY) {
  output.import_report.year_range = null;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      source_rows: output.import_report.source_rows,
      public_records: output.import_report.public_records,
      excluded_records: output.import_report.excluded_records,
      duplicate_candidates: output.import_report.duplicate_candidates,
      year_range: output.import_report.year_range,
    },
    null,
    2,
  ),
);
