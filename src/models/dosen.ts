import { db } from "../database";

export interface Dosen {
  nidn: string;
  nama_dosen: string;
  email?: string;
  no_telp?: string;
}

// Ambil semua dosen
export async function getAllDosen(): Promise<Dosen[]> {
  const [rows] = await db.query(
    `SELECT nidn, nama_dosen, email, no_telp FROM dosen`
  );
  return rows as Dosen[];
}

// Ambil dosen berdasarkan NIDN
export async function getDosenByNidn(nidn: string): Promise<Dosen | null> {
  const [rows] = await db.query(
    `SELECT nidn, nama_dosen, email, no_telp FROM dosen WHERE nidn = ?`,
    [nidn]
  );
  return (rows as Dosen[])[0] || null;
}

// Tambah dosen baru
export async function createDosen(data: Dosen): Promise<void> {
  await db.query(
    `INSERT INTO dosen (nidn, nama_dosen, email, no_telp) VALUES (?, ?, ?, ?)`,
    [data.nidn, data.nama_dosen, data.email || null, data.no_telp || null]
  );
}

// Update dosen berdasarkan NIDN
export async function updateDosen(
  nidn: string,
  data: Partial<Dosen>
): Promise<void> {
  await db.query(
    `UPDATE dosen SET nama_dosen = ?, email = ?, no_telp = ? WHERE nidn = ?`,
    [data.nama_dosen, data.email, data.no_telp, nidn]
  );
}

// Hapus dosen berdasarkan NIDN
export async function deleteDosen(nidn: string): Promise<void> {
  await db.query(`DELETE FROM dosen WHERE nidn = ?`, [nidn]);
}
