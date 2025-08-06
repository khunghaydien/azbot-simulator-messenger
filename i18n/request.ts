

import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from './service';
export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    return {
        locale,
        messages: (await import(`@/i18n/messsages/${locale}.json`)).default
    };
});