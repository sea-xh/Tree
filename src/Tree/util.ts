//@ts-nocheck
export function flattenTreeData(treeNodeList, expandedKeys, nodeNames) {
  const flattenList = [];
  function dig(list, parent) {
    return list.map((treeNode, index) => {
      const flattenNode = {
        data: treeNode,
        isStart: [...(parent ? parent.isStart : []), index === 0],
        isEnd: [...(parent ? parent.isEnd : []), index === list.length - 1],
      };

      flattenList.push(flattenNode);

      if (expandedKeys) {
        flattenNode.children = dig(treeNode[nodeNames] || [], flattenNode);
      }
      return flattenNode;
    });
  }

  dig(treeNodeList);

  return flattenList;
}

export function convertDataToKey(nodes) {
  const posEntities = {};
  const keyEntities = {};
  let wrapper = {
    posEntities,
    keyEntities,
  };
  // TODO: 有点匆忙 没想好怎么写。。。。
  // traverseNodes(nodes, (item) => {
  //   const { node, index, key } = item;
  //   const entity = { node, index, key };
  // });
  return wrapper;
}
