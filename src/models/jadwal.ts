import { db } from "../database";

export interface Jadwal {
  id?: number;
  kode_mk: string;
  nidn: string;
  tanggal: string; // YYYY-MM-DD
  jam_mulai: string; // HH:MM:SS
  jam_selesai: string; // HH:MM:SS
  token_qr: string;
}

export async function getAllJadwal(): Promise<Jadwal[]> {
  const [rows] = await db.query("SELECT * FROM jadwal");
  return rows as Jadwal[];
}

export async function getJadwalById(id: number): Promise<Jadwal | null> {
  const [rows] = await db.query("SELECT * FROM jadwal WHERE id = ?", [id]);
  const data = (rows as Jadwal[])[0];
  return data || null;
}

export async function createJadwal(data: Jadwal): Promise<void> {
  await db.query(
    "INSERT INTO jadwal (kode_mk, nidn, tanggal, jam_mulai, jam_selesai, token_qr) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.kode_mk,
      data.nidn,
      data.tanggal,
      data.jam_mulai,
      data.jam_selesai,
      data.token_qr,
    ]
  );
}

export async function updateJadwal(
  id: number,
  data: Partial<Jadwal>
): Promise<void> {
  await db.query(
    "UPDATE jadwal SET kode_mk = ?, nidn = ?, tanggal = ?, jam_mulai = ?, jam_selesai = ?, token_qr = ? WHERE id = ?",
    [
      data.kode_mk,
      data.nidn,
      data.tanggal,
      data.jam_mulai,
      data.jam_selesai,
      data.token_qr,
      id,
    ]
  );
}

export async function deleteJadwal(id: number): Promise<void> {
  await db.query("DELETE FROM jadwal WHERE id = ?", [id]);
}
