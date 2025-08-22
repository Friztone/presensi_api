import { db } from "../database";

export interface MataKuliah {
  kode_mk: string;
  nama_mk: string;
  sks: number;
}

export async function getAllMataKuliah(): Promise<MataKuliah[]> {
  const [rows] = await db.query("SELECT * FROM mata_kuliah");
  return rows as MataKuliah[];
}

export async function getMataKuliahByKode(
  kode_mk: string
): Promise<MataKuliah | null> {
  const [rows] = await db.query("SELECT * FROM mata_kuliah WHERE kode_mk = ?", [
    kode_mk,
  ]);
  const data = (rows as MataKuliah[])[0];
  return data || null;
}

export async function createMataKuliah(data: MataKuliah): Promise<void> {
  await db.query(
    "INSERT INTO mata_kuliah (kode_mk, nama_mk, sks) VALUES (?, ?, ?)",
    [data.kode_mk, data.nama_mk, data.sks]
  );
}

export async function updateMataKuliah(
  kode_mk: string,
  data: Partial<MataKuliah>
): Promise<void> {
  await db.query(
    "UPDATE mata_kuliah SET nama_mk = ?, sks = ? WHERE kode_mk = ?",
    [data.nama_mk, data.sks, kode_mk]
  );
}

export async function deleteMataKuliah(kode_mk: string): Promise<void> {
  await db.query("DELETE FROM mata_kuliah WHERE kode_mk = ?", [kode_mk]);
}
