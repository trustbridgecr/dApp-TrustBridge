import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import TooltipInfo from "./Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "../../ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  tooltipContent: string;
  options: { value: string | undefined; label: string }[];
  className?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  name,
  label,
  tooltipContent,
  options,
  className,
  required,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="flex items-center">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
                {tooltipContent && <TooltipInfo content={tooltipContent} />}
              </FormLabel>
            )}
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedOption?.label ?? "Select"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              field.onChange(option.value);
                            }}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
