import { calculateForce } from "./logic.mjs";
import {
  announce,
  clearResult,
  copyText,
  numberFormat,
  readToolCopy,
  showRows,
} from "../controller-helpers.mjs";

const root = document.querySelector('[data-tool="force-calculator"]');
if (root) {
  const form = root.querySelector("#tool-form");
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem("mode");
  const format = (value) =>
    numberFormat(document.documentElement.lang || "en", value, 6);
  let outputText = "";

  function syncMode() {
    const netMode = mode.value === "net-forces";
    root.querySelector("[data-force-solve]").hidden = netMode;
    root.querySelector("[data-force-net]").hidden = !netMode;
    for (const name of ["force", "mass", "acceleration"]) {
      const field = form.elements.namedItem(name);
      const shown = mode.value !== `solve-${name}`;
      root.querySelector(`[data-force-field="${name}"]`).hidden = !shown;
      field.required = shown && !netMode;
    }
    form.elements.namedItem("forces").required = netMode;
    form.elements.namedItem("netMass").required = netMode;
  }

  function drawDiagram(values) {
    const content = root.querySelector("[data-result-content]");
    const figure = document.createElement("figure");
    figure.className = "force-diagram";
    const caption = document.createElement("figcaption");
    caption.textContent = copy.messages.diagram;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 320 150");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", copy.messages.diagram);
    const axis = document.createElementNS(svg.namespaceURI, "line");
    axis.setAttribute("x1", "18");
    axis.setAttribute("x2", "302");
    axis.setAttribute("y1", "135");
    axis.setAttribute("y2", "135");
    axis.setAttribute("stroke", "currentColor");
    svg.append(axis);
    const maximum = Math.max(...values.map(Math.abs), 1);
    values.forEach((value, index) => {
      const y = 24 + index * 22;
      const start = 160;
      const direction = Math.sign(value);
      const end = start + direction * ((88 * Math.abs(value)) / maximum);
      if (direction === 0) {
        const point = document.createElementNS(svg.namespaceURI, "circle");
        point.setAttribute("cx", String(start));
        point.setAttribute("cy", String(y));
        point.setAttribute("r", "3");
        point.setAttribute("fill", "currentColor");
        svg.append(point);
      } else {
        const line = document.createElementNS(svg.namespaceURI, "line");
        line.setAttribute("x1", String(start));
        line.setAttribute("x2", String(end));
        line.setAttribute("y1", String(y));
        line.setAttribute("y2", String(y));
        line.setAttribute("stroke", "currentColor");
        line.setAttribute("stroke-width", "3");
        const tip = document.createElementNS(svg.namespaceURI, "path");
        tip.setAttribute(
          "d",
          direction > 0
            ? `M ${end - 8} ${y - 5} L ${end} ${y} L ${end - 8} ${y + 5}`
            : `M ${end + 8} ${y - 5} L ${end} ${y} L ${end + 8} ${y + 5}`,
        );
        tip.setAttribute("fill", "none");
        tip.setAttribute("stroke", "currentColor");
        tip.setAttribute("stroke-width", "3");
        svg.append(line, tip);
      }
      const label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute(
        "x",
        String(
          direction === 0
            ? start + 5
            : direction > 0
              ? Math.min(end + 4, 250)
              : Math.max(end - 48, 4),
        ),
      );
      label.setAttribute("y", String(y - 5));
      label.setAttribute("font-size", "11");
      label.textContent = `F${index + 1}: ${format(value)} ${form.elements.namedItem("forceUnit").value}`;
      svg.append(label);
    });
    figure.append(caption, svg);
    content.append(figure);
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = "";
    try {
      const result = calculateForce({
        mode: mode.value,
        forceUnit: form.elements.namedItem("forceUnit").value,
        massUnit: form.elements.namedItem("massUnit").value,
        accelerationUnit: form.elements.namedItem("accelerationUnit").value,
        force: form.elements.namedItem("force").value,
        mass: form.elements.namedItem("mass").value,
        acceleration: form.elements.namedItem("acceleration").value,
        forces: form.elements.namedItem("forces").value,
        netMass: form.elements.namedItem("netMass").value,
      });
      const forceUnit = result.forceUnit;
      const massUnit = result.massUnit;
      const accelerationUnit = result.accelerationUnit;
      let rows;
      if (result.mode === "net-forces") {
        rows = [
          [copy.messages.netForce, `${format(result.netForce)} ${forceUnit}`],
          [copy.messages.mass, `${format(result.mass)} ${massUnit}`],
          [
            copy.messages.acceleration,
            `${format(result.acceleration)} ${accelerationUnit}`,
          ],
        ];
        outputText = rows
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n");
        showRows(root, rows);
        drawDiagram(result.forceValues);
      } else {
        rows = [
          [copy.messages.force, `${format(result.force)} ${forceUnit}`],
          [copy.messages.mass, `${format(result.mass)} ${massUnit}`],
          [
            copy.messages.acceleration,
            `${format(result.acceleration)} ${accelerationUnit}`,
          ],
        ];
        showRows(root, rows);
        outputText = rows
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n");
      }
      announce(root, copy.messages.calculated, "success");
    } catch {
      announce(root, copy.messages.checkInputs, "error");
    }
  }

  mode.addEventListener("change", syncMode);
  form.addEventListener("submit", calculate);
  root
    .querySelector('[data-action="example"]')
    ?.addEventListener("click", () => {
      if (mode.value === "net-forces") {
        form.elements.namedItem("forces").value = "10, -4";
        form.elements.namedItem("netMass").value = "2";
      } else {
        mode.value = "solve-force";
        form.elements.namedItem("forceUnit").value = "N";
        form.elements.namedItem("massUnit").value = "kg";
        form.elements.namedItem("accelerationUnit").value = "m/s²";
        form.elements.namedItem("mass").value = "2";
        form.elements.namedItem("acceleration").value = "3";
      }
      syncMode();
      calculate();
    });
  form.addEventListener("reset", () =>
    setTimeout(() => {
      outputText = "";
      syncMode();
      clearResult(root);
      announce(root, "");
    }, 0),
  );
  root.querySelector('[data-action="copy"]')?.addEventListener("click", () => {
    if (outputText) copyText(root, outputText, copy);
  });
  syncMode();
}
