interface IInstitutionalContentFields {
  aboutTitle: string;
  aboutText: string;

  whoWeAreTitle: string;
  whoWeAreText: string;

  purposeTitle: string;
  purposeText: string;

  mission: string;
  vision: string;
  values: string[];
}

interface IInstitutionalContentMeta {
  id: string;
  updatedAt: string;
}

export interface IInstitutionalContent
  extends IInstitutionalContentFields, IInstitutionalContentMeta {}

export type IUpdateInstitutionalContentInput = Pick<
  IInstitutionalContent,
  | "aboutTitle"
  | "aboutText"
  | "whoWeAreTitle"
  | "whoWeAreText"
  | "purposeTitle"
  | "purposeText"
  | "mission"
  | "vision"
  | "values"
>;

