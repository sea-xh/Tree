//@ts-nocheck
import { DataNode, FlattenNode, DataEntity, Key, EventDataNode, GetKey, FieldNames } from './interface';
import { getPosition } from './util';
import { TreeNodeProps } from './TreeNode';

export function getKey(key: Key) {
  if (key !== null && key !== undefined) {
    return key;
  }
}

export function fillFieldNames(fieldNames?: FieldNames) {
  const { title, key, children } = fieldNames || {};

  return {
    title: title || 'title',
    key: key || 'key',
    children: children || 'children',
  };
}

export function flattenTreeData(
  treeNodeList: DataNode[],
  expandedKeys: Key[] | true,
  fieldNames: FieldNames,
): FlattenNode[] {
  const { key: fieldKey, children: fieldChildren } = fillFieldNames(fieldNames);

  const expandedKeySet = new Set(expandedKeys === true ? [] : expandedKeys);
  const flattenList: FlattenNode[] = [];

  function dig(list: DataNode[], parent: FlattenNode): FlattenNode[] {
    return list.map((treeNode, index) => {
      const mergedKey = getKey(treeNode[fieldKey]);

      const flattenNode: FlattenNode = {
        key: mergedKey,
        data: treeNode,
        isStart: [...(parent ? parent.isStart : []), index === 0],
        isEnd: [...(parent ? parent.isEnd : []), index === list.length - 1],
      };

      flattenList.push(flattenNode);

      if (expandedKeys === true || expandedKeySet.has(mergedKey)) {
        flattenNode.children = dig(treeNode[fieldChildren] || [], flattenNode);
      }
      return flattenNode;
    });
  }

  dig(treeNodeList);

  return flattenList;
}

type ExternalGetKey = GetKey<DataNode> | string;

interface TraverseDataNodesConfig {
  childrenPropName?: string;
  externalGetKey?: ExternalGetKey;
  fieldNames?: FieldNames;
}

export function traverseDataNodes(
  dataNodes: DataNode[],
  callback: (data: { node: DataNode; index: number; key: Key; parentPos: string | number; level: number }) => void,
  config?: TraverseDataNodesConfig | string,
) {
  let mergedConfig: TraverseDataNodesConfig = {};
  if (typeof config === 'object') {
    mergedConfig = config;
  } else {
    mergedConfig = { externalGetKey: config };
  }
  mergedConfig = mergedConfig || {};

  const { childrenPropName, externalGetKey, fieldNames } = mergedConfig;

  const { key: fieldKey, children: fieldChildren } = fillFieldNames(fieldNames);

  const mergeChildrenPropName = childrenPropName || fieldChildren;

  let syntheticGetKey: (node: DataNode, pos?: string) => Key;
  if (externalGetKey) {
    if (typeof externalGetKey === 'string') {
      syntheticGetKey = (node: DataNode) => (node as any)[externalGetKey as string];
    } else if (typeof externalGetKey === 'function') {
      syntheticGetKey = (node: DataNode) => (externalGetKey as GetKey<DataNode>)(node);
    }
  } else {
    syntheticGetKey = (node, pos) => getKey(node[fieldKey], pos);
  }

  function processNode(node: DataNode, index?: number, parent?: { node: DataNode; pos: string; level: number }) {
    const children = node ? node[mergeChildrenPropName] : dataNodes;
    const pos = node ? getPosition(parent.pos, index) : '0';

    if (node) {
      const key: Key = syntheticGetKey(node, pos);
      const data = {
        node,
        index,
        pos,
        key,
        parentPos: parent.node ? parent.pos : null,
        level: parent.level + 1,
      };

      callback(data);
    }

    if (children) {
      children.forEach((subNode, subIndex) => {
        processNode(subNode, subIndex, {
          node,
          pos,
          level: parent ? parent.level + 1 : -1,
        });
      });
    }
  }
  processNode(null);
}

export function convertDataToEntities(dataNodes) {
  const posEntities = {};
  const keyEntities = {};
  let wrapper = {
    posEntities,
    keyEntities,
  };
  traverseDataNodes(dataNodes, (item) => {
    const { node, index, pos, key, parentPos, level } = item;
    const entity: DataEntity = { node, index, key, pos, level };

    const mergedKey = getKey(key);

    posEntities[pos] = entity;
    keyEntities[mergedKey] = entity;

    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }
  });

  return wrapper;
}

export interface TreeNodeRequiredProps {
  expandedKeys: Key[];
  selectedKeys: Key[];
  keyEntities: any;
}

export function getTreeNodeProps(key: Key, { expandedKeys, selectedKeys }: TreeNodeRequiredProps) {
  const treeNodeProps = {
    eventKey: key,
    expanded: expandedKeys.indexOf(key) !== -1,
    selected: selectedKeys.indexOf(key) !== -1,
  };
  return treeNodeProps;
}

export function convertNodePropsToEventData(props: TreeNodeProps): EventDataNode {
  const { data, expanded, selected } = props;

  const eventData = {
    ...data,
    expanded,
    selected,
  };

  return eventData;
}
