import { useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

// 创建可排序的子项组件
const SortableItem = SortableElement(({ value }) => (
  <div style={{ margin: '10px', padding: '10px', border: '1px solid gray' }}>
    {value}
  </div>
));

// 创建可排序的父容器组件
const SortableList = SortableContainer(({ items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </div>
));

const App = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);

  // 处理子元素排序后的回调函数
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      return newItems;
    });
  };

  return (
    <div>
      <h1>可排序的子元素</h1>
      <SortableList items={items} onSortEnd={onSortEnd} axis="xy" />
    </div>
  );
};

export default App;