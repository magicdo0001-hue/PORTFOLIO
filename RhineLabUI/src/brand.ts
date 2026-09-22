// One shared mark for the interface and the printed archive label.
const paths = `<path d="M156 75C127 48 103 15 70 15C37 15 15 39 15 70S38 128 70 128C103 128 127 96 176 52M155 75C182 99 208 128 240 128C273 128 295 105 295 73S273 15 240 15C221 15 207 23 192 38" fill="none" stroke="currentColor" stroke-width="26"/><path d="M44 70h50M69 45v50M219 70h44" fill="none" stroke="currentColor" stroke-width="15"/>`;
export const labelMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 145" color="#e8eee2">${paths}</svg>`;
export const logo = `<svg viewBox="0 0 310 185" aria-label="Rhine Lab" role="img">${paths}<text x="165" y="174" text-anchor="middle" font-family="MiSans,sans-serif" font-size="16" font-weight="700" letter-spacing="22">RHINE·LAB</text></svg>`;
// The same Bezier contour, continuous for the opening's moving draw/erase ends.
// Its small printed gap is animated with stroke dashes, not baked into the path.
export const bootMarkContour =
  "M295 73C295 41 273 15 240 15C221 15 207 23 192 38C186 43 181 47 176 52C127 96 103 128 70 128C38 128 15 101 15 70C15 39 37 15 70 15C103 15 127 48 156 75C182 99 208 128 240 128C273 128 295 105 295 73Z";

// Distribute letters within the name's natural width while retaining each line's typography.
const spacedLetters = (text: string) => [...text].map(letter => `<span aria-hidden="true">${letter === " " ? "&nbsp;" : letter}</span>`).join("");
export const brandHeading = `<h1>WENHOU YA<span>N</span></h1><div aria-label="PROJECTS PORTFOLIO">${spacedLetters("PROJECTS PORTFOLIO")}</div><p><span class="brand-analysis" role="img" aria-label="ANALISIS">${spacedLetters("ANALISIS")}</span> <b>O<span>S</span></b></p>`;
