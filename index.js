// index.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const run = util.promisify(exec);
const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/submit", async (req, res) => {
  const { slug, source } = req.body;
  if (!slug || !source) {
    return res.status(400).json({ error: "Falta 'slug' o 'source'." });
  }

  // 1. Crear carpeta de trabajo
  const id = Date.now();
  const dir = path.join("/tmp", `submission_${id}`);
  await fs.mkdir(dir, { recursive: true });

  // 2. Guardar el código en un archivo
  const filename = path.join(dir, "solution.c");
  await fs.writeFile(filename, source);

  try {
    // reemplaza la línea antigua por esta:
    const cmd = `check50 -o json --target solution.c ${slug}`;
    const { stdout } = await run(cmd, { cwd: dir, maxBuffer: 10 * 1024 * 1024 });
    const results = JSON.parse(stdout);
    res.json({ ok: true, results });
  } catch (err) {
    // Errores de compilación o tests
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    // 4. Limpieza
    await fs.rm(dir, { recursive: true, force: true });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo`);
});
