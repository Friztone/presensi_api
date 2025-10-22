import { db } from "../database";

export interface Dosen {
  nidn: string;
  nama_dosen: string;
  password: string;
}

// Ambil semua dosen
export async function getAllDosen(): Promise<Dosen[]> {
  const [rows] = await db.query(`SELECT nidn, nama_dosen, password FROM dosen`);
  return rows as Dosen[];
}

// Ambil dosen berdasarkan NIDN
export async function getDosenByNidn(nidn: string): Promise<Dosen | null> {
  const [rows] = await db.query(
    `SELECT nidn, nama_dosen, password FROM dosen WHERE nidn = ?`,
    [nidn]
  );
  return (rows as Dosen[])[0] || null;
}

// Tambah dosen baru
export async function createDosen(data: Dosen): Promise<void> {
  await db.query(
    `INSERT INTO dosen (nidn, nama_dosen, password) VALUES (?, ?, ?)`,
    [data.nidn, data.nama_dosen, data.password]
  );
}

// Update dosen berdasarkan NIDN
export async function updateDosen(
  nidn: string,
  data: Partial<Dosen>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (typeof data.nama_dosen !== "undefined") {
    fields.push("nama_dosen = ?");
    values.push(data.nama_dosen);
  }

  if (typeof data.password !== "undefined") {
    fields.push("password = ?");
    values.push(data.password);
  }

  if (fields.length === 0) return;

  values.push(nidn);

  await db.query(
    `UPDATE dosen SET ${fields.join(", ")} WHERE nidn = ?`,
    values
  );
}

// Hapus dosen berdasarkan NIDN
export async function deleteDosen(nidn: string): Promise<void> {
  await db.query(`DELETE FROM dosen WHERE nidn = ?`, [nidn]);
}
