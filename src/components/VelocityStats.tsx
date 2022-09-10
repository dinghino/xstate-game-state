import React from "react";
import { useSelector } from "@xstate/react";
import { Stack, Badge, Group, Center, Divider, DefaultMantineColor, ProgressProps } from "@mantine/core";
import { playerService } from "../state";

function evalPercent(current: number, max: number, reverse = false) {
  return ((current / max) * 100 * (reverse ? -1 : 1)).toFixed(2);
}

interface IStatBadge<Axis extends string> {
  left?: React.ReactNode,
  axis: Axis,
  reverse?:boolean,
  color?: DefaultMantineColor
}
export const VelocityStats = ({ vertical = false }: { vertical?: boolean }) => {
  const playerState = useSelector(playerService, ({ context }) => context.values);
  const velocity = useSelector(playerState, ({ context }) => context.velocity);
  const settings = useSelector(playerState, ({ context }) => context.settings);

  const Wrapper = vertical ? React.Fragment : Center;
  const Inner = vertical ? Stack : Group;
  const Splitter = vertical ? null : <Divider orientation="vertical" mx="xl" />;

  const StatBadge: React.FC<IStatBadge<keyof typeof velocity>> = ({left, axis, reverse, color}) => (
    <Badge size="lg" radius="sm" leftSection={left} color={color} variant="dot">
      {evalPercent(velocity[axis], settings[axis].max, reverse)}%
    </Badge>
  )

  return (
    <Wrapper>
      <Stack>
        <Divider label="Position" labelPosition="center"/>
        <Inner>
          <StatBadge left="X" axis="left" color="red"/>
          <StatBadge left="Y" axis="up" color="green"/>
          <StatBadge left="Z" axis="forward" reverse color="blue" />
        </Inner>
      </Stack>
      {Splitter}
      <Stack>
        <Divider label="Rotation" labelPosition="center" mt={vertical ? 'sm' : undefined}/>
        <Inner>
          <StatBadge left="X" axis="pitch" reverse color="red" />
          <StatBadge left="Y" axis="yaw" color="green" />
          <StatBadge left="Z" axis="roll" color="blue" />
        </Inner>
      </Stack>
    </Wrapper>
  );
};
