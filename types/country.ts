export type Country = {
  name: string;
  alpha2Code: string;
  flag: string;
  languages?: {
    iso639_1: string;
    name: string;
    nativeName?: string;
  }[];
};
