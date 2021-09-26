//@ts-nocheck
import React from 'react';
import Tree from '../src/components/Tree';

const treeData = [
  {
    key: '0-0',
    title: 'Root',
    children: [
      {
        key: '0-0-0',
        title: 'Node1',
        children: [{ key: '0-0-0-0', title: 'Node1-1', children: [{ key: '0-0-0-0-0', title: 'Node1-1-1' }] }],
      },
      {
        key: '0-0-1',
        title: 'Node2',
        children: [
          {
            key: '0-0-1-0',
            title: 'Node2-1',
            children: [
              { key: '0-0-1-0-0', title: 'Node2-1-1' },
              { key: '0-0-1-0-1', title: 'Node2-1-2' },
            ],
          },
          { key: '0-0-1-1', title: 'Node2-2' },
          { key: '0-0-1-2', title: 'Node2-3' },
        ],
      },
      {
        key: '0-0-3',
        title: 'Node3',
      },
    ],
  },
];

class Demo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Tree treeData={treeData} />;
  }
}

export default Demo;
