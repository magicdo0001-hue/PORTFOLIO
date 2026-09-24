import type { Metadata } from "next";
import RhineLabExperience from "../rhine-lab-experience";

export const metadata: Metadata = {
  title: "Wenhou Yan | Product Designer",
  description:
    "Wenhou Yan's design portfolio, spanning industrial design, digital products, engineering and rapid prototyping.",
};

export default function EnglishHome() {
  return <main><RhineLabExperience locale="en" /></main>;
}

