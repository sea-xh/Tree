//@ts-nocheck
import * as React from 'react';
import classNames from 'classnames';
import { TreeContext, TreeContextProps } from './contextTypes';
import { getDataAndAria } from './util';
import Indent from './Indent';
import { convertNodeProps } from './treeUtil';

const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

export interface TreeNodeProps {
  eventKey?: any;
  prefixCls?: string;
  expanded?: boolean;
  isStart?: boolean[];
  isEnd?: boolean[];
  isLeaf?: boolean;
  context?: TreeContextProps;
}

class TreeNode extends React.Component<TreeNodeProps, any> {
  onMouseEnter = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const {
      context: { onMouseEnter },
    } = this.props;
    onMouseEnter(e, convertNodeProps(this.props));
  };

  onMouseLeave = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const {
      context: { onMouseLeave },
    } = this.props;
    onMouseLeave(e, convertNodeProps(this.props));
  };

  onExpand: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const {
      context: { onNodeExpand },
    } = this.props;
    onNodeExpand(e, convertNodeProps(this.props));
  };

  hasChildren = () => {
    const { eventKey } = this.props;
    const {
      context: { keyEntities },
    } = this.props;
    const { children } = keyEntities[eventKey] || {};

    return !!(children || []).length;
  };

  isLeaf = () => {
    const hasChildren = this.hasChildren();
    return !hasChildren;
  };

  renderSwitcherIconDom = (isLeaf: boolean) => {
    const {
      context: { switcherIcon: switcherIconFromCtx },
    } = this.props;

    const switcherIcon = switcherIconFromCtx;
    if (typeof switcherIcon === 'function') {
      return switcherIcon({ ...this.props, isLeaf });
    }
    return switcherIcon;
  };

  renderSwitcher = () => {
    const { expanded } = this.props;
    const {
      context: { prefixCls },
    } = this.props;

    if (this.isLeaf()) {
      const switcherIconDom = this.renderSwitcherIconDom(true);

      return switcherIconDom !== false ? (
        <span className={classNames(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>{switcherIconDom}</span>
      ) : null;
    }

    const switcherCls = classNames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`,
    );

    const switcherIconDom = this.renderSwitcherIconDom(false);

    return switcherIconDom !== false ? (
      <span onClick={this.onExpand} className={switcherCls}>
        {switcherIconDom}
      </span>
    ) : null;
  };

  renderSelector = () => {
    const { title } = this.props;
    const {
      context: { prefixCls },
    } = this.props;
    const $title = <span className={`${prefixCls}-title`}>{title}</span>;

    return (
      <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {$title}
      </span>
    );
  };

  render() {
    const { eventKey, isLeaf, isStart, isEnd, expanded, ...otherProps } = this.props;
    const {
      context: { prefixCls, keyEntities },
    } = this.props;
    const dataOrAriaAttributeProps = getDataAndAria(otherProps);
    const { level } = keyEntities[eventKey] || {};
    return (
      <div className={`${prefixCls}-treenode`} {...dataOrAriaAttributeProps}>
        <Indent prefixCls={prefixCls} level={level} isStart={isStart} isEnd={isEnd} />
        {this.renderSwitcher()}
        {this.renderSelector()}
      </div>
    );
  }
}

const ContextTreeNode: React.FC<TreeNodeProps> = (props) => (
  <TreeContext.Consumer>{(context) => <TreeNode {...props} context={context} />}</TreeContext.Consumer>
);

export default ContextTreeNode;
