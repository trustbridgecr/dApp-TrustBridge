import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
              <FormLabel>{t("settings.crypto.walletAddress.label")}</FormLabel>
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
                {t("settings.crypto.walletAddress.description")}
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
              <FormLabel>
                {t("settings.crypto.preferredCurrency.label")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "settings.crypto.preferredCurrency.placeholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="XLM">Stellar (XLM)</SelectItem>
                  <SelectItem value="STARKNET">Starknet (STARK)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("settings.crypto.preferredCurrency.description")}
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
                <FormLabel className="text-base">
                  {t("settings.crypto.autoConvert.label")}
                </FormLabel>
                <FormDescription>
                  {t("settings.crypto.autoConvert.description")}
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
        <Button type="submit">{t("settings.crypto.submit")}</Button>
      </form>
    </Form>
  );
}
