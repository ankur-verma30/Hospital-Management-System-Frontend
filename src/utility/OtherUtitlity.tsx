const arrayToCSV = (arr: string[] ) => {
  if (!arr || arr.length === 0) return null;
  return arr.join(", ");
};

const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export { arrayToCSV,capitalize };