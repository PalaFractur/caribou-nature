const KEY = "cn_compare";
const MAX = 3;

export function getCompareList(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToCompare(id: number): void {
  const list = getCompareList();
  if (list.includes(id)) return;
  if (list.length >= MAX) return;
  localStorage.setItem(KEY, JSON.stringify([...list, id]));
}

export function removeFromCompare(id: number): void {
  const list = getCompareList().filter((i) => i !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearCompare(): void {
  localStorage.setItem(KEY, JSON.stringify([]));
}

export function isInCompare(id: number): boolean {
  return getCompareList().includes(id);
}
