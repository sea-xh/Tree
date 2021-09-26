//@ts-nocheck
import * as React from 'react';
import { flattenTreeData, convertDataToKey } from './util';

export function del(list = [], value) {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

export function add(list = [], value) {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

class Tree extends React.Component {
  state = {
    expandedKeys: [],
    treeData: [],
    flattenNodes: [], // 扁平
    nodeNames: { key: '', title: '', children: [] },
  };
  static getDerivedStateFromProps(props, prevState) {
    const newState = {
      prevProps: props,
    };
    let treeData = [];
    // if (treeData) {
    //   newState.treeData = treeData;
    //   // 遍历数据节点
    //   const entitiesMap = convertDataToKey(treeData, { nodeNames });
    //   newState.keyEntities = {
    //     ...entitiesMap.keyEntities,
    //   };
    // }
    if (treeData || newState.expandedKeys) {
      // 递归 扁平
      const flattenNodes = flattenTreeData(
        treeData || prevState.treeData,
        newState.expandedKeys || prevState.expandedKeys,
        nodeNames,
      );
      newState.flattenNodes = flattenNodes;
    }
    return newState;
  }
  // 移入节点
  onMouseEnter = (event, node) => {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter({ event, node });
    }
  };
  // 移出节点
  onMouseLeave = (event, node) => {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave({ event, node });
    }
  };
  // 点击展开收起
  onNodeExpand = (e: React.MouseEvent<HTMLDivElement>, treeNode) => {
    let { expandedKeys } = this.state;
    const { nodeNames } = this.state;
    const { expanded } = treeNode;
    const key = treeNode[nodeNames.key];
    const targetExpanded = !expanded;
    if (targetExpanded) {
      expandedKeys = add(expandedKeys, key);
    } else {
      expandedKeys = del(expandedKeys, key);
    }
  };

  render() {
    // flattenNodes
    return (
      <>
        <span onClick={this.onNodeExpand}>{icon}</span>
        <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {title}
        </span>
      </>
    );
  }
}

export default Tree;
