import type { Metadata } from "next";
import { HomePage } from "../home-page";

export const metadata: Metadata = {
  title: "Wenhou Yan | Product Designer",
  description:
    "Wenhou Yan's design portfolio, spanning industrial design, digital products, engineering and rapid prototyping.",
};

export default function EnglishHome() {
  return <HomePage locale="en" />;
}

