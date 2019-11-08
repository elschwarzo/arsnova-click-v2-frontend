import { IconProp } from '@fortawesome/fontawesome-svg-core';

export declare interface IFooterBarElement {
  id: string;
  iconClass: IconProp;
  textClass: string;
  textName: string;
  selectable: boolean;
  showIntro: boolean;
  introTranslate?: string;
  linkTarget?: Function | Array<string>;
  queryParams?: object;
  onClickCallback?: Function;
  restoreClickCallback?: Function;
  isActive?: boolean;
  isLoading?: boolean;
}