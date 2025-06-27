import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    onPress: { action: "pressed" },
  },
  decorators: [
    (Story) => (
      <View flex={1} items="center" justify="center">
        <Story />
      </View>
    ),
  ],
  render: (args) => (
    <Button {...args}>
      <Button.Text>{args.children}</Button.Text>
    </Button>
  ),
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};
