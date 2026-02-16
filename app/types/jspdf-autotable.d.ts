// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsPDF } from "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable(options: AutoTableOptions): jsPDF;
    lastAutoTable: { finalY: number };
  }

  interface AutoTableOptions {
    head: string[][];
    body: (string | number)[][];
    startY?: number;
    theme?: "striped" | "grid" | "plain";
    styles?: Partial<AutoTableStyles>;
    headStyles?: Partial<AutoTableStyles>;
    bodyStyles?: Partial<AutoTableStyles>;
  }

  interface AutoTableStyles {
    fontSize: number;
    fontStyle: "normal" | "bold" | "italic" | "bolditalic";
    fillColor: [number, number, number];
    textColor: [number, number, number];
    halign: "left" | "center" | "right";
  }
}