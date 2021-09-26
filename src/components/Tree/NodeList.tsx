import * as React from 'react';
import VirtualList from 'rc-virtual-list';
import { FlattenNode } from './interface';
import TreeNode from './TreeNode';
import { getTreeNodeProps, getKey } from './treeUtil';

interface NodeListProps {
  prefixCls: string;
  data: FlattenNode[];
  expandedKeys: [];
  selectedKeys: [];
  keyEntities: any;
}

const NodeList: React.FC<NodeListProps> = (props) => {
  const { prefixCls, data, expandedKeys, selectedKeys, keyEntities, ...domProps } = props;

  const mergedData = data;

  const TreeNodeProps = {
    expandedKeys,
    selectedKeys,
    keyEntities,
  };

  return (
    <VirtualList {...domProps} data={mergedData}>
      {(treeNode: FlattenNode) => {
        const {
          data: { ...restProps },
          key,
          isStart,
          isEnd,
        } = treeNode;
        const mergedKey = getKey(key);
        // const { key, children, ...otherProps } = restProps;
        delete restProps.key;
        delete restProps.children;
        const treeNodeProps = getTreeNodeProps(mergedKey, TreeNodeProps);

        return <TreeNode {...restProps} {...treeNodeProps} data={treeNode.data} isStart={isStart} isEnd={isEnd} />;
      }}
    </VirtualList>
  );
};

export default NodeList;
