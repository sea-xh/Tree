import * as React from 'react';

export interface DataNode {
  children?: DataNode[];
  key: string | number;
}

export interface Entity {
  node: Element;
  index: number;
  parent?: Entity;
  children?: Entity[];
}

export interface FlattenNode {
  parent: FlattenNode | null;
  children: FlattenNode[];
  data: DataNode;
  title: React.ReactNode;
  isStart: boolean[];
  isEnd: boolean[];
}

export interface FieldNames {
  title?: string;
  key?: string;
  children?: string;
}
