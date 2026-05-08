import { canDrop } from 'Common/treeUtility';
import update from 'immutability-helper';
import memoizeOne from 'memoize-one';
import { CommonNode } from 'Models/typed';
import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { actions } from 'Store/ducks/IHPToolStructure';
import { useAppDispatch } from 'Store/hooks';
import Row, { DragRow } from './Row';
import styles from './SpeedTree.module.css';

export interface Tree {
  id: string;
  label: string;
  toolTipText: string;
  data: CommonNode;
  children: Tree[];
}

interface TreeItem {
  id: string;
  label: string;
  hasChildren: boolean;
  depth: number;
  collapsed: boolean;
  data: CommonNode;
}

export interface RowData {
  flattenedData: TreeItem[];
  onOpen: (n: TreeItem) => void;
  onSelect: (
    e: React.MouseEventHandler<HTMLDivElement> | undefined,
    n: TreeItem
  ) => void;
  ksId: string;
  displayCheckbox: boolean;
  onSelectCheckbox: (id: string) => void;
  selectStatusIDS: string[];
  moveRow: (id: string, index: number) => void;
  findNode: (id: string) => { id: string; index: number };
  disableExpand: boolean;
}

const getItemData = memoizeOne(
  (
    onOpen,
    onSelect,
    flattenedData,
    ksId,
    displayCheckbox,
    onSelectCheckbox,
    selectStatusIDS,
    moveRow,
    findNode,
    disableExpand
  ): RowData => ({
    onOpen,
    onSelect,
    flattenedData,
    ksId,
    displayCheckbox,
    onSelectCheckbox,
    selectStatusIDS,
    moveRow,
    findNode,
    disableExpand,
  })
);

type Props = {
  data: Tree[];
  expanded: string[];
  setExpanded: (ids: string[]) => void;
  ksId: string;
  displayCheckbox: boolean;
  onSelectCheckbox: (id: string) => void;
  selectStatusIDS: string[];
  disableExpand: boolean;
};

const SpeedTree: React.FC<Props> = ({
  data,
  expanded,
  setExpanded,
  ksId,
  displayCheckbox,
  onSelectCheckbox,
  selectStatusIDS,
  disableExpand = false,
}) => {
  const [flattenedData, setFlattenedData] = useState<TreeItem[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data && data.length !== 0) {
      setFlattenedData(flattenOpened(data));
    }
  }, [data, expanded]);

  const [, drop] = useDrop<DragRow>({
    accept: ['ROW'],
    canDrop(item) {
      const above = flattenedData[item.index - 1];
      const dragged = flattenedData[item.index];
      return canDrop(dragged.data, above.data, true, []);
    },

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item) {
      console.info('DROPPA', item);
      const row = flattenedData[item.index - 1];
      dispatch(
        actions.moveNode({
          nodeId: item.id,
          nodeAboveId: row.id,
        })
      );
      return item;
    },
  });

  const flattenOpened = (treData: Tree[]) => {
    const result: TreeItem[] = [];
    for (const node of treData) {
      flattenNode(node, 1, result);
    }
    return result;
  };

  const flattenNode = (node: Tree, depth: number, result: TreeItem[]) => {
    const { id, label, children } = node;
    const collapsed = !expanded.includes(id);
    result.push({
      id,
      label,
      hasChildren: children && children.length > 0,
      depth,
      collapsed,
      data: node.data,
    });

    if (!collapsed && children) {
      for (const child of children) {
        flattenNode(child, depth + 1, result);
      }
    }
  };

  const onOpen = (node: TreeItem) => {
    if (node.collapsed) {
      setExpanded([...expanded, node.id]);
    } else {
      setExpanded(expanded.filter((id) => id !== node.id));
    }
  };

  const onSelect = (
    e: React.SyntheticEvent<HTMLDivElement, Event>,
    treeItem: TreeItem
  ) => {
    e.stopPropagation();
    console.log('SELECT', treeItem);
  };

  const findNode = useCallback(
    (id: string) => {
      const row = flattenedData.filter((i) => i.id === id)[0];
      return {
        row,
        index: flattenedData.indexOf(row),
      };
    },
    [flattenedData]
  );

  const moveRow = useCallback(
    (id: string, to: number) => {
      const { index, row } = findNode(id);
      const newFlattenedData = update(flattenedData, {
        $splice: [
          [index, 1],
          [to, 0, row],
        ],
      });
      setFlattenedData(newFlattenedData);
    },
    [flattenedData]
  );

  const itemData = getItemData(
    onOpen,
    onSelect,
    flattenedData,
    ksId,
    displayCheckbox,
    onSelectCheckbox,
    selectStatusIDS,
    moveRow,
    findNode,
    disableExpand
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <AutoSizer>
        {({ height, width }) => (
          <div ref={drop}>
            <List
              className={styles.list}
              height={height}
              itemCount={flattenedData.length}
              itemSize={40}
              width={width}
              itemData={itemData}
            >
              {Row}
            </List>
          </div>
        )}
      </AutoSizer>
    </DndProvider>
  );
};

export default SpeedTree;
