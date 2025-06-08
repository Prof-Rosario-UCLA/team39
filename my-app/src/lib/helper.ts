
export const maxCountryID = 195;

export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function KnuthShuffle(arr: Array<any>): Array<any>{
  for(let i = arr.length-1; i > 0; i--){
    //Generate random index
    const j = Math.floor(Math.random() * (i + 1));

    //Swap i & j
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function objectArrayDifference<T, K extends keyof T>(
  a: T[],
  b: T[],
  key: K
) : T[] {
  const bSet = new Set(b.map(item => item[key]));
  return a.filter(item => {!bSet.has(item[key])})
}