import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { NotificationFormValues } from "@/hooks/use-settings";
import { UseFormReturn } from "react-hook-form";

interface NotificationsFormProps {
  form: UseFormReturn<NotificationFormValues>;
  onSubmit: (data: NotificationFormValues) => void;
}

export function NotificationsForm({ form, onSubmit }: NotificationsFormProps) {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t('settings.notifications.email.label')}
                </FormLabel>
                <FormDescription>
                  {t('settings.notifications.email.description')}
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
        <FormField
          control={form.control}
          name="marketing_emails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t('settings.notifications.marketing.label')}
                </FormLabel>
                <FormDescription>
                  {t('settings.notifications.marketing.description')}
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
        <Button type="submit">{t('settings.notifications.submit')}</Button>
      </form>
    </Form>
  );
}