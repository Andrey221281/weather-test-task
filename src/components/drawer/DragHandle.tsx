import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import React from "react";

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableContainerP = SortableContainer((props: any) => (
  <tbody {...props} />
));

export { DragHandle, SortableItem, SortableContainerP };
