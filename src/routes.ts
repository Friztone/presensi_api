import { Router } from "express";
import { comparePassword, generateToken, verifyToken } from "./models/auth";
import {
  getAllMahasiswa,
  getMahasiswaByNIM,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "./models/mahasiswa";
import {
  getAllDosen,
  getDosenByNidn,
  createDosen,
  updateDosen,
  deleteDosen,
} from "./models/dosen";
import {
  getAllMataKuliah,
  getMataKuliahByKode,
  createMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "./models/matakuliah";
import {
  getAllJadwal,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "./models/jadwal";
import {
  getAllPresensi,
  getPresensiById,
  getPresensiWithDetails,
  createPresensi,
  updatePresensi,
  deletePresensi,
  getRekapByMahasiswa,
  getRekapByMataKuliah,
  getRekapByJadwalId,
} from "./models/presensi";

const router = Router();

// ==================
// VERIFY TOKEN
// ==================
router.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  return res.status(200).json({ message: "Token valid", payload });
});

// ==================
// MAHASISWA
// ==================
router.get("/mahasiswa", async (req, res) => {
  const data = await getAllMahasiswa();
  res.json(data);
});

router.get("/mahasiswa/:nim", async (req, res) => {
  const mahasiswa = await getMahasiswaByNIM(req.params.nim);
  if (!mahasiswa) return res.status(404).json({ message: "Not found" });
  res.json(mahasiswa);
});

router.post("/mahasiswa", async (req, res) => {
  await createMahasiswa(req.body);
  res.status(201).json({ message: "Mahasiswa created" });
});

router.put("/mahasiswa/:nim", async (req, res) => {
  await updateMahasiswa(req.params.nim, req.body);
  res.json({ message: "Mahasiswa updated" });
});

router.delete("/mahasiswa/:nim", async (req, res) => {
  await deleteMahasiswa(req.params.nim);
  res.json({ message: "Mahasiswa deleted" });
});

// ==================
// DOSEN
// ==================
router.get("/dosen", async (req, res) => {
  const data = await getAllDosen();
  res.json(data);
});

router.get("/dosen/:nidn", async (req, res) => {
  const dosen = await getDosenByNidn(req.params.nidn);
  if (!dosen) return res.status(404).json({ message: "Not found" });
  res.json(dosen);
});

router.post("/dosen", async (req, res) => {
  await createDosen(req.body);
  res.status(201).json({ message: "Dosen created" });
});

router.put("/dosen/:nidn", async (req, res) => {
  await updateDosen(req.params.nidn, req.body);
  res.json({ message: "Dosen updated" });
});

router.delete("/dosen/:nidn", async (req, res) => {
  await deleteDosen(req.params.nidn);
  res.json({ message: "Dosen deleted" });
});

// ==================
// MATA KULIAH
// ==================
router.get("/mata-kuliah", async (req, res) => {
  const data = await getAllMataKuliah();
  res.json(data);
});

router.get("/mata-kuliah/:kode", async (req, res) => {
  const mk = await getMataKuliahByKode(req.params.kode);
  if (!mk) return res.status(404).json({ message: "Not found" });
  res.json(mk);
});

router.post("/mata-kuliah", async (req, res) => {
  await createMataKuliah(req.body);
  res.status(201).json({ message: "Mata Kuliah created" });
});

router.put("/mata-kuliah/:kode", async (req, res) => {
  await updateMataKuliah(req.params.kode, req.body);
  res.json({ message: "Mata Kuliah updated" });
});

router.delete("/mata-kuliah/:kode", async (req, res) => {
  await deleteMataKuliah(req.params.kode);
  res.json({ message: "Mata Kuliah deleted" });
});

// ==================
// JADWAL
// ==================
router.get("/jadwal", async (req, res) => {
  const data = await getAllJadwal();
  res.json(data);
});

router.get("/jadwal/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
  const jadwal = await getJadwalById(id);
  if (!jadwal) return res.status(404).json({ message: "Not found" });
  res.json(jadwal);
});

router.post("/jadwal", async (req, res) => {
  await createJadwal(req.body);
  res.status(201).json({ message: "Jadwal created" });
});

router.put("/jadwal/:id", async (req, res) => {
  await updateJadwal(Number(req.params.id), req.body);
  res.json({ message: "Jadwal updated" });
});

router.delete("/jadwal/:id", async (req, res) => {
  await deleteJadwal(Number(req.params.id));
  res.json({ message: "Jadwal deleted" });
});

// ==================
// PRESENSI
// ==================
router.get("/presensi", async (req, res) => {
  const { nim } = req.query;
  if (nim) {
    const data = await getRekapByMahasiswa(String(nim));
    return res.json(data);
  }
  const data = await getPresensiWithDetails();
  res.json(data);
});

router.get("/presensi/raw", async (req, res) => {
  const data = await getAllPresensi();
  res.json(data);
});

router.get("/presensi/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
  const presensi = await getPresensiById(id);
  if (!presensi) return res.status(404).json({ message: "Not found" });
  res.json(presensi);
});

router.post("/presensi", async (req, res) => {
  await createPresensi(req.body);
  res.status(201).json({ message: "Presensi created" });
});

router.put("/presensi/:id", async (req, res) => {
  await updatePresensi(Number(req.params.id), req.body);
  res.json({ message: "Presensi updated" });
});

router.delete("/presensi/:id", async (req, res) => {
  await deletePresensi(Number(req.params.id));
  res.json({ message: "Presensi deleted" });
});

// Dapatkan presensi berdasarkan jadwal_id
router.get("/presensi/jadwal/:jadwalId", async (req, res) => {
  const jadwalId = Number(req.params.jadwalId);
  if (isNaN(jadwalId))
    return res.status(400).json({ message: "Invalid jadwal ID" });

  const data = await getRekapByJadwalId(jadwalId);
  res.json(data);
});

// ==================
// LOGIN DOSEN
// ==================
router.post("/login-dosen", async (req, res) => {
  const { nidn, password } = req.body;
  if (!nidn || !password)
    return res.status(400).json({ message: "NIDN dan password wajib diisi" });

  const dosen = await getDosenByNidn(nidn);
  if (!dosen) return res.status(401).json({ message: "Dosen tidak ditemukan" });

  const passwordValid =
    dosen.password === password ||
    (await comparePassword(password, dosen.password));

  if (!passwordValid)
    return res.status(401).json({ message: "Password salah" });

  const token = generateToken({
    nidn: dosen.nidn,
    nama_dosen: dosen.nama_dosen,
    role: "dosen",
  });

  res.json({
    message: "Login berhasil",
    token,
    dosen: { nidn: dosen.nidn, nama_dosen: dosen.nama_dosen },
  });
});

router.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Token tidak valid" });

  res.status(200).json({ message: "Token valid", user: payload });
});

export default router;
