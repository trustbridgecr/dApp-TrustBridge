import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AccountFormValues } from "@/hooks/use-settings";
import { UseFormReturn } from "react-hook-form";

interface AccountFormProps {
  form: UseFormReturn<AccountFormValues>;
  onSubmit: (data: AccountFormValues) => void;
}

export function AccountForm({ form, onSubmit }: AccountFormProps) {
  const { t } = useTranslation();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.account.fullName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('settings.account.fullName.placeholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('settings.account.fullName.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.account.dob.label')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.account.language.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.account.language.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">{t('settings.account.language.options.en')}</SelectItem>
                  <SelectItem value="es">{t('settings.account.language.options.es')}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('settings.account.language.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('settings.account.submit')}</Button>
      </form>
    </Form>
  );
}