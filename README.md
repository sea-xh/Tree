# Tree

## API

### Tree props

| name | description | type | default |
| --- | --- | --- | --- |
| treeData | treeNodes data Array, if set it then you need not to construct children TreeNode. (value should be unique across the whole array) | array<{key,title,children, [disabled, selectable]}> | - |
| onMouseEnter | call when mouse enter a treeNode | function({event,node}) | - |
| onMouseLeave | call when mouse leave a treeNode | function({event,node}) | - |

## Development

```bash
yarn install
yarn start
```
