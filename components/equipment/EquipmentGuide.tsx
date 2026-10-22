"use client";

import { useState } from "react";
import { AlertTriangle, Cable, Radar, ScanLine, SlidersHorizontal } from "lucide-react";
import { Badge, Callout, Card, CardHeader, Tabs } from "@/components/ui/primitives";
import { DEVICES, EBUS_MODELS, EBUS_ULTRASOUND, FLEXIBLE_COMMON, NEEDLES, SCOPE_MODELS, type Device } from "@/lib/data/equipment";
import { BronchoscopeDiagram } from "./BronchoscopeDiagram";
import { CpEbusDiagram, RpEbusDiagram, type ProbePosition } from "./EbusDiagrams";
import { ConvexSonogram, RadialSonogram } from "@/components/imaging/Sonograms";
import { CONVEX_PRESETS } from "@/components/imaging/sonography";
import { REF_BY_ID } from "@/lib/data/references";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

export function EquipmentGuide() {
  const [deviceId, setDeviceId] = useState<Device["id"]>("flexible");
  const l = useL();
  const content = useContent();
  const device = content.device(DEVICES.find((d) => d.id === deviceId)!);
  const [partId, setPartId] = useState<string>(device.parts[0].id);
  const part = device.parts.find((p) => p.id === partId) ?? device.parts[0];

  const [flex, setFlex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [modelId, setModelId] = useState(SCOPE_MODELS[0].id);
  const model = SCOPE_MODELS.find((m) => m.id === modelId)!;
  const [ebusId, setEbusId] = useState(EBUS_MODELS[0].id);
  const ebus = EBUS_MODELS.find((m) => m.id === ebusId)!;
  const [ebusFlex, setEbusFlex] = useState(0);
  const [balloon, setBalloon] = useState(false);
  const [needleOut, setNeedleOut] = useState(0.5);
  const [stopper, setStopper] = useState(30);
  const [doppler, setDoppler] = useState(true);
  const [gain, setGain] = useState(1);
  const [probe, setProbe] = useState<ProbePosition>("concentric");

  const order = device.parts.map((p) => p.id);
  const switchDevice = (id: Device["id"]) => {
    setDeviceId(id);
    setPartId(DEVICES.find((d) => d.id === id)!.parts[0].id);
  };

  const preset = CONVEX_PRESETS["doppler-vessel"];

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={deviceId}
        onChange={switchDevice}
        options={[
          { value: "flexible", label: <><Cable className="h-3.5 w-3.5" />Flexible bronchoscope</> },
          { value: "cpebus", label: <><ScanLine className="h-3.5 w-3.5" />Convex-probe EBUS</> },
          { value: "rpebus", label: <><Radar className="h-3.5 w-3.5" />Radial-probe EBUS</> },
        ]}
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden">
          <CardHeader title={device.name} subtitle={device.tagline} icon={<Cable className="h-4 w-4" />} />
          <div className="bg-[#070b12] p-3">
            {deviceId === "flexible" && (
              <BronchoscopeDiagram active={partId} onSelect={setPartId} flex={flex} rotation={rotation} order={order} />
            )}
            {deviceId === "cpebus" && (
              <CpEbusDiagram
                active={partId}
                onSelect={setPartId}
                order={order}
                balloon={balloon && ebus.balloon}
                needleOut={needleOut}
                stopperMm={stopper}
                oblique={ebus.oblique}
                flex={ebusFlex}
              />
            )}
            {deviceId === "rpebus" && <RpEbusDiagram active={partId} onSelect={setPartId} order={order} position={probe} />}
          </div>

          <div className="border-t border-line p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" /> {l("Interactive controls", "ตัวควบคุม")}
            </p>
            {deviceId === "flexible" && (
              <div className="space-y-4 text-sm">
                <ModelPicker value={modelId} onChange={(id) => { setModelId(id); setFlex(0); }} options={SCOPE_MODELS.map((m) => ({ id: m.id, hint: content.scopeUse(m.id, m.use) }))} />
                <label className="block">
                  {l("UP/DOWN angulation lever:", "คันโยกงอปลาย UP/DOWN:")} <b className="font-mono text-cyan-300">{flex > 0 ? "+" : ""}{flex}°</b>
                  <input type="range" className="slider mt-2 w-full" min={-model.down} max={model.up} value={flex} onChange={(e) => setFlex(+e.target.value)} />
                  <span className="mt-1 flex justify-between text-[11px] text-muted"><span>DOWN {model.down}°</span><span>0</span><span>UP {model.up}°</span></span>
                </label>
                <label className="block">
                  {l("Insertion-tube rotation ring:", "Rotation ring หมุน insertion tube:")} <b className="font-mono text-cyan-300">{rotation > 0 ? "R " : rotation < 0 ? "L " : ""}{Math.abs(rotation)}°</b>
                  <input type="range" className="slider mt-2 w-full" min={-120} max={120} value={rotation} onChange={(e) => setRotation(+e.target.value)} />
                  <span className="mt-1 flex justify-between text-[11px] text-muted"><span>{l("Left 120°", "ซ้าย 120°")}</span><span>{l("neutral", "ตำแหน่งกลาง")}</span><span>{l("Right 120°", "ขวา 120°")}</span></span>
                </label>
                <p className="text-xs text-muted">{l("Rotating the ring turns the bending plane and the image (octagonal image inset) — this is why atlas views of the right lung often appear rotated.", "การหมุน ring ทำให้ระนาบการงอและภาพหมุนตาม (ดูภาพแปดเหลี่ยม) — จึงเป็นเหตุที่ภาพปอดขวาใน atlas มักดูหมุนไป")}</p>
              </div>
            )}
            {deviceId === "cpebus" && (
              <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                <div className="space-y-3 text-sm">
                  <ModelPicker value={ebusId} onChange={(id) => { setEbusId(id); setEbusFlex(0); }} options={EBUS_MODELS.map((m) => ({ id: m.id, hint: content.ebusNote(m.id, m.note) }))} />
                  <label className="block">
                    {l("Angulation:", "มุมงอปลาย:")} <b className="font-mono text-cyan-300">{ebusFlex > 0 ? "+" : ""}{ebusFlex}°</b>
                    <input type="range" className="slider mt-1 w-full" min={-ebus.down} max={ebus.up} value={ebusFlex} onChange={(e) => setEbusFlex(+e.target.value)} />
                    <span className="mt-1 flex justify-between text-[11px] text-muted"><span>DOWN {ebus.down}°</span><span>UP {ebus.up}°</span></span>
                  </label>
                  <label className={cn("flex items-center gap-2", !ebus.balloon && "opacity-40")}>
                    <input type="checkbox" checked={balloon && ebus.balloon} disabled={!ebus.balloon} onChange={(e) => setBalloon(e.target.checked)} className="accent-cyan-400" />
                    {l("Inflate balloon (saline)", "ขยาย balloon (น้ำเกลือ)")}{!ebus.balloon && l(" — not used with the BF-UCP190F", " — ไม่ใช้กับ BF-UCP190F")}
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={doppler} onChange={(e) => setDoppler(e.target.checked)} className="accent-cyan-400" />
                    {l("Colour Doppler", "Colour Doppler")}
                  </label>
                  <label className="block">
                    {l("Needle advanced:", "ดันเข็มออก:")} <b className="font-mono text-cyan-300">{Math.round(needleOut * stopper)} mm</b> / {stopper} mm
                    <input type="range" className="slider mt-1 w-full" min={0} max={1} step={0.01} value={needleOut} onChange={(e) => setNeedleOut(+e.target.value)} />
                  </label>
                  <label className="block">
                    {l("Needle stopper (20–40 mm):", "Needle stopper (20–40 mm):")} <b className="font-mono text-amber-300">{stopper} mm</b>
                    <input type="range" className="slider mt-1 w-full" min={20} max={40} value={stopper} onChange={(e) => setStopper(+e.target.value)} />
                  </label>
                  <label className="block">
                    Gain: <b className="font-mono text-cyan-300">{gain.toFixed(2)}</b>
                    <input type="range" className="slider mt-1 w-full" min={0.5} max={1.6} step={0.05} value={gain} onChange={(e) => setGain(+e.target.value)} />
                  </label>
                </div>
                <div>
                  <ConvexSonogram
                    params={{ ...preset, doppler, gain, balloon: balloon && ebus.balloon, needle: needleOut > 0.05 ? { depth: needleOut * stopper, angleDeg: 38 } : null }}
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    {l("Generated image: 65° sector, transducer at the top, needle entering from the upper right. Hypoechoic node beside a vessel — check Doppler before every puncture.", "ภาพที่สร้างขึ้น: sector 65° transducer อยู่ด้านบน เข็มเข้าจากขวาบน เห็น hypoechoic node ข้างหลอดเลือด — ตรวจ Doppler ก่อนเจาะทุกครั้ง")}
                  </p>
                </div>
              </div>
            )}
            {deviceId === "rpebus" && (
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <div className="space-y-2 text-sm">
                  <p className="text-muted">{l("Probe–lesion relationship:", "ตำแหน่ง probe เทียบกับรอยโรค:")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(["concentric", "eccentric", "adjacent", "aerated"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setProbe(p)}
                        className={cn(
                          "rounded-md border px-2.5 py-1 text-xs capitalize",
                          probe === p ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400",
                        )}
                      >
                        {p === "concentric" ? l("Within (concentric)", "Within (concentric)") : p === "aerated" ? l("Off target (aerated lung)", "ไม่ตรงรอยโรค (aerated lung)") : p}
                      </button>
                    ))}
                  </div>
                  <Callout tone={probe === "concentric" ? "ok" : probe === "aerated" ? "danger" : "warn"} className="mt-3">
                    {probe === "concentric" && l("Probe surrounded by lesion — highest yield. Withdraw probe, keep the guide sheath fixed and sample through it.", "Probe ถูกรอยโรคล้อมรอบ — yield สูงสุด ถอด probe คง guide sheath ไว้ แล้วเก็บตัวอย่างผ่าน sheath")}
                    {probe === "eccentric" && l("Probe inside but off-centre — acceptable; consider re-angling into a neighbouring subsegment for a concentric view.", "Probe อยู่ในรอยโรคแต่ไม่อยู่กลาง — ยอมรับได้ ลองเปลี่ยนไป subsegment ข้างเคียงเพื่อให้ได้ภาพ concentric")}
                    {probe === "adjacent" && l("Probe at the lesion edge — lower yield. Try another subsegment, add TBNA/cryobiopsy or navigation.", "Probe อยู่ที่ขอบรอยโรค — yield ต่ำลง ลอง subsegment อื่น เพิ่ม TBNA/cryobiopsy หรือใช้ navigation")}
                    {probe === "aerated" && l("Snowstorm pattern of aerated lung — not at the lesion. Re-navigate using CT/fluoroscopy.", "ภาพ snowstorm ของปอดที่มีอากาศ — ยังไม่ถึงรอยโรค นำทางใหม่ด้วย CT/fluoroscopy")}
                  </Callout>
                </div>
                <RadialSonogram params={{ seed: 5, pattern: probe, gain: 1 }} />
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader
              title={part.label}
              subtitle={l(`Callout ${order.indexOf(part.id) + 1} of ${order.length}`, `หมายเลข ${order.indexOf(part.id) + 1} จาก ${order.length}`)}
              icon={<span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-[11px] font-bold text-slate-950">{order.indexOf(part.id) + 1}</span>}
            />
            <div className="space-y-3 p-4 text-sm">
              <p className="leading-relaxed text-slate-200">{part.summary}</p>
              <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-slate-300">
                {part.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
              {part.pitfall && (
                <Callout tone="warn" title={<span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />{l("Pitfall", "ข้อควรระวัง")}</span>}>
                  {part.pitfall}
                </Callout>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-line p-3">
              {device.parts.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPartId(p.id)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px]",
                    p.id === part.id ? "bg-cyan-500/15 text-cyan-200" : "text-slate-400 hover:bg-panel-2",
                  )}
                >
                  {i + 1}. {p.label}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader
              title={l("Key specifications", "ข้อมูลจำเพาะสำคัญ")}
              subtitle={deviceId === "flexible" ? model.name : deviceId === "cpebus" ? ebus.name : l("Radial EBUS set-up", "อุปกรณ์ radial EBUS")}
            />
            <dl className="divide-y divide-line/70 px-4 py-2 text-sm">
              {specRows(deviceId, model, ebus).map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-1.5">
                  <dt className="text-muted">{content.specLabel(row.label)}</dt>
                  <dd className="text-right font-mono text-[12px] text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-line px-4 py-2 text-[11px] text-muted">
              {l("Sources:", "แหล่งข้อมูล:")} {device.refs.map((r) => REF_BY_ID[r]?.short).join(" · ")}. {l("Check the IFU of your instrument.", "ตรวจสอบคู่มือ (IFU) ของเครื่องที่ใช้จริง")}
            </p>
          </Card>
        </div>
      </div>

      {deviceId === "cpebus" && (
        <Card>
          <CardHeader title={l("EBUS-TBNA needles (needle length adjustable 20–40 mm)", "เข็ม EBUS-TBNA (ปรับความยาวเข็ม 20–40 mm)")} subtitle={l("CHEST 2016: 21 G and 22 G are equivalent for diagnostic yield", "CHEST 2016: เข็ม 21 G และ 22 G ให้ diagnostic yield เท่ากัน")} icon={<ScanLine className="h-4 w-4" />} />
          <div className="grid gap-3 p-4 md:grid-cols-4">
            {NEEDLES.map((n) => (
              <div key={n.gauge} className="rounded-lg border border-line bg-panel-2 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg font-bold text-cyan-300">{n.gauge}</p>
                  <Badge tone={parseFloat(n.channel.replace("≥", "")) <= ebus.channel ? "ok" : "danger"}>
                    {parseFloat(n.channel.replace("≥", "")) <= ebus.channel ? l(`fits ${ebus.name}`, `ใช้กับ ${ebus.name} ได้`) : l(`needs ${n.channel}`, `ต้องการ channel ${n.channel}`)}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[11px] text-muted">{n.product}</p>
                <p className="mt-1 text-[13px] text-slate-300">{content.needleUse(n.gauge, n.use)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function ModelPicker({ value, onChange, options }: { value: string; onChange: (id: string) => void; options: { id: string; hint: string }[] }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn("rounded-md border px-2.5 py-1 font-mono text-xs", value === o.id ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}
          >
            {o.id}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">{options.find((o) => o.id === value)?.hint}</p>
    </div>
  );
}

function specRows(
  deviceId: Device["id"],
  m: (typeof SCOPE_MODELS)[number],
  e: (typeof EBUS_MODELS)[number],
): { label: string; value: string }[] {
  if (deviceId === "flexible") {
    return [
      { label: "Field of view", value: `${m.fov}°` },
      { label: "Depth of field", value: m.dof },
      { label: "Distal end OD", value: `Ø ${m.distalOD} mm` },
      { label: "Insertion tube OD", value: `Ø ${m.tubeOD} mm` },
      { label: "Channel inner diameter", value: `Ø ${m.channel} mm` },
      { label: "Angulation", value: `UP ${m.up}° / DOWN ${m.down}°` },
      ...FLEXIBLE_COMMON,
    ];
  }
  if (deviceId === "cpebus") {
    return [
      { label: "Field of view", value: `${e.fov}°` },
      { label: "Direction of view", value: `${e.oblique}° forward oblique` },
      { label: "Depth of field", value: e.dof },
      { label: "Distal end OD", value: `Ø ${e.distalOD} mm` },
      { label: "Insertion tube OD", value: `Ø ${e.tubeOD} mm` },
      { label: "Working length", value: "600 mm (total 890 mm)" },
      { label: "Channel inner diameter", value: `Ø ${e.channel} mm` },
      { label: "Angulation", value: `UP ${e.up}° / DOWN ${e.down}°` },
      { label: "Balloon", value: e.balloon ? "Yes (MAJ-1351)" : "Not required" },
      ...EBUS_ULTRASOUND,
    ];
  }
  return [
    { label: "Probe", value: "Mechanical radial, ~20 MHz, Ø ~1.4 mm" },
    { label: "Image", value: "360°, probe at centre" },
    { label: "Penetration", value: "≈4–5 cm radius" },
    { label: "Scope", value: "Thin scope, e.g. BF-P190 (Ø 4.2 mm, 2.0 mm channel)" },
    { label: "Guide sheath", value: "Radiopaque tip; stays as extended working channel" },
    { label: "Processor", value: "EU-ME3 via probe driving unit" },
    { label: "Pooled yield", value: "≈70% (higher if probe within lesion)" },
  ];
}
