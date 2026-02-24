export const logEvent = (category: string, action: string, label?: string) => {
    gtag('event', action, {
        event_category: category,
        event_label: label,
    });
};