export function toSI(value, type, system) {
  if (system === "Imperial") {
    if (type === "length") return value * 0.3048;
    if (type === "force") return value * 4.44822;
    if (type === "moment") return value * 1.35582;
  }
  return value;
}
