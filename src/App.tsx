import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";

/**
 * CAUJARAL — 2) Macroprocesos y retos clave (90 min)
 * Tema oscuro (paleta de referencia) · Exportar TXT legible
 *
 * Cambios aplicados (v6):
 * - Paleta: fondo #0b1220 · cards #0e1726 · controles #0f1b2e · bordes #22314a
 * - Línea superior 3px (cian→azul→fucsia) en header y cards
 * - ❌ Eliminado botón Importar
 * - ✅ SID por pestaña (sessionStorage) + autosave/localStorage por SID
 * - ✅ Carga automática desde localStorage si existe (normaliza y descarta campos obsoletos)
 * - 🔤 D subtítulo: “Tres momentos donde la experiencia se define.”
 * - ❌ Eliminada SECCIÓN F — Declaración estratégica del grupo (UI, estado y export)
 */

type UUID = string;
type Momento = "Antes" | "Durante" | "Después";
type TipoProceso = "Estratégico" | "Misional" | "Soporte";

interface Meta {
  titulo: string;
  sessionId: string;
  lastSavedAt: string | null;
}

interface PerfilSocio {
  id: UUID;
  nombre: string;
  palabraClave: string;
  descripcion: string;
}

interface RecorridoRow {
  id: UUID;
  momento: Momento;
  frontstage: string;
  backstage: string;
  proceso: TipoProceso;
  area: string;
}

interface MomentoVerdad {
  id: UUID;
  momentoDeVerdad: string;
  expectativa: string;
  riesgo: string;
  oportunidad: string;
  capacidadAsociada: string;
}

interface AppState {
  version: string;
  meta: Meta;
  parte1: {
    A_perfiles: PerfilSocio[];
    B_recorrido: RecorridoRow[];
    D_momentos: MomentoVerdad[];
  };
}

const VERSION = "CaujaralCanvas-Macroprocesos-v6" as const;
const DEFAULT_CAPTION =
  "Macroprocesos y retos clave — Validar macroprocesos (estratégicos, misionales, soporte), brechas y capacidades críticas (90 min)";
const SUGERIDOS = [
  "Socio golfista",
  "Familiar con niños",
  "Socio nuevo",
  "Socio juvenil",
];

const newId = () => crypto.randomUUID();

/* ---------------- Estado inicial por SID ---------------- */
const initialState = (sid: string): AppState => ({
  version: VERSION,
  meta: { titulo: DEFAULT_CAPTION, sessionId: sid, lastSavedAt: null },
  parte1: {
    A_perfiles: [
      { id: newId(), nombre: "", palabraClave: "", descripcion: "" },
      { id: newId(), nombre: "", palabraClave: "", descripcion: "" },
      { id: newId(), nombre: "", palabraClave: "", descripcion: "" },
    ],
    B_recorrido: [
      {
        id: newId(),
        momento: "Antes",
        frontstage: "",
        backstage: "",
        proceso: "Misional",
        area: "",
      },
      {
        id: newId(),
        momento: "Durante",
        frontstage: "",
        backstage: "",
        proceso: "Misional",
        area: "",
      },
      {
        id: newId(),
        momento: "Después",
        frontstage: "",
        backstage: "",
        proceso: "Soporte",
        area: "",
      },
    ],
    D_momentos: [
      {
        id: newId(),
        momentoDeVerdad: "",
        expectativa: "",
        riesgo: "",
        oportunidad: "",
        capacidadAsociada: "",
      },
      {
        id: newId(),
        momentoDeVerdad: "",
        expectativa: "",
        riesgo: "",
        oportunidad: "",
        capacidadAsociada: "",
      },
      {
        id: newId(),
        momentoDeVerdad: "",
        expectativa: "",
        riesgo: "",
        oportunidad: "",
        capacidadAsociada: "",
      },
    ],
  },
});

/* ---------------- Export TXT legible ---------------- */
function toReadableTxt(s: AppState): string {
  const L: string[] = [];
  const ts = new Date().toLocaleString();
  L.push("CAUJARAL — Macroprocesos y retos clave (90 min)");
  L.push("Resumen legible para lectura posterior");
  L.push("—".repeat(72));
  L.push(`Sesión: ${s.meta.sessionId}`);
  L.push(`Exportado: ${ts}`);
  L.push("");

  L.push("📝 PARTE 1 — El Viaje del Socio: De lo Bacano a lo Embolatado");
  L.push("");

  L.push("🟢 A) Perfiles del socio");
  if (!s.parte1.A_perfiles.length) {
    L.push("  [Sin perfiles]");
  } else {
    s.parte1.A_perfiles.forEach((p, i) => {
      L.push(
        `  ${i + 1}. Perfil: ${p.nombre || "[sin definir]"} — Palabra clave: ${
          p.palabraClave || "[sin]"
        } `
      );
      L.push(`     Descripción: ${p.descripcion || "[vacío]"}`);
    });
  }
  L.push("");

  L.push("🧭 B) Recorrido del socio (Antes / Durante / Después)");
  s.parte1.B_recorrido.forEach((r, i) => {
    L.push(
      `  ${i + 1}. [${r.momento}] Frontstage: ${
        r.frontstage || "-"
      } | Backstage: ${r.backstage || "-"} | Proceso: ${
        r.proceso
      } | Área líder: ${r.area || "-"}`
    );
  });
  L.push("");

  L.push("🌟 D) Tres momentos donde la experiencia se define.");
  s.parte1.D_momentos.forEach((m, i) => {
    L.push(
      `  ${i + 1}. ${m.momentoDeVerdad || "[sin título]"} — Expectativa: ${
        m.expectativa || "-"
      } — Riesgo: ${m.riesgo || "-"} — Oportunidad: ${
        m.oportunidad || "-"
      } — Capacidad: ${m.capacidadAsociada || "-"}`
    );
  });
  L.push("");
  L.push("FIN");
  return L.join("\n");
}

/* ---------------- File helpers ---------------- */
function downloadFile(
  content: string,
  filename: string,
  mime = "text/plain;charset=utf-8"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------- UI Primitives (paleta referencia) ---------------- */
const Badge: React.FC<{
  children: ReactNode;
  tone?: "indigo" | "sky" | "emerald";
}> = ({ children, tone = "indigo" }) => {
  const tones = {
    indigo: "bg-blue-600/15 text-blue-200 border-blue-700",
    sky: "bg-cyan-600/15 text-cyan-200 border-cyan-700",
    emerald: "bg-emerald-600/15 text-emerald-200 border-emerald-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const ToolbarButton = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl border border-[#22314a] bg-[#0b1220] px-3 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-[#0f1b2e] active:scale-[0.99]"
  >
    {children}
  </button>
);

const SectionCard = ({
  title,
  subtitle,
  emoji,
  children,
  anchor,
}: {
  title: string;
  subtitle?: string;
  emoji?: string;
  children: ReactNode;
  anchor?: string;
}) => (
  <section id={anchor} className="relative">
    <div className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Línea superior 3px */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      <div className="flex items-start justify-between gap-4 border-b border-[#22314a] p-4 md:p-5">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="text-xl md:text-2xl">{emoji}</span>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 md:p-6 text-slate-200">{children}</div>
    </div>
  </section>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input = (props: InputProps) => {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
const TextArea = (props: TextAreaProps) => {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full min-h-[76px] rounded-xl border border-[#2a3a52] bg-[#0f1b2e] px-3 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

const Select = ({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`rounded-lg border border-[#2a3a52] bg-[#0f1b2e] px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </select>
);

/* ---------------- App ---------------- */
export default function MacroprocesosCanvas() {
  /** SID por pestaña (estable en recargas) */
  const [sid] = useState<string>(() => {
    const KEY = "macro_sid";
    let s = sessionStorage.getItem(KEY);
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem(KEY, s);
    }
    return s;
  });

  /** Estado inicial: cargar si existe, si no crear (normaliza shape sin F) */
  const [state, setState] = useState<AppState>(() => {
    const key = `caujaral_macro_${sid}`;
    const saved = localStorage.getItem(key);
    const init = initialState(sid);
    if (saved) {
      try {
        const parsed: any = JSON.parse(saved);
        return {
          version: VERSION,
          meta: parsed?.meta ?? {
            titulo: DEFAULT_CAPTION,
            sessionId: sid,
            lastSavedAt: null,
          },
          parte1: {
            A_perfiles:
              Array.isArray(parsed?.parte1?.A_perfiles) &&
              parsed.parte1.A_perfiles.length
                ? parsed.parte1.A_perfiles
                : init.parte1.A_perfiles,
            B_recorrido:
              Array.isArray(parsed?.parte1?.B_recorrido) &&
              parsed.parte1.B_recorrido.length
                ? parsed.parte1.B_recorrido
                : init.parte1.B_recorrido,
            D_momentos:
              Array.isArray(parsed?.parte1?.D_momentos) &&
              parsed.parte1.D_momentos.length
                ? parsed.parte1.D_momentos
                : init.parte1.D_momentos,
          },
        };
      } catch {}
    }
    return init;
  });

  // Autosave por SID
  useEffect(() => {
    const key = `caujaral_macro_${state.meta.sessionId}`;
    const next: AppState = {
      ...state,
      meta: { ...state.meta, lastSavedAt: new Date().toISOString() },
    };
    localStorage.setItem(key, JSON.stringify(next));
  }, [state]);

  /* Helpers genéricos por path (sin updateValue ya que no se usa) */
  const updateField = (
    path: string[],
    id: UUID,
    field: string,
    value: unknown
  ) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref = clone as any;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = ref[key].map((it: any) =>
        it.id === id ? { ...it, [field]: value } : it
      );
      return clone;
    });
  };
  const pushRow = (path: string[], row: unknown) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref = clone as any;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = [...ref[key], row];
      return clone;
    });
  };
  const removeRow = (path: string[], id: UUID) => {
    setState((prev) => {
      const clone: any = structuredClone(prev);
      let ref = clone as any;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      const key = path[path.length - 1];
      ref[key] = ref[key].filter((it: any) => it.id !== id);
      return clone;
    });
  };

  /* Helpers específicos — Perfiles */
  const addPerfil = () => {
    pushRow(["parte1", "A_perfiles"], {
      id: newId(),
      nombre: "",
      palabraClave: "",
      descripcion: "",
    } as PerfilSocio);
  };
  const removePerfil = (id: UUID) => {
    if (state.parte1.A_perfiles.length <= 3) return;
    removeRow(["parte1", "A_perfiles"], id);
  };
  const suggestPerfil = (nombre: string) => {
    const idx = state.parte1.A_perfiles.findIndex((p) => !p.nombre);
    if (idx >= 0) {
      updateField(
        ["parte1", "A_perfiles"],
        state.parte1.A_perfiles[idx].id,
        "nombre",
        nombre
      );
    } else {
      pushRow(["parte1", "A_perfiles"], {
        id: newId(),
        nombre,
        palabraClave: "",
        descripcion: "",
      } as PerfilSocio);
    }
  };

  // Smoke test mínimo
  useEffect(() => {
    try {
      console.assert(
        state.parte1.A_perfiles.length >= 3,
        "Debe haber al menos 3 perfiles"
      );
      console.assert(
        state.parte1.B_recorrido.length >= 3,
        "Recorrido inicial debe tener 3 filas"
      );
    } catch (e) {
      console.warn("Smoke test warning:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0b1220] text-slate-100">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/85 bg-[#0b1220]/90 border-b border-[#22314a]">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Cuadrito azul con icono */}
              <div
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-inner shadow-blue-900/30 flex items-center justify-center"
                aria-label="Macroprocesos"
              >
                <span
                  aria-hidden="true"
                  className="text-white text-lg leading-none"
                >
                  🧭
                </span>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-semibold">
                  Macroprocesos y Retos Clave (Parte 2)
                </h1>
                <p className="text-xs md:text-sm text-slate-300">
                  Validar macroprocesos (estratégicos, misionales, soporte),
                  brechas y capacidades críticas · 90 min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ToolbarButton
                onClick={() =>
                  downloadFile(
                    toReadableTxt(state),
                    `Macroprocesos_${state.meta.sessionId}.txt`,
                    "text/plain;charset=utf-8"
                  )
                }
              >
                <span className="i-lucide-download h-4 w-4" /> Exportar TXT
              </ToolbarButton>

              <ToolbarButton
                onClick={() => {
                  if (
                    confirm(
                      "¿Restablecer? Se creará una nueva sesión y se limpiarán los datos de esta pestaña."
                    )
                  ) {
                    const newSid = crypto.randomUUID();
                    sessionStorage.setItem("macro_sid", newSid);
                    setState(() => initialState(newSid));
                  }
                }}
              >
                <span className="i-lucide-rotate-ccw h-4 w-4" /> Reset
              </ToolbarButton>
            </div>
          </div>
        </div>
        {/* Línea superior 3px */}
        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
        {/* Intro */}
        <section className="relative rounded-2xl border border-[#22314a] bg-[#0e1726]/80 shadow-sm p-5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <Badge>🧭 Objetivo</Badge>
              <h2 className="text-xl md:text-2xl font-semibold">
                Diseñar y validar el viaje del socio y sus macroprocesos
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl">
                Identifiquen perfiles, recorridos y definan los tres momentos de
                verdad clave para priorizar capacidades.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="sky">⏱️ 90 min</Badge>
              <Badge tone="emerald">Local ✓</Badge>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {/* A — Perfiles */}
          <SectionCard
            anchor="a-perfiles"
            emoji="🟢"
            title="SECCIÓN A — Perfiles del Socio"
            subtitle="Describe al menos 3 perfiles. Usa una palabra clave y una breve descripción para cada uno."
          >
            <div className="mb-3">
              <label className="text-xs text-slate-400">
                Perfiles sugeridos
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {SUGERIDOS.map((p) => (
                  <button
                    key={p}
                    className="rounded-lg border border-[#2a3a52] bg-[#0f1b2e] px-2.5 py-1 text-xs hover:bg-[#0f2238]"
                    onClick={() => suggestPerfil(p)}
                    type="button"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {state.parte1.A_perfiles.map((p, idx) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-[#22314a] bg-[#0e1726]/70 p-3 space-y-2"
                >
                  <div className="text-[11px] text-slate-400">
                    Perfil #{idx + 1}
                  </div>
                  <Input
                    value={p.nombre}
                    onChange={(e) =>
                      updateField(
                        ["parte1", "A_perfiles"],
                        p.id,
                        "nombre",
                        e.target.value
                      )
                    }
                    placeholder="Nombre del perfil (p. ej., Socio golfista)"
                  />
                  <Input
                    value={p.palabraClave}
                    onChange={(e) =>
                      updateField(
                        ["parte1", "A_perfiles"],
                        p.id,
                        "palabraClave",
                        e.target.value
                      )
                    }
                    placeholder="Palabra clave (p. ej., 'golfista')"
                  />
                  <TextArea
                    value={p.descripcion}
                    onChange={(e) =>
                      updateField(
                        ["parte1", "A_perfiles"],
                        p.id,
                        "descripcion",
                        e.target.value
                      )
                    }
                    placeholder="Descripción breve (qué espera, qué valora)…"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Mínimo 3 perfiles
                    </span>
                    <button
                      onClick={() => removePerfil(p.id)}
                      className={`text-sm ${
                        state.parte1.A_perfiles.length <= 3
                          ? "text-slate-600 cursor-not-allowed"
                          : "text-slate-300 hover:text-slate-100"
                      }`}
                      disabled={state.parte1.A_perfiles.length <= 3}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <ToolbarButton onClick={addPerfil}>
                + Agregar perfil
              </ToolbarButton>
            </div>
          </SectionCard>

          {/* B — Recorrido */}
          <SectionCard
            anchor="b-recorrido"
            emoji="🧭"
            title="SECCIÓN B — Recorrido del Socio"
            subtitle="Divide en Antes / Durante / Después. Completa Frontstage, Backstage, tipo de proceso y área líder."
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-4">Momento</th>
                    <th className="py-2 pr-4">
                      ¿Qué hace el socio? (Frontstage)
                    </th>
                    <th className="py-2 pr-4">
                      ¿Qué ocurre detrás? (Backstage)
                    </th>
                    <th className="py-2 pr-4">Tipo de proceso</th>
                    <th className="py-2 pr-4">Área líder</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.parte1.B_recorrido.map((row) => (
                    <tr key={row.id} className="border-t border-[#22314a]">
                      <td className="py-2 pr-4">
                        <Select
                          value={row.momento}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_recorrido"],
                              row.id,
                              "momento",
                              e.target.value as Momento
                            )
                          }
                        >
                          <option>Antes</option>
                          <option>Durante</option>
                          <option>Después</option>
                        </Select>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={row.frontstage}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_recorrido"],
                              row.id,
                              "frontstage",
                              e.target.value
                            )
                          }
                          placeholder="Acción del socio…"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={row.backstage}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_recorrido"],
                              row.id,
                              "backstage",
                              e.target.value
                            )
                          }
                          placeholder="Áreas / sistemas / personas…"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Select
                          value={row.proceso}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_recorrido"],
                              row.id,
                              "proceso",
                              e.target.value as TipoProceso
                            )
                          }
                        >
                          <option>Estratégico</option>
                          <option>Misional</option>
                          <option>Soporte</option>
                        </Select>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={row.area}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "B_recorrido"],
                              row.id,
                              "area",
                              e.target.value
                            )
                          }
                          placeholder="Área líder"
                        />
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <button
                          className="text-sm text-slate-300 hover:text-slate-100"
                          onClick={() =>
                            removeRow(["parte1", "B_recorrido"], row.id)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3">
              <ToolbarButton
                onClick={() =>
                  pushRow(["parte1", "B_recorrido"], {
                    id: newId(),
                    momento: "Antes" as Momento,
                    frontstage: "",
                    backstage: "",
                    proceso: "Misional" as TipoProceso,
                    area: "",
                  })
                }
              >
                + Agregar acción
              </ToolbarButton>
            </div>
          </SectionCard>

          {/* D — Momentos de Verdad (subtítulo actualizado) */}
          <SectionCard
            anchor="d-momentos"
            emoji="🌟"
            title="SECCIÓN D — Momentos de Verdad"
            subtitle="Tres momentos donde la experiencia se define."
          >
            <div className="overflow-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-4">Momento de verdad</th>
                    <th className="py-2 pr-4">✅ Expectativa</th>
                    <th className="py-2 pr-4">❌ Riesgo</th>
                    <th className="py-2 pr-4">🌟 Oportunidad</th>
                    <th className="py-2 pr-4">Capacidad asociada</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.parte1.D_momentos.map((r) => (
                    <tr key={r.id} className="border-t border-[#22314a]">
                      <td className="py-2 pr-4">
                        <Input
                          value={r.momentoDeVerdad}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "D_momentos"],
                              r.id,
                              "momentoDeVerdad",
                              e.target.value
                            )
                          }
                          placeholder="p. ej., Pedido en restaurante"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.expectativa}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "D_momentos"],
                              r.id,
                              "expectativa",
                              e.target.value
                            )
                          }
                          placeholder="Rapidez, amabilidad…"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.riesgo}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "D_momentos"],
                              r.id,
                              "riesgo",
                              e.target.value
                            )
                          }
                          placeholder="Error, tardanza…"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.oportunidad}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "D_momentos"],
                              r.id,
                              "oportunidad",
                              e.target.value
                            )
                          }
                          placeholder="Detalle memorable…"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          value={r.capacidadAsociada}
                          onChange={(e) =>
                            updateField(
                              ["parte1", "D_momentos"],
                              r.id,
                              "capacidadAsociada",
                              e.target.value
                            )
                          }
                          placeholder="Área o capacidad"
                        />
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <button
                          onClick={() =>
                            removeRow(["parte1", "D_momentos"], r.id)
                          }
                          className="text-sm text-slate-300 hover:text-slate-100"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <ToolbarButton
                onClick={() =>
                  pushRow(["parte1", "D_momentos"], {
                    id: newId(),
                    momentoDeVerdad: "",
                    expectativa: "",
                    riesgo: "",
                    oportunidad: "",
                    capacidadAsociada: "",
                  } as MomentoVerdad)
                }
              >
                + Agregar momento
              </ToolbarButton>
            </div>
          </SectionCard>
        </div>

        <div className="pb-12" />
      </main>

      {/* Iconos mínimos (fallback) */}
      <style>{`
        .i-lucide-download::before{content:"\\2193";}
        .i-lucide-rotate-ccw::before{content:"\\21BA";}
      `}</style>
    </div>
  );
}
