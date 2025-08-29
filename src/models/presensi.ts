import { db } from "../database";

export interface Presensi {
  id?: number;
  nim: string;
  jadwal_id: number;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  waktu_presensi?: string | null;
  token_qr: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PresensiDetail extends Presensi {
  nama_mahasiswa?: string | null;
  nama_mk?: string | null;
  nama_dosen?: string | null;
  jam_mulai?: string | null;
  jam_selesai?: string | null;
  sub_capaian?: string | null;
}

export async function getAllPresensi(): Promise<Presensi[]> {
  const [rows] = await db.query("SELECT * FROM presensi");
  return rows as Presensi[];
}

export async function getPresensiById(id: number): Promise<Presensi | null> {
  const [rows] = await db.query("SELECT * FROM presensi WHERE id = ?", [id]);
  return (rows as Presensi[])[0] || null;
}

export async function createPresensi(data: Presensi): Promise<void> {
  await db.query(
    `
      INSERT INTO presensi 
        (nim, jadwal_id, status, waktu_presensi, token_qr, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.nim,
      data.jadwal_id,
      data.status,
      data.waktu_presensi ?? null,
      data.token_qr,
      data.latitude ?? null,
      data.longitude ?? null,
    ]
  );
}

export async function updatePresensi(
  id: number,
  data: Partial<Presensi>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (typeof data.nim !== "undefined") {
    fields.push("nim = ?");
    values.push(data.nim);
  }
  if (typeof data.jadwal_id !== "undefined") {
    fields.push("jadwal_id = ?");
    values.push(data.jadwal_id);
  }
  if (typeof data.status !== "undefined") {
    fields.push("status = ?");
    values.push(data.status);
  }
  if (typeof data.waktu_presensi !== "undefined") {
    fields.push("waktu_presensi = ?");
    values.push(data.waktu_presensi);
  }
  if (typeof data.token_qr !== "undefined") {
    fields.push("token_qr = ?");
    values.push(data.token_qr);
  }
  if (typeof data.latitude !== "undefined") {
    fields.push("latitude = ?");
    values.push(data.latitude);
  }
  if (typeof data.longitude !== "undefined") {
    fields.push("longitude = ?");
    values.push(data.longitude);
  }

  if (fields.length === 0) return;

  values.push(id);
  await db.query(
    `UPDATE presensi SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
}

export async function deletePresensi(id: number): Promise<void> {
  await db.query("DELETE FROM presensi WHERE id = ?", [id]);
}

// Detail presensi
export async function getPresensiWithDetails(): Promise<PresensiDetail[]> {
  const [rows] = await db.query(`
    SELECT 
      p.id, p.nim, m.nama AS nama_mahasiswa, 
      p.jadwal_id, p.status, p.waktu_presensi,
      p.token_qr, p.latitude, p.longitude,
      mk.nama_mk, d.nama_dosen,
      j.jam_mulai, j.jam_selesai, j.sub_capaian
    FROM presensi p
    LEFT JOIN mahasiswa   m  ON p.nim       = m.nim
    LEFT JOIN jadwal      j  ON p.jadwal_id = j.id
    LEFT JOIN mata_kuliah mk ON j.kode_mk   = mk.kode_mk
    LEFT JOIN dosen       d  ON j.nidn      = d.nidn
    ORDER BY p.id DESC
  `);
  return rows as PresensiDetail[];
}

// Rekap per mahasiswa
export async function getRekapByMahasiswa(nim: string) {
  const [rows] = await db.query(
    `
    SELECT 
      p.id, p.status, p.waktu_presensi,
      m.nama AS mahasiswa_nama,
      mk.nama_mk, mk.sks,
      d.nama_dosen,
      j.jam_mulai, j.jam_selesai, j.sub_capaian
    FROM presensi p
    LEFT JOIN mahasiswa   m  ON p.nim       = m.nim
    LEFT JOIN jadwal      j  ON p.jadwal_id = j.id
    LEFT JOIN mata_kuliah mk ON j.kode_mk   = mk.kode_mk
    LEFT JOIN dosen       d  ON j.nidn      = d.nidn
    WHERE p.nim = ?
    ORDER BY j.jam_mulai DESC
    `,
    [nim]
  );
  return rows;
}

// Rekap per mata kuliah
export async function getRekapByMataKuliah(kode_mk: string) {
  const [rows] = await db.query(
    `
    SELECT 
      p.id, p.status, p.waktu_presensi,
      m.nim, m.nama AS mahasiswa_nama,
      mk.nama_mk, mk.sks,
      d.nama_dosen,
      j.jam_mulai, j.jam_selesai, j.sub_capaian
    FROM presensi p
    LEFT JOIN mahasiswa   m  ON p.nim       = m.nim
    LEFT JOIN jadwal      j  ON p.jadwal_id = j.id
    LEFT JOIN mata_kuliah mk ON j.kode_mk   = mk.kode_mk
    LEFT JOIN dosen       d  ON j.nidn      = d.nidn
    WHERE mk.kode_mk = ?
    ORDER BY j.jam_mulai DESC
    `,
    [kode_mk]
  );
  return rows;
}
