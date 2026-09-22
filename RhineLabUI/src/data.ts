import content from "../content/archives.json" with { type: "json" };

export interface ArchiveRecord {
  id: string;
  title: string;
  en: string;
  department: string;
  category: string;
  date: string;
  lead: string;
  clearance: string;
  abstract: string;
  findings: string[];
  source: string;
  project?: { category: string; status: string; prototype: string };
}

export const records: ArchiveRecord[] = content.records;
export const categories = ["全部档案", ...content.categories];
export const archiveColumns = content.columns;
// Names and destinations follow app/work/museum-data.ts in column order.
export const projectColumns = [
  { name: "SANGRE", href: "/work/sangre" },
  { name: "BAMBINO V2", href: "/work/bambino" },
  { name: "SIMPLE UNI LIFE", href: "/work/simple-uni-life" },
  { name: "ENERGIZER PACKAGING", href: "/work/battery-packaging" },
  { name: "ARTI64 模型车架", href: "/work/vertical-car-park" },
];
export const projectColumnNames = projectColumns.map(project => project.name);

export function columnFiles(lane: number) {
  return records
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => record.category === archiveColumns[lane])
    .map(({ index }) => index);
}
export function fileLocation(index: number) {
  const lane = archiveColumns.indexOf(records[index].category);
  const row = 12 + columnFiles(lane).indexOf(index);
  return { lane, row, slot: lane * 32 + row };
}
export function fileAtSlot(slot: number) {
  const files = columnFiles(Math.floor(slot / 32));
  return files[Math.max(0, Math.min(files.length - 1, (slot % 32) - 12))];
}
