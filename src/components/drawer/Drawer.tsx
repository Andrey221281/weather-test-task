import { Drawer, Input, Table } from "antd";
import React, { useState } from "react";
import { arrayMove } from "react-sortable-hoc";
import { DragHandle, SortableContainerP, SortableItem } from "./DragHandle";
import { DeleteOutlined } from "@ant-design/icons";

import "./AppDrawer.css";
import { Locations } from "../../containers/WeatherContainer";

const { Search } = Input;

interface Props {
  visible: boolean;
  onClose: () => void;
  locations: Locations;
  setLocations: (e: any) => void;
  deleteItem: (e: number) => void;
  setVisible: (e: boolean) => void;
  isLoading?: boolean;
}
interface IDraggableBodyRow {
  className: string;
  style: React.StyleHTMLAttributes<object>;
  [key: string]: any;
}

export const AppDrawer: React.FunctionComponent<Props> = ({
  visible,
  onClose,
  locations,
  setLocations,
  deleteItem,
  setVisible,
  isLoading,
}) => {
  const [value, setValue] = useState("");

  const columns = [
    {
      title: "Sort",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "Name",
      dataIndex: "name",
      className: "drag-visible",
    },
    {
      title: "Action",
      render: (text: string, record: any) => (
        <DeleteOutlined
          className="cursor-pointer mt-0.5 text-gray-500 float-right"
          onClick={() => deleteItem(record.key)}
        />
      ),
    },
  ];

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const { dataSource } = locations;
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        ([] as any).concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      setLocations({ dataSource: newData });
    }
  };

  const DraggableContainer: React.FunctionComponent<{
    [key: string]: any;
  }> = (props: any) => (
    <SortableContainerP
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FunctionComponent<IDraggableBodyRow> = ({
    className,
    style,
    ...restProps
  }) => {
    const { dataSource } = locations;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const handleSubmit = () => {
    setLocations((locations: Locations) => {
      const data = {
        dataSource: [
          ...locations.dataSource,
          {
            key: locations.dataSource.length + 1,
            name: value,
            index: locations.dataSource.length + 1,
          },
        ],
      };
      localStorage.setItem("city", JSON.stringify(data));
      return { ...data };
    });
    setValue("");
    setVisible(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Drawer
      mask={false}
      width="300px"
      destroyOnClose={true}
      title="Settings"
      placement="right"
      onClose={onClose}
      visible={visible}
      getContainer={false}
      style={{ position: "absolute" }}
    >
      <div>
        <Table
          style={{ border: "1px solid #f0f0f0", borderBottom: "none" }}
          pagination={false}
          dataSource={locations.dataSource}
          columns={columns}
          size="small"
          rowKey={({ key }) => key}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />

        <Search
          className="mt-6"
          type="text"
          value={value}
          onChange={handleChange}
          enterButton="Add"
          onSearch={handleSubmit}
        />
      </div>
    </Drawer>
  );
};
