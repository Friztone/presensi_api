import { db } from "../database";

export interface Mahasiswa {
  nim: string;
  nama: string;
  jurusan: string;
}

// Ambil semua mahasiswa
export async function getAllMahasiswa(): Promise<Mahasiswa[]> {
  const [rows] = await db.query("SELECT * FROM mahasiswa");
  return rows as Mahasiswa[];
}

// Ambil mahasiswa berdasarkan NIM
export async function getMahasiswaByNIM(
  nim: string
): Promise<Mahasiswa | null> {
  const [rows] = await db.query("SELECT * FROM mahasiswa WHERE nim = ?", [nim]);
  const data = (rows as Mahasiswa[])[0];
  return data || null;
}

// Tambah mahasiswa baru
export async function createMahasiswa(data: Mahasiswa): Promise<void> {
  await db.query(
    "INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)",
    [data.nim, data.nama, data.jurusan]
  );
}

// Update mahasiswa berdasarkan NIM
export async function updateMahasiswa(
  nim: string,
  data: Partial<Mahasiswa>
): Promise<void> {
  await db.query("UPDATE mahasiswa SET nama = ?, jurusan = ? WHERE nim = ?", [
    data.nama,
    data.jurusan,
    nim,
  ]);
}

// Hapus mahasiswa berdasarkan NIM
export async function deleteMahasiswa(nim: string): Promise<void> {
  await db.query("DELETE FROM mahasiswa WHERE nim = ?", [nim]);
}
