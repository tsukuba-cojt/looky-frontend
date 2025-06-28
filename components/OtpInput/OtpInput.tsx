import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, XStack } from "tamagui";
import { Input } from "@/components/Input";
import { otpSchema } from "@/schemas/auth";

interface FormData {
  [key: string]: string;
}

interface OtpInputProps {
  onEnter: (code: number) => void;
}

export const OtpInput = ({ onEnter }: OtpInputProps) => {
  const length = 6;

  const [translateX, setTranslateX] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(otpSchema),
    defaultValues: Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [i.toString(), ""]),
    ),
  });

  const onFocusChange = (id: number, value: string) => {
    if (value === "") {
      setFocus((id - 1).toString());
    } else {
      setFocus((id + 1).toString());
    }
  };

  const onSubmit = handleSubmit((data) => {
    const code = Number(Object.values(data).join(""));
    onEnter(code);
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setTranslateX(-20);
      const timeout = setTimeout(() => {
        setTranslateX(20);
        setTimeout(() => {
          setTranslateX(0);
          reset();
        }, 50);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [reset, errors]);

  return (
    <Form onSubmit={onSubmit}>
      <XStack gap="$2.5" x={translateX} animation="quick">
        {Array(length)
          .fill(null)
          .map((_, id) => {
            return (
              <Controller
                key={id.toString()}
                name={id.toString()}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    {...register(id.toString())}
                    inputMode="numeric"
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoComplete="one-time-code"
                    // secureTextEntry
                    enterKeyHint={id === length - 1 ? "done" : "next"}
                    text="center"
                    w="$11"
                    h="$11"
                    fontSize="$xl"
                    rounded="$md"
                    focusStyle={{
                      bg: "$mutedBackground",
                    }}
                    value={value}
                    autoFocus={id === 0}
                    onChangeText={(code: string) => {
                      console.log(code)
                      if (code.length === length) {
                        const digits = code.split("");
                        console.log(digits)
                        digits.forEach((digit, index) => {
                          setValue(index.toString(), digit);
                        });

                        setFocus((length - 1).toString());

                        onSubmit();
                      } else {
                        onChange(code.split("")[0]);
                        onFocusChange(id, code);

                        if (id === length - 1) {
                          onSubmit();
                        }
                      }
                    }}
                    onKeyPress={(e) => {
                      const event = e.nativeEvent;
                      if (event.key === "Backspace") {
                        if (value !== "") {
                          onChange("");
                        } else {
                          onFocusChange(id, value);
                        }
                      }
                      if (event.key === "Enter") {
                        onSubmit();
                      }
                    }}
                  />
                )}
              />
            );
          })}
      </XStack>
    </Form>
  );
};
