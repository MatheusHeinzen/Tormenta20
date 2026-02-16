import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const classesPath = path.join(__dirname, "../data/tormenta20/classes.json");
const classes = JSON.parse(fs.readFileSync(classesPath, "utf-8"));

const CLASSES_COM_PODERES_NIVEL_1 = ["druida", "inventor", "nobre", "paladino"];

for (const c of classes) {
  const old = c.habilidades_por_nivel ?? [];
  const byNivel = new Map(old.map((h) => [h.nivel, h.poderes ?? []]));
  const newHabilidades = [];
  for (let nivel = 1; nivel <= 20; nivel++) {
    const poderes = byNivel.get(nivel) ?? [];
    const isNivel1ComConcedidas =
      nivel === 1 && CLASSES_COM_PODERES_NIVEL_1.includes(c.id) && poderes.length > 0;
    newHabilidades.push({
      nivel,
      concedidas: isNivel1ComConcedidas ? poderes : [],
      escolhiveis: isNivel1ComConcedidas ? [] : poderes,
    });
  }
  c.habilidades_por_nivel = newHabilidades;
}

fs.writeFileSync(classesPath, JSON.stringify(classes, null, 2) + "\n", "utf-8");
console.log("Transformed habilidades_por_nivel to concedidas/escolhiveis for all classes.");
