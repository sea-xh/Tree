//@ts-nocheck
import * as React from 'react';
import './assets/index.scss';
import { TreeContext } from './contextTypes';
import { arrAdd, arrDel } from './util';
import { DataNode, FlattenNode, EventDataNode, FieldNames } from './interface';
import { flattenTreeData, convertDataToEntities, fillFieldNames } from './treeUtil';
import NodeList from './NodeList';

export interface TreeProps {
  treeData: DataNode[];
  onMouseEnter?: (info: {}) => void;
  onMouseLeave?: (info: {}) => void;
}

interface TreeState {
  keyEntities: any;
  treeData: DataNode[];
  flattenNodes: FlattenNode[];
  prevProps: TreeProps;
  fieldNames: FieldNames;
  selectedKeys: [];
  expandedKeys: [];
}

class Tree extends React.Component<TreeProps, TreeState> {
  static defaultProps = {
    prefixCls: 'tree-root',
  };
  state: TreeState = {
    keyEntities: {},
    selectedKeys: [],
    expandedKeys: [],
    treeData: [],
    flattenNodes: [], // 扁平
    prevProps: null,
    fieldNames: fillFieldNames(),
  };

  static getDerivedStateFromProps(props: TreeProps, prevState: TreeState) {
    const { prevProps } = prevState;
    const newState = {
      prevProps: props,
    };

    // 需要同步获取data
    function needSync(name: string) {
      return (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name]);
    }

    let treeData: DataNode[];

    // title key children
    let { fieldNames } = prevState;

    if (needSync('treeData')) {
      ({ treeData } = props);
    }

    if (treeData) {
      newState.treeData = treeData;
      // 遍历数据节点
      const entitiesMap = convertDataToEntities(treeData, { fieldNames });
      newState.keyEntities = {
        ...entitiesMap.keyEntities,
      };
    }

    if (treeData || newState.expandedKeys) {
      // 递归 扁平
      const flattenNodes = flattenTreeData(
        treeData || prevState.treeData,
        newState.expandedKeys || prevState.expandedKeys,
        fieldNames,
      );
      newState.flattenNodes = flattenNodes;
    }
    return newState;
  }

  // 移入节点
  onMouseEnter = (event, node) => {
    // const flattenNodes = convertDataToEntities(this.props.treeData, 'key');
    // const machKey = Object.keys(flattenNodes.keyEntities);
    // for (let i = 0; i < machKey.length; i++) {
    //   console.log(node['key'], machKey[i]);
    //   // if (node['key'].indexOf(machKey[i])) {
    //   //   console.log(machKey[i]);
    //   // }
    // }
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

  // 获取属性透传下去
  getTreeNodeProps = () => {
    const { expandedKeys, selectedKeys, keyEntities } = this.state;
    return {
      expandedKeys: expandedKeys || [],
      selectedKeys: selectedKeys || [],
      keyEntities,
    };
  };

  setExpandedKeys = (expandedKeys) => {
    const { treeData, fieldNames } = this.state;
    const flattenNodes: FlattenNode[] = flattenTreeData(treeData, expandedKeys, fieldNames);
    this.uncontroll({
      expandedKeys,
      flattenNodes,
    });
  };

  // 点击展开收起
  onNodeExpand = (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => {
    let { expandedKeys } = this.state;
    const { fieldNames } = this.state;
    const { expanded } = treeNode;
    const key = treeNode[fieldNames.key];

    const targetExpanded = !expanded;

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, key);
    } else {
      expandedKeys = arrDel(expandedKeys, key);
    }

    this.setExpandedKeys(expandedKeys);
  };

  //
  uncontroll = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach((name) => {
      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState({
        ...newState,
      });
    }
  };

  render() {
    const { flattenNodes, keyEntities } = this.state;
    const { prefixCls } = this.props;

    return (
      <TreeContext.Provider
        value={{
          prefixCls,
          keyEntities,
          onNodeExpand: this.onNodeExpand,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
        }}
      >
        <div className={prefixCls}>
          <NodeList data={flattenNodes} {...this.getTreeNodeProps()} />
        </div>
      </TreeContext.Provider>
    );
  }
}

export default Tree;
