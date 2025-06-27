import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Components/Input",
  tags: ["autodocs"],
  argTypes: {
    onChangeText: { action: "changed" },
  },
  decorators: [
    (Story) => (
      <View flex={1} items="center" justify="center" p="$8">
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = {
  args: {
    placeholder: "Enter text",
  },
};
