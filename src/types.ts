export type Breed = {
  name: string;
  origin: string;
  rare: number;
  life_span: string;
  hypoallergenic: number;
  description: string;
}

export type Photo = {
  url: string;
  breeds: Breed[];
}

export type NameToIdMap = {
  [key: string]: string;
};
