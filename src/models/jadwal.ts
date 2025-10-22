import { db } from "../database";

export interface Jadwal {
  id?: number;
  kode_mk: string;
  nama_mk?: string;
  nidn: string;
  nama_dosen?: string;
  jam_mulai: string;
  jam_selesai: string;
  token_qr: string;
  deskripsi: string;
  jumlah?: number;
}

// Ambil semua jadwal
export async function getAllJadwal(): Promise<Jadwal[]> {
  const [rows] = await db.query(`
    SELECT 
      j.id, j.kode_mk, mk.nama_mk,
      j.nidn, d.nama_dosen,
      j.jam_mulai, j.jam_selesai,
      j.token_qr, j.deskripsi,
      j.jumlah
    FROM jadwal j
    LEFT JOIN mata_kuliah mk ON j.kode_mk = mk.kode_mk
    LEFT JOIN dosen d ON j.nidn = d.nidn
  `);
  return rows as Jadwal[];
}

// Ambil jadwal berdasarkan ID
export async function getJadwalById(id: number): Promise<Jadwal | null> {
  const [rows] = await db.query(
    `
    SELECT 
      j.id, j.kode_mk, mk.nama_mk,
      j.nidn, d.nama_dosen,
      j.jam_mulai, j.jam_selesai,
      j.token_qr, j.deskripsi,
      j.jumlah
    FROM jadwal j
    LEFT JOIN mata_kuliah mk ON j.kode_mk = mk.kode_mk
    LEFT JOIN dosen d ON j.nidn = d.nidn
    WHERE j.id = ?
  `,
    [id]
  );
  return (rows as Jadwal[])[0] || null;
}

// Tambah jadwal baru
export async function createJadwal(data: Jadwal): Promise<void> {
  await db.query(
    `
    INSERT INTO jadwal (kode_mk, nidn, jam_mulai, jam_selesai, token_qr, deskripsi, jumlah)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [
      data.kode_mk,
      data.nidn,
      data.jam_mulai,
      data.jam_selesai,
      data.token_qr,
      data.deskripsi,
      data.jumlah ?? 0,
    ]
  );
}

// Update jadwal berdasarkan ID
export async function updateJadwal(
  id: number,
  data: Partial<Jadwal>
): Promise<void> {
  await db.query(
    `
    UPDATE jadwal
    SET kode_mk = ?, nidn = ?, jam_mulai = ?, jam_selesai = ?, token_qr = ?, deskripsi = ?, jumlah = ?
    WHERE id = ?
  `,
    [
      data.kode_mk,
      data.nidn,
      data.jam_mulai,
      data.jam_selesai,
      data.token_qr,
      data.deskripsi,
      data.jumlah ?? 0,
      id,
    ]
  );
}

// Hapus jadwal
export async function deleteJadwal(id: number): Promise<void> {
  await db.query(`DELETE FROM jadwal WHERE id = ?`, [id]);
}
