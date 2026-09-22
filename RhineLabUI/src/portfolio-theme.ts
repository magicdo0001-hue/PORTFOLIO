import type { MeshPhysicalMaterial } from "three";

export const portfolioTheme = {
  background: "#0d110e",
  floor: "#111a13",
  accent: "#9bdd2a",
  text: "#e8eee2",
  muted: "#9eae95",
  label: "#142018",
} as const;

const colors: Record<string, string> = {
  Frosted_Polymer: "#bed0b3",
  Ivory_Edges: "#486346",
  Optical_Diffuser: "#18271c",
  Printed_Label: "#142018",
  Internal_Ceramic: "#7e9677",
  Optical_Edges: "#b9caaa",
  Subsurface_Optics: "#516b4c",
  Optical_Film_Edge: "#749267",
  Amber_Optical_Inlay: portfolioTheme.accent,
  Optical_Film: "#8aa57a",
  Index_Inlay: portfolioTheme.accent,
  Case_Engraving: "#4c6846",
  Case_Engraving_Highlight: "#9bb78a",
  Titanium_Fasteners: "#85927d",
  Moulded_Lettering: "#769067",
  Champagne_Index: portfolioTheme.accent,
  Optical_Glass_Body: "#728c69",
  Optical_Glass_Roof: "#8ba57e",
  Optical_Glass_Edge: "#c2d7b1",
  Optical_Bridge_Glass: "#79936c",
};

// Apply before palette registration so arrays, transitions and the viewer
// inherit identical colors while keeping the original transparency pipeline.
export function applyPortfolioMaterial(name: string, material: MeshPhysicalMaterial, array = false) {
  if (colors[name]) material.color.set(colors[name]);
  if (name === "Frosted_Polymer") {
    material.color.set(array ? "#a5bb97" : colors[name]);
    material.attenuationColor.set("#91b476");
  }
  if (name === "Amber_Optical_Inlay" || name === "Champagne_Index" || name === "Index_Inlay") {
    material.emissive.set(portfolioTheme.accent);
    material.emissiveIntensity = 0.12;
  }
}
