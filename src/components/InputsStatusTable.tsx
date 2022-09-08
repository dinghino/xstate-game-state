import React from "react";
import { Button, Divider, Group, Table, Text } from "@mantine/core";

import { TControllerType } from "../machines/types";

import service from "../state";
import { useSelector } from "@xstate/react";

type ControlValues = {
  type: TControllerType;
  active: boolean;
  start: () => void;
  stop: () => void;
};

const InputStatusRow: React.FC<{ manager: ControlValues }> = ({ manager }) => {
  const status = React.useMemo(() => (manager.active ? "active" : "inactive"), [
    manager.active
  ]);

  return (
    <tr key={manager.type}>
      <td>{manager.type}</td>
      <td>{status}</td>
      <td>
        <Group spacing="xl" align="right">
          <Button
            variant="light"
            size="xs"
            onClick={manager.start}
            disabled={manager.active}
          >
            Start
          </Button>
          <Button
            variant="light"
            size="xs"
            onClick={manager.stop}
            disabled={!manager.active}
          >
            Stop
          </Button>
        </Group>
      </td>
    </tr>
  );
};

export const InputsStatusTable: React.FC = () => {
  const values = useSelector(service, ({ context }) => context.values);
  return (
    <Table striped highlightOnHover horizontalSpacing="xl" captionSide="top">
      <caption>
        Inputs status{" "}
        <Text span color={updater.active ? "green" : "red"}>
          ({updater.active ? "" : "not"} updating)
        </Text>
      </caption>
      <tbody>
        {controllers.map((c) => (
          <InputStatusRow manager={c} key={c.type} />
        ))}
        <tr>
          <td colSpan={3}>
            <Divider />
          </td>
        </tr>
        <tr>
          <td>Pitch</td>
          <td>{values.pitch.toFixed(4)}</td>
        </tr>
        <tr>
          <td>Yaw</td>
          <td>{values.yaw.toFixed(4)}</td>
        </tr>
      </tbody>
    </Table>
  );
};
