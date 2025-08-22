import { db } from "../database";

export interface Dosen {
  nidn: string;
  nama: string;
}

export async function getAllDosen(): Promise<Dosen[]> {
  const [rows] = await db.query("SELECT * FROM dosen");
  return rows as Dosen[];
}

export async function getDosenByNIDN(nidn: string): Promise<Dosen | null> {
  const [rows] = await db.query("SELECT * FROM dosen WHERE nidn = ?", [nidn]);
  const data = (rows as Dosen[])[0];
  return data || null;
}

export async function createDosen(data: Dosen): Promise<void> {
  await db.query("INSERT INTO dosen (nidn, nama) VALUES (?, ?)", [
    data.nidn,
    data.nama,
  ]);
}

export async function updateDosen(
  nidn: string,
  data: Partial<Dosen>
): Promise<void> {
  await db.query("UPDATE dosen SET nama = ? WHERE nidn = ?", [data.nama, nidn]);
}

export async function deleteDosen(nidn: string): Promise<void> {
  await db.query("DELETE FROM dosen WHERE nidn = ?", [nidn]);
}
