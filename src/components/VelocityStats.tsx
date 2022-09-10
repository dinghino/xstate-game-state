import React from "react";
import { useSelector } from "@xstate/react";
import { Stack, Badge, Group, Center, Divider, DefaultMantineColor, Progress, ProgressProps } from "@mantine/core";
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

interface ISpeedBar {
  value: number;
  max: number;
  colors?: {pos: DefaultMantineColor, neg: DefaultMantineColor}
  reversed?:boolean
}

const SpeedBar: React.FC<ISpeedBar & ProgressProps> = ({value, max, reversed, colors = {pos:'teal', neg: 'orange'}, ...props}) => {
  const barValue = Math.abs(+evalPercent(value+max * (reversed ? -1 : 1), max*2));
  const color = barValue === 50 ? 'cyan' : barValue > 50 ? colors.pos : colors.neg
  return <Progress color={color} radius="xs" size="xs" {...props} value={barValue} />
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
      {(velocity[axis] * 100 * (reverse ? -1 : 1)).toFixed(2).padStart(6, '0')}
    </Badge>
  )

  return (
    <Wrapper>
      <Stack>
        <Divider label="Position" labelPosition="center"/>
        <Inner>
          <Stack>
            <StatBadge left="X" axis="left" color="red"/>
            <SpeedBar value={velocity.left} max={settings.left.max} />
          </Stack>
          <Stack>
            <StatBadge left="Y" axis="up" color="green"/>
            <SpeedBar value={velocity.up} max={settings.up.max}  />
          </Stack>
          <Stack>
            <StatBadge left="Z" axis="forward" reverse color="blue" />
            <SpeedBar value={velocity.forward} max={settings.forward.max} reversed />
          </Stack>
        </Inner>
      </Stack>
      {Splitter}
      <Stack>
        <Divider label="Rotation" labelPosition="center" mt={vertical ? 'sm' : undefined}/>
        <Inner>
          <Stack>
            <StatBadge left="X" axis="pitch" reverse color="red" />
            <SpeedBar value={velocity.pitch} max={settings.pitch.max} />
          </Stack>
          <Stack>
            <StatBadge left="Y" axis="yaw" color="green" />
            <SpeedBar value={velocity.yaw} max={settings.yaw.max} />
          </Stack>
          <Stack>
            <StatBadge left="Z" axis="roll" color="blue" />
            <SpeedBar value={velocity.roll} max={settings.roll.max} />
          </Stack>
        </Inner>
      </Stack>
    </Wrapper>
  );
};
