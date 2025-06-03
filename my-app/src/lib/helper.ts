
export const maxCountryID = 195;

export function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
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