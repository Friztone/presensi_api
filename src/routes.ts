import { IncomingMessage, ServerResponse } from "http";

// Import model
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
} from "./models/presensi";

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (e) {
        reject(e);
      }
    });
  });
}

export async function router(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  try {
    // === REKAP ===
    if (req.method === "GET" && req.url?.startsWith("/rekap/mahasiswa/")) {
      const nim = req.url.split("/")[3];
      const data = await getRekapByMahasiswa(nim);
      res.end(JSON.stringify(data));
      return;
    }

    if (req.method === "GET" && req.url?.startsWith("/rekap/mata-kuliah/")) {
      const kode = req.url.split("/")[3];
      const data = await getRekapByMataKuliah(kode);
      res.end(JSON.stringify(data));
      return;
    }

    // === MAHASISWA ===
    if (req.url?.startsWith("/mahasiswa")) {
      if (req.method === "GET") {
        if (req.url === "/mahasiswa") {
          const data = await getAllMahasiswa();
          res.end(JSON.stringify(data));
          return;
        }
        const nim = req.url.split("/")[2];
        if (nim) {
          const mahasiswa = await getMahasiswaByNIM(nim);
          res.end(JSON.stringify(mahasiswa || { message: "Not found" }));
          return;
        }
      }

      if (req.method === "POST") {
        const body = await parseBody(req);
        await createMahasiswa(body);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Mahasiswa created" }));
        return;
      }

      if (req.method === "PUT") {
        const nim = req.url.split("/")[2];
        const body = await parseBody(req);
        await updateMahasiswa(nim, body);
        res.end(JSON.stringify({ message: "Mahasiswa updated" }));
        return;
      }

      if (req.method === "DELETE") {
        const nim = req.url.split("/")[2];
        await deleteMahasiswa(nim);
        res.end(JSON.stringify({ message: "Mahasiswa deleted" }));
        return;
      }
    }

    // === DOSEN ===
    if (req.url?.startsWith("/dosen")) {
      if (req.method === "GET") {
        if (req.url === "/dosen") {
          const data = await getAllDosen();
          res.end(JSON.stringify(data));
          return;
        }
        const nidn = req.url.split("/")[2];
        if (nidn) {
          const dosen = await getDosenByNidn(nidn);
          res.end(JSON.stringify(dosen || { message: "Not found" }));
          return;
        }
      }

      if (req.method === "POST") {
        const body = await parseBody(req);
        await createDosen(body);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Dosen created" }));
        return;
      }

      if (req.method === "PUT") {
        const nidn = req.url.split("/")[2];
        const body = await parseBody(req);
        await updateDosen(nidn, body);
        res.end(JSON.stringify({ message: "Dosen updated" }));
        return;
      }

      if (req.method === "DELETE") {
        const nidn = req.url.split("/")[2];
        await deleteDosen(nidn);
        res.end(JSON.stringify({ message: "Dosen deleted" }));
        return;
      }
    }

    // === MATA KULIAH ===
    if (req.url?.startsWith("/mata-kuliah")) {
      if (req.method === "GET") {
        if (req.url === "/mata-kuliah") {
          const data = await getAllMataKuliah();
          res.end(JSON.stringify(data));
          return;
        }
        const kode = req.url.split("/")[2];
        if (kode) {
          const mk = await getMataKuliahByKode(kode);
          res.end(JSON.stringify(mk || { message: "Not found" }));
          return;
        }
      }

      if (req.method === "POST") {
        const body = await parseBody(req);
        await createMataKuliah(body);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Mata Kuliah created" }));
        return;
      }

      if (req.method === "PUT") {
        const kode = req.url.split("/")[2];
        const body = await parseBody(req);
        await updateMataKuliah(kode, body);
        res.end(JSON.stringify({ message: "Mata Kuliah updated" }));
        return;
      }

      if (req.method === "DELETE") {
        const kode = req.url.split("/")[2];
        await deleteMataKuliah(kode);
        res.end(JSON.stringify({ message: "Mata Kuliah deleted" }));
        return;
      }
    }

    // === JADWAL ===
    if (req.url?.startsWith("/jadwal")) {
      if (req.method === "GET") {
        if (req.url === "/jadwal") {
          const data = await getAllJadwal();
          res.end(JSON.stringify(data));
          return;
        }
        const id = parseInt(req.url.split("/")[2]);
        if (!isNaN(id)) {
          const jadwal = await getJadwalById(id);
          res.end(JSON.stringify(jadwal || { message: "Not found" }));
          return;
        }
      }

      if (req.method === "POST") {
        const body = await parseBody(req);
        await createJadwal(body);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Jadwal created" }));
        return;
      }

      if (req.method === "PUT") {
        const id = parseInt(req.url.split("/")[2]);
        const body = await parseBody(req);
        await updateJadwal(id, body);
        res.end(JSON.stringify({ message: "Jadwal updated" }));
        return;
      }

      if (req.method === "DELETE") {
        const id = parseInt(req.url.split("/")[2]);
        await deleteJadwal(id);
        res.end(JSON.stringify({ message: "Jadwal deleted" }));
        return;
      }
    }

    // === PRESENSI ===
    if (req.url?.startsWith("/presensi")) {
      if (req.method === "GET") {
        // Cek apakah ada query ?nim=
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const nim = urlObj.searchParams.get("nim");

        if (nim) {
          const data = await getRekapByMahasiswa(nim);
          res.end(JSON.stringify(data));
          return;
        }

        if (urlObj.pathname === "/presensi") {
          const data = await getPresensiWithDetails();
          res.end(JSON.stringify(data));
          return;
        }

        if (urlObj.pathname === "/presensi/raw") {
          const data = await getAllPresensi();
          res.end(JSON.stringify(data));
          return;
        }

        const id = parseInt(urlObj.pathname.split("/")[2]);
        if (!isNaN(id)) {
          const presensi = await getPresensiById(id);
          res.end(JSON.stringify(presensi || { message: "Not found" }));
          return;
        }
      }

      if (req.method === "POST") {
        const body = await parseBody(req);
        await createPresensi(body);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Presensi created" }));
        return;
      }

      if (req.method === "PUT") {
        const id = parseInt(req.url.split("/")[2]);
        const body = await parseBody(req);
        await updatePresensi(id, body);
        res.end(JSON.stringify({ message: "Presensi updated" }));
        return;
      }

      if (req.method === "DELETE") {
        const id = parseInt(req.url.split("/")[2]);
        await deletePresensi(id);
        res.end(JSON.stringify({ message: "Presensi deleted" }));
        return;
      }
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not Found" }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ message: "Internal Server Error", error: err?.message })
    );
  }
}
