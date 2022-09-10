import React, { useCallback, useMemo } from "react";
import { useSelector } from "@xstate/react";
import { Stack, Badge, Group, Center, Divider, DefaultMantineColor, Progress, ProgressProps } from "@mantine/core";
import { playerService } from "../state";

function evalPercent(current: number, max: number, reverse = false) {
  return ((current / max) * 100 * (reverse ? -1 : 1)).toFixed(2);
}

interface IStatBadge {
  label?: React.ReactNode,
  value: number,
  reverse?:boolean,
  color?: DefaultMantineColor
}

interface ISpeedBar {
  value: number;
  max: number;
  colors?: {pos: DefaultMantineColor, neg: DefaultMantineColor}
  reversed?:boolean
}

const StatBadge:React.FC<IStatBadge> = ({value, label, reverse, color}) => {
  const actual = useMemo(() => value * 100 * (reverse ? -1 : 1), [value, reverse]);
  return (
    <Badge size="lg" radius="sm" leftSection={label} color={color} variant="dot">
      {actual.toFixed(2).padStart(5, '0')}
    </Badge>
  )
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

  const barValues = (axis: keyof typeof velocity) => ({value: velocity[axis], max: settings[axis].max });

  return (
    <Wrapper>

      <Stack>
        <Divider label="Position" labelPosition="center"/>
        <Inner>
          <Stack>
            <StatBadge value={velocity.left} label="X" color="red"/>
            <SpeedBar {...barValues('left')} />
          </Stack>
          <Stack>
            <StatBadge value={velocity.up} label="Y" color="green"/>
            <SpeedBar {...barValues('up')} />
          </Stack>
          <Stack>
            <StatBadge value={velocity.forward} label="Z" reverse color="blue" />
            <SpeedBar {...barValues('forward')} reversed />
          </Stack>
        </Inner>
      </Stack>

      {/* {vertical ? null : <Divider orientation="vertical" mx="xl" />} */}

      <Stack ml="sm">
        <Divider label="Rotation" labelPosition="center" mt={vertical ? 'sm' : undefined}/>
        <Inner>
          <Stack>
            <StatBadge value={velocity.pitch} label="X" reverse color="red" />
            <SpeedBar {...barValues('pitch')} />
          </Stack>
          <Stack>
            <StatBadge value={velocity.yaw} label="Y" color="green" />
            <SpeedBar {...barValues('yaw')} />
          </Stack>
          <Stack>
            <StatBadge value={velocity.roll} label="Z" color="blue" />
            <SpeedBar {...barValues('roll')} />
          </Stack>
        </Inner>
      </Stack>
    </Wrapper>
  );
};


const TransformStats: React.FC = () => {
  const playerState = useSelector(playerService, ({ context }) => context.values);
  const {position, rotation} = useSelector(playerState, ({ context }) => context.transform);

  const Badges = ({rot}: {rot?: boolean}) => (
    <Group>
      <StatBadge label="X" value={(rot ? rotation : position)[0]} />
      <StatBadge label="Y" value={(rot ? rotation : position)[1]} />
      <StatBadge label="Z" value={(rot ? rotation : position)[2]} />
    </Group>
  )

  return (
    <>
      <Badges />
      <Badges rot />
    </>
  )
}
