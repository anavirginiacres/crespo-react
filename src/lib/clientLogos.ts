import type { StaticImageData } from "next/image";
import agricoladelestero from "@/styles/images/clients/agricola.png";
import anglo from "@/styles/images/clients/anglo.png";
import asicana from "@/styles/images/clients/asicana.png";
import bse from "@/styles/images/clients/bse.png";
import canal7 from "@/styles/images/clients/canal7.png";
import casinosdelsol from "@/styles/images/clients/casinosdelsol.png";
import cenra from "@/styles/images/clients/cenra.png";
import chelala from "@/styles/images/clients/chelala.png";
import clinicayunes from "@/styles/images/clients/yunes.png";
import cobse from "@/styles/images/clients/cobse.png";
import colegioabogados from "@/styles/images/clients/colegioabogados.png";
import cpcese from "@/styles/images/clients/cpce.png";
import edese from "@/styles/images/clients/edese.png";
import hessen from "@/styles/images/clients/hessen.png";
import ingecon from "@/styles/images/clients/ingecon.png";
import laesquina from "@/styles/images/clients/laesquina.png";
import lobrunosa from "@/styles/images/clients/lobrunosa.png";
import mccenter from "@/styles/images/clients/mccenter.png";
import naranjax from "@/styles/images/clients/naranja.png";
import nataly from "@/styles/images/clients/nataly.png";
import panedile from "@/styles/images/clients/panedile.png";

export type ClientLogo = {
  kind: "image";
  label: string;
  image: StaticImageData;
};

export const clientLogos: ClientLogo[] = [
  { kind: "image", label: "Agrícola del Estero", image: agricoladelestero },
  { kind: "image", label: "Anglo", image: anglo },
  { kind: "image", label: "Asicana", image: asicana },
  { kind: "image", label: "BSE", image: bse },
  { kind: "image", label: "Canal 7", image: canal7 },
  { kind: "image", label: "Casinos del Sol", image: casinosdelsol },
  { kind: "image", label: "CenRA", image: cenra },
  { kind: "image", label: "Roberto Chelala", image: chelala },
  { kind: "image", label: "Clínica Yunes", image: clinicayunes },
  { kind: "image", label: "COBSE", image: cobse },
  { kind: "image", label: "Colegio de Abogados", image: colegioabogados },
  { kind: "image", label: "CPCE", image: cpcese },
  { kind: "image", label: "EDESE", image: edese },
  { kind: "image", label: "Hessen", image: hessen },
  { kind: "image", label: "Ingecon", image: ingecon },
  { kind: "image", label: "La Esquina", image: laesquina },
  { kind: "image", label: "Lo Bruno S.A.", image: lobrunosa },
  { kind: "image", label: "MC Center", image: mccenter },
  { kind: "image", label: "Naranja X", image: naranjax },
  { kind: "image", label: "Súper Nataly", image: nataly },
  { kind: "image", label: "Panedile", image: panedile },
];

export function getClientLogos(): ClientLogo[] {
  return clientLogos;
}
