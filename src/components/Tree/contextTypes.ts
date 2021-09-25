import * as React from 'react';

export interface TreeContextProps {
  prefixCls: string;
  selectable: boolean;
  switcherIcon: any;
  keyEntities: any;
  onMouseEnter: any;
  onMouseLeave: any;
}

//@ts-ignore
export const TreeContext: React.Context<TreeContextProps> = React.createContext(null);
