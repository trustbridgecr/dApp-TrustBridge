import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CryptoFormValues } from "@/hooks/use-settings";
import { UseFormReturn } from "react-hook-form";
import { Clipboard, Check } from "lucide-react";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";

interface CryptoFormProps {
  form: UseFormReturn<CryptoFormValues>;
  onSubmit: (data: CryptoFormValues) => void;
}

export function CryptoForm({ form, onSubmit }: CryptoFormProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const address = useGlobalAuthenticationStore((state) => state.address);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="wallet_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input value={address || field.value} disabled />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(address || field.value)}
                  >
                    {copiedAddress ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                This is your wallet address for receiving and sending
                cryptocurrencies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferred_currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Cryptocurrency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="XLM">Stellar (XLM)</SelectItem>
                  <SelectItem value="STARKNET">Starknet (STARK)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This will be the default cryptocurrency for your transactions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="auto_convert"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Convert</FormLabel>
                <FormDescription>
                  Automatically convert received loans to your preferred
                  cryptocurrency.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Update Crypto Settings</Button>
      </form>
    </Form>
  );
}
