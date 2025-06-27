import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";
import { OtpInput } from "./OtpInput";

const meta: Meta<typeof OtpInput> = {
  component: OtpInput,
  title: "Components/OtpInput",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View flex={1} items="center" justify="center" p="$8">
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OtpInput>;

export const Basic: Story = {
  args: {},
};
