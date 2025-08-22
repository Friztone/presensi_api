import { db } from "../database";

export interface Presensi {
  id?: number;
  nim: string;
  jadwal_id: number;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  waktu_presensi?: string;
  token_qr: string;
  latitude?: number;
  longitude?: number;
}

export interface PresensiDetail extends Presensi {
  nama_mahasiswa: string;
  nama_mk: string;
  nama_dosen: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
}

export async function getAllPresensi(): Promise<Presensi[]> {
  const [rows] = await db.query("SELECT * FROM presensi");
  return rows as Presensi[];
}

export async function getPresensiWithDetails(): Promise<PresensiDetail[]> {
  const [rows] = await db.query(`
        SELECT 
            p.id, p.nim, m.nama AS nama_mahasiswa, p.jadwal_id, p.status, p.waktu_presensi,
            p.token_qr, p.latitude, p.longitude,
            mk.nama_mk, d.nama AS nama_dosen,
            j.tanggal, j.jam_mulai, j.jam_selesai
        FROM presensi p
        JOIN mahasiswa m ON p.nim = m.nim
        JOIN jadwal j ON p.jadwal_id = j.id
        JOIN mata_kuliah mk ON j.kode_mk = mk.kode_mk
        JOIN dosen d ON j.nidn = d.nidn
    `);
  return rows as PresensiDetail[];
}

export async function getPresensiById(id: number): Promise<Presensi | null> {
  const [rows] = await db.query("SELECT * FROM presensi WHERE id = ?", [id]);
  const data = (rows as Presensi[])[0];
  return data || null;
}

export async function createPresensi(data: Presensi): Promise<void> {
  await db.query(
    "INSERT INTO presensi (nim, jadwal_id, status, token_qr, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.nim,
      data.jadwal_id,
      data.status,
      data.token_qr,
      data.latitude,
      data.longitude,
    ]
  );
}

export async function updatePresensi(
  id: number,
  data: Partial<Presensi>
): Promise<void> {
  await db.query(
    "UPDATE presensi SET nim = ?, jadwal_id = ?, status = ?, token_qr = ?, latitude = ?, longitude = ? WHERE id = ?",
    [
      data.nim,
      data.jadwal_id,
      data.status,
      data.token_qr,
      data.latitude,
      data.longitude,
      id,
    ]
  );
}

export async function deletePresensi(id: number): Promise<void> {
  await db.query("DELETE FROM presensi WHERE id = ?", [id]);
}

export async function getRekapByMahasiswa(nim: string) {
  const [rows] = await db.query(
    `
        SELECT 
            p.id, p.status, p.waktu_presensi,
            m.nama AS mahasiswa_nama,
            mk.nama_mk, mk.sks,
            j.tanggal, j.jam_mulai, j.jam_selesai
        FROM presensi p
        JOIN mahasiswa m ON p.nim = m.nim
        JOIN jadwal j ON p.jadwal_id = j.id
        JOIN mata_kuliah mk ON j.kode_mk = mk.kode_mk
        WHERE p.nim = ?
        ORDER BY j.tanggal DESC
    `,
    [nim]
  );
  return rows;
}

export async function getRekapByMataKuliah(kode_mk: string) {
  const [rows] = await db.query(
    `
        SELECT 
            p.id, p.status, p.waktu_presensi,
            m.nim, m.nama AS mahasiswa_nama,
            mk.nama_mk, mk.sks,
            j.tanggal, j.jam_mulai, j.jam_selesai
        FROM presensi p
        JOIN mahasiswa m ON p.nim = m.nim
        JOIN jadwal j ON p.jadwal_id = j.id
        JOIN mata_kuliah mk ON j.kode_mk = mk.kode_mk
        WHERE mk.kode_mk = ?
        ORDER BY j.tanggal DESC
    `,
    [kode_mk]
  );
  return rows;
}
